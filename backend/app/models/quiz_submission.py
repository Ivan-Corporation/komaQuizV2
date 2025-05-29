
from sqlalchemy import Column, Integer, ForeignKey, JSON, Boolean, String
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime
from sqlalchemy import DateTime

class QuizSubmissionModel(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)
    correct_answers = Column(Integer)
    total_questions = Column(Integer)
    answers = Column(JSON)  # assuming you're storing as JSON
    submitted_at = Column(DateTime, default=datetime.utcnow)
    is_generated = Column(Boolean, default=False)
    topic = Column(String, nullable=True)
    ai_questions = Column(JSON, nullable=True)
    ai_answers = Column(JSON, nullable=True)

    user = relationship("User")
    quiz = relationship("Quiz")
