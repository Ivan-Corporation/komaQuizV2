from sqlalchemy.orm import Session
from app.models.quiz import Quiz, Question, Answer
from app.schemas.quiz import QuizCreate
from app.models.user import User

def create_quiz(db: Session, quiz_data: QuizCreate, owner: User) -> Quiz:
    quiz = Quiz(title=quiz_data.title, description=quiz_data.description, owner_id=owner.id)
    db.add(quiz)
    db.flush()  # to get quiz.id before adding questions

    for q in quiz_data.questions:
        question = Question(text=q.text, quiz_id=quiz.id)
        db.add(question)
        db.flush()

        for a in q.answers:
            answer = Answer(text=a.text, is_correct=a.is_correct, question_id=question.id)
            db.add(answer)

    db.commit()
    db.refresh(quiz)
    return quiz

def get_quiz_by_id(db: Session, quiz_id: int) -> Quiz:
    return db.query(Quiz).filter(Quiz.id == quiz_id).first()

def get_all_quizzes(db: Session) -> list[Quiz]:
    return db.query(Quiz).all()

def update_quiz(db: Session, quiz_id: int, quiz_data: QuizCreate, owner: User) -> Quiz:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.owner_id == owner.id).first()
    if not quiz:
        return None

    quiz.title = quiz_data.title
    quiz.description = quiz_data.description

    # Delete old questions and answers
    for question in quiz.questions:
        db.query(Answer).filter(Answer.question_id == question.id).delete()
    db.query(Question).filter(Question.quiz_id == quiz.id).delete()

    db.flush()

    # Add updated questions and answers
    for q in quiz_data.questions:
        question = Question(text=q.text, quiz_id=quiz.id)
        db.add(question)
        db.flush()

        for a in q.answers:
            answer = Answer(text=a.text, is_correct=a.is_correct, question_id=question.id)
            db.add(answer)

    db.commit()
    db.refresh(quiz)
    return quiz


def delete_quiz(db: Session, quiz_id: int, owner: User) -> bool:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.owner_id == owner.id).first()
    if not quiz:
        return False

    db.delete(quiz)
    db.commit()
    return True