from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.quiz_submission import QuizSubmissionModel
from app.services.auth import get_current_user
from app.schemas.submission import QuizSubmissionOut
from app.models.user import User
from typing import List
from app.schemas.user import UserOut, WalletConnectRequest

router = APIRouter(tags=["users"])

@router.get("/me/submissions", response_model=List[QuizSubmissionOut])
def get_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(QuizSubmissionModel).filter_by(user_id=current_user.id).all()


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/me/wallet")
def connect_wallet(
    data: WalletConnectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.wallet_address = data.wallet_address.lower()
    db.commit()
    return {"message": "Wallet connected successfully"}