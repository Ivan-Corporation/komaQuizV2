from fastapi import FastAPI
from app.routes import quiz, user, quiz_generation, ai_submission, analytics
from app.db import Base, engine
from app.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


# Create tables (temporary — in real world, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KomaQuizV2 API")

@app.get("/")
def read_root():
    return {"message": "Welcome to KomaQuiz API"}

app.include_router(auth_router, prefix="/auth")
app.include_router(quiz.router, prefix="/quizzes")
app.include_router(user.router, prefix="/users")
app.include_router(quiz_generation.router)
app.include_router(ai_submission.router)
app.include_router(analytics.router)

origins = [
    "http://localhost:5173",
    "https://koma-quiz-v2.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[    
        "http://localhost:5173",
        "https://koma-quiz-v2.vercel.app"],  # or "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
