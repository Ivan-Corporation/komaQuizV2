from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.quiz_submission import QuizSubmissionModel
from app.models.user import User
from app.services.auth import get_current_user

router = APIRouter(tags=["Analytics"])

@router.get("/analytics")
def get_all_quiz_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_submissions = db.query(QuizSubmissionModel).filter_by(
        user_id=current_user.id
    ).all()

    ai_subs = [s for s in all_submissions if s.is_generated]
    manual_subs = [s for s in all_submissions if not s.is_generated]

    def summarize(subs):
        if not subs:
            return {
                "total_quizzes": 0,
                "average_score": 0,
                "recent": [],
            }
        total = len(subs)
        avg = sum(s.score for s in subs) / total
        recent = [
                    {
                        "id": s.id,
                        "quiz_id": s.quiz_id,
                        "score": s.score,
                        "correct_answers": s.correct_answers,
                        "total_questions": s.total_questions,
                        "submitted_at": s.submitted_at,
                    }
                    for s in sorted(
                        [s for s in subs if s.submitted_at is not None],  # filter out bad data
                        key=lambda x: x.submitted_at,
                        reverse=True
                    )[:5]
                ]
        return {
            "total_quizzes": total,
            "average_score": round(avg, 2),
            "recent": recent,
        }

    return {
        "ai": summarize(ai_subs),
        "manual": summarize(manual_subs)
    }