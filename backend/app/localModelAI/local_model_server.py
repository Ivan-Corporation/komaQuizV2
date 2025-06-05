from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import time 

app = FastAPI()

# Load Zephyr model
model_id = "HuggingFaceH4/zephyr-7b-beta"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")

# Use chat pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
def generate_text(req: PromptRequest):
    print("📥 Prompt received:", req.prompt)

    prompt = (
        "<|system|>\n"
        "You are a helpful assistant that generates multiple-choice quizzes in a consistent format.\n"
        "<|user|>\n"
        f"{req.prompt}\n"
        "<|assistant|>"
    )

    start_time = time.time()
    result = generator(
        prompt,
        max_new_tokens=1024,
        do_sample=True,
        temperature=0.7,
    )[0]["generated_text"]
    end_time = time.time()

    print(f"🕒 Generation time: {end_time - start_time:.2f} seconds")
    print("🧪 Raw output from model:", result)
    return {"text": result}
