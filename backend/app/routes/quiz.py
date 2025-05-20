from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import Session
from typing import List
from app.schemas.quiz import QuizCreate, QuizOut
from app.services.quiz import create_quiz, get_quiz_by_id, get_all_quizzes, update_quiz, delete_quiz
from app.db import get_db
from app.services.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel
from app.models.quiz_submission import QuizSubmissionModel
from app.schemas.submission import QuizSubmissionCreate, QuizSubmissionOut
from datetime import datetime

router = APIRouter(tags=["quizzes"])


class QuizSubmission(BaseModel):
    answers: dict[int, int]  # {question_id: selected_answer_id}

class QuizResult(BaseModel):
    score: int
    total: int
    percentage: float

@router.post("/", response_model=QuizOut)
def create_new_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_quiz(db, quiz_data, current_user)

@router.get("/", response_model=List[QuizOut])
def list_quizzes(db: Session = Depends(get_db)):
    return get_all_quizzes(db)


@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return quiz

@router.put("/{quiz_id}", response_model=QuizOut)
def update_existing_quiz(
    quiz_id: int,
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = update_quiz(db, quiz_id, quiz_data, current_user)
    if not updated:
        raise HTTPException(status_code=404, detail="Quiz not found or not owned by user")
    return updated

@router.delete("/{quiz_id}", status_code=204)
def delete_existing_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = delete_quiz(db, quiz_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Quiz not found or not owned by user")
    return




@router.post("/{quiz_id}/submit", response_model=QuizSubmissionOut)
def submit_quiz(
    quiz_id: int,
    data: QuizSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(404, detail="Quiz not found")

    total = len(quiz.questions)
    correct = 0

    # Convert list to dict for easier lookup
    answer_map = {item.question_id: item.answer_id for item in data.answers}

    for question in quiz.questions:
        correct_answer = next((a for a in question.answers if a.is_correct), None)
        selected_id = answer_map.get(question.id)
        if correct_answer and selected_id == correct_answer.id:
            correct += 1

    submission = QuizSubmissionModel(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=correct,
        correct_answers=correct,
        total_questions=total,
        answers=answer_map,  # stored as JSON
        submitted_at=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission