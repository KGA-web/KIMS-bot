import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json

app = FastAPI()

# Enable CORS for the KIMS website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-70b-versatile"

SYSTEM_PROMPT = """You are KIMS Bot, the official AI assistant for Koshys Institute of Management Studies (KIMS) Bengaluru.
Your goal is to assist students with admission queries, course details, campus life, and more.

INSTITUTION DETAILS:
- Name: Koshys Institute of Management Studies (KIMS)
- Location: Bengaluru, Karnataka, India.
- Affiliation: Bangalore City University (BCU).
- Approval: AICTE New Delhi.

MAJOR COURSES:
- BBA (Bachelor of Business Administration): General, Aviation, and Industry Integrated.
- MBA (Master of Business Administration): Fintech, Data Science, Strategic Leadership.
- BCA (Bachelor of Computer Applications): AI, Cloud Computing, Cybersecurity.
- B.Com (Bachelor of Commerce): Logistics, Supply Chain Management.
- B.Sc Forensic Science: 3-year program with specialized lab training.
- BVA (Bachelor of Visual Arts): Animation, Multimedia, Graphics.

KEY HIGHLIGHTS:
- 100% Placement assistance.
- Industry-integrated certification programs.
- Corporate partnerships with Amazon, Deloitte, TCS, Wipro.
- Average Package: 5.2 LPA | Highest Package: 12.5 LPA.

GUIDELINES:
1. Be professional, helpful, and welcoming.
2. If you don't know an answer, suggest the user contact the admission office at +91 81472 15707.
3. Keep responses concise and use bullet points for lists.
4. For fee queries, mention that fees are competitive and suggest filling out the inquiry form in the chat for the exact structure.
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Prepare payload for Groq
        groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        # Limit history to last 10 messages
        groq_messages.extend([m.dict() for m in request.messages[-10:]])

        payload = {
            "model": MODEL,
            "messages": groq_messages,
            "temperature": 0.7,
            "max_tokens": 1024
        }

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_URL, json=payload, headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Groq API Error")
            
            data = response.json()
            return {"response": data['choices'][0]['message']['content']}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
