from pydantic import BaseModel
from typing import List, Optional

class AnswerCreate(BaseModel):
    text: str
    is_correct: bool

class QuestionCreate(BaseModel):
    text: str
    answers: List[AnswerCreate]

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    questions: List[QuestionCreate]

class AnswerOut(BaseModel):
    id: int
    text: str

    class Config:
        from_attributes = True

class QuestionOut(BaseModel):
    id: int
    text: str
    answers: List[AnswerOut]

    class Config:
        from_attributes = True

class QuizOut(BaseModel):
    id: int
    title: str
    description: str
    owner_id: int
    questions: List[QuestionOut]

    class Config:
        from_attributes = True
