from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))

    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    is_correct = Column(Boolean)
    question_id = Column(Integer, ForeignKey("questions.id"))

    question = relationship("Question", back_populates="answers")
