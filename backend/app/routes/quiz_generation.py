import os
import json
import re
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.config import HUGGING_FACE_TOKEN  # Ensure you define this or load via env

router = APIRouter(tags=["AI Quiz Generator"])

class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int

def build_prompt(topic: str, count: int) -> str:
    return (
        f"Create {count} multiple choice quiz questions about '{topic}'.\n"
        "Format:\n"
        "Q: [question]\n"
        "A. Option A\n"
        "B. Option B\n"
        "C. Option C\n"
        "D. Option D\n"
        "Answer: [A/B/C/D]\n\n"
        "Start now:\n"
    )

def parse_quiz_from_text(text: str) -> List[QuizQuestion]:
    pattern = r"(?:\d+\.\s*)?(.*?)\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*?)\nAnswer:\s*([ABCD])"
    matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)

    label_to_index = {"A": 0, "B": 1, "C": 2, "D": 3}
    quiz = []

    for question, a, b, c, d, answer in matches:
        quiz.append(QuizQuestion(
            question=question.strip(),
            options=[a.strip(), b.strip(), c.strip(), d.strip()],
            correct_index=label_to_index[answer.strip().upper()]
        ))

    return quiz

@router.post("/generate-quiz", response_model=List[QuizQuestion])
async def generate_quiz(data: QuizRequest):
    prompt = build_prompt(data.topic, data.num_questions)

    # Try local model first
    try:
        async with httpx.AsyncClient() as client:
            local_response = await client.post(
                "http://localhost:5005/generate",
                json={"prompt": prompt},
                timeout=60,
            )
            if local_response.status_code == 200:
                output = local_response.json()["text"]
                try:
                    return parse_quiz_from_text(output)
                except Exception as parse_error:
                    raise ValueError(f"Local model output could not be parsed: {parse_error}")
    except Exception as local_error:
        print("⚠️ Local model failed, falling back to Hugging Face API:", local_error)

    # Fallback to Hugging Face API
    try:
        async with httpx.AsyncClient() as client:
            hf_response = await client.post(
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

        if hf_response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Hugging Face API error: {hf_response.status_code}: {hf_response.text}",
            )

        result = hf_response.json()
        generated = result["choices"][0]["message"]["content"]
        return parse_quiz_from_text(generated)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {e}")
