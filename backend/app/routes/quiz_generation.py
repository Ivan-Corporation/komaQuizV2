import os
import json
import re
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.config import HUGGING_FACE_TOKEN  # Your server token

router = APIRouter(tags=["AI Quiz Generator"])

class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5
    model_api_url: Optional[str] = None
    model_name: Optional[str] = None
    prompt_template: Optional[str] = None
    hf_token: Optional[str] = None  # User token (optional)

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

def get_auth_header(token: Optional[str]):
    final_token = token or HUGGING_FACE_TOKEN
    return {
        "Authorization": f"Bearer {final_token}",
        "Content-Type": "application/json",
    }

@router.post("/generate-quiz", response_model=List[QuizQuestion])
async def generate_quiz(data: QuizRequest):
    DEFAULT_HF_URL = "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions"
    DEFAULT_MODEL_NAME = "HuggingFaceH4/zephyr-7b-beta"

    # Construct prompt
    try:
        prompt = data.prompt_template.format(topic=data.topic, count=data.num_questions) \
            if data.prompt_template else build_prompt(data.topic, data.num_questions)
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Invalid prompt template: missing {e}")

    # 1. Try local model first
    try:
        async with httpx.AsyncClient() as client:
            local_response = await client.post(
                "http://localhost:5005/generate",
                json={"prompt": prompt},
                timeout=260,
            )
            if local_response.status_code == 200:
                output = local_response.json()["text"]
                return parse_quiz_from_text(output)
    except Exception as local_error:
        print("⚠️ Local model failed:", local_error)

    # 2. Try custom Hugging Face model if provided
    if data.model_api_url and data.model_name:
        try:
            async with httpx.AsyncClient() as client:
                hf_response = await client.post(
                    data.model_api_url,
                    headers=get_auth_header(data.hf_token),
                    json={
                        "model": data.model_name,
                        "messages": [{"role": "user", "content": prompt}],
                        "stream": False,
                    },
                    timeout=60.0,
                )
                if hf_response.status_code == 200:
                    result = hf_response.json()
                    generated = result["choices"][0]["message"]["content"]
                    return parse_quiz_from_text(generated)
                else:
                    print("⚠️ Custom model call failed:", hf_response.text)
        except Exception as custom_error:
            print("⚠️ Custom Hugging Face model failed:", custom_error)

    # 3. Fallback to default Hugging Face Zephyr model
    try:
        async with httpx.AsyncClient() as client:
            hf_response = await client.post(
                DEFAULT_HF_URL,
                headers=get_auth_header(data.hf_token),
                json={
                    "model": DEFAULT_MODEL_NAME,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                },
                timeout=60.0,
            )
            if hf_response.status_code == 200:
                result = hf_response.json()
                generated = result["choices"][0]["message"]["content"]
                return parse_quiz_from_text(generated)
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Default HF model failed: {hf_response.status_code}: {hf_response.text}",
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz from all sources: {e}")
