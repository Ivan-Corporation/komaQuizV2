from app.config import HUGGING_FACE_TOKEN
from app.schemas.quiz import GeneratedQuizSubmission
from app.schemas.submission import QuizSubmissionOut
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import json
import re
import httpx

from app.models.quiz_submission import QuizSubmissionModel
from app.models.user import User
from app.services.auth import get_current_user
from app.db import get_db

router = APIRouter(tags=["AI Quiz Generator"])


class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int


@router.post("/generate-quiz", response_model=List[QuizQuestion])
async def generate_quiz(data: QuizRequest):
    prompt = (
        f"Generate a multiple-choice quiz about {data.topic}. "
        f"Provide {data.num_questions} questions. "
        f"Each question should have exactly 4 options and 1 correct answer. "
        f"Respond only in this JSON format: "
        f"""[
  {{
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "correct_index": 1
  }}
]"""
    )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {HUGGING_FACE_TOKEN}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "HuggingFaceH4/zephyr-7b-beta",
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                },
                timeout=60.0,
            )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Hugging Face API error: {response.status_code}: {response.text}")

        result = response.json()
        generated = result["choices"][0]["message"]["content"]

        # Extract valid JSON array
        match = re.search(r"\[\s*{.*?}\s*]", generated, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in model output")

        quiz_data = json.loads(match.group(0))
        validated = [QuizQuestion(**item) for item in quiz_data]
        return validated

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {e}")

