from app.schemas.ai_submission import SaveAISubmissionRequest
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.auth import get_current_user
from app.models.quiz_submission import QuizSubmissionModel
from app.models.user import User
from datetime import datetime
from app.utils.experience import award_experience_and_achievements

router = APIRouter(tags=["AI Submissions"])

@router.post("/submissions/ai")
async def save_ai_submission(
    submission: SaveAISubmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        new_submission = QuizSubmissionModel(
            user_id=current_user.id,
            quiz_id=None,
            score=submission.score,
            total_questions=submission.total_questions,
            correct_answers=submission.score,
            submitted_at=datetime.utcnow(),
            is_generated=True,
            ai_questions=[q.dict() for q in submission.questions],
            ai_answers=submission.answers,
            topic=submission.topic
        )
        db.add(new_submission)
        
        award_experience_and_achievements(current_user, new_submission, db)

        db.commit()
        db.refresh(new_submission)

        return {"status": "saved", "submission_id": new_submission.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))