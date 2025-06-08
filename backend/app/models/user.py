from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from app.db import Base
import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableList, MutableDict

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    quizzes = relationship("Quiz", back_populates="owner")
    submissions = relationship("QuizSubmissionModel", back_populates="user")
    experience_points = Column(Integer, default=0, nullable=False)
    achievements = Column(MutableList.as_mutable(JSON), default=list)
    level = Column(Integer, default=1, nullable=False)
    topic_experience = Column(MutableDict.as_mutable(JSON), default=dict)
    wallet_address = Column(String, unique=True, nullable=True)