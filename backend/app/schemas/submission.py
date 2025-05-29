from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class QuizAnswer(BaseModel):
    question_id: int
    answer_id: int

class QuizSubmissionCreate(BaseModel):
    answers: List[QuizAnswer]

class QuizSubmissionOut(BaseModel):
    id: int
    user_id: int
    quiz_id: Optional[int]
    score: int
    correct_answers: int
    total_questions: int
    submitted_at: Optional[datetime]

    class Config:
        from_attributes = True
