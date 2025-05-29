from pydantic import BaseModel
from typing import List

class GeneratedQuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int

class SaveAISubmissionRequest(BaseModel):
    questions: List[GeneratedQuizQuestion]
    answers: List[int]
    score: int
    total_questions: int
    topic: str
