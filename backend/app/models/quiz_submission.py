
from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime

class QuizSubmissionModel(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)
    correct_answers = Column(Integer)
    total_questions = Column(Integer)
    answers = Column(JSON)  # assuming you're storing as JSON
    submitted_at=datetime.utcnow()


    user = relationship("User")
    quiz = relationship("Quiz")
