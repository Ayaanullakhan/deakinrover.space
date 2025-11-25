# deakin_rover_ai.py

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
load_dotenv()


# -------------------- GROQ CLIENT SETUP --------------------

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set.")

client = Groq(api_key=GROQ_API_KEY)

# -------------------- FASTAPI SETUP ------------------------

app = FastAPI(
    title="Deakin Rover AI Assistant",
    description="Backend using FREE Groq Mixtral model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000","https://deakinrover.space"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------- MODELS ------------------------------

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# -------------------- ROUTES ------------------------------

@app.get("/")
def root():
    return {"status": "ok", "message": "Groq backend running."}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    user_message = payload.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # free Groq model
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are the Deakin Rover AI assistant. "
                        "Explain things clearly and concisely. "
                        "You can talk about the Deakin Rover project, student rover competitions "
                        "such as the Australian Rover Challenge, robotics, and lunar exploration. "
                        "If you are not sure about something, say that you are not sure."
                    ),
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
            temperature=0.7,
        )

        reply_text = completion.choices[0].message.content
        if not reply_text:
            raise RuntimeError("Model returned an empty response.")

        return ChatResponse(reply=reply_text)

    except HTTPException:
        raise
    except Exception as exc:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] Groq chat error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Groq model error. Try again.",
        )
