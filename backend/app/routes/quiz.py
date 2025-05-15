from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List
from app.schemas.quiz import QuizCreate, QuizOut
from app.services.quiz import create_quiz, get_quiz_by_id, get_all_quizzes, update_quiz, delete_quiz
from app.db import get_db
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

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
