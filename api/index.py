import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json

app = FastAPI(title="KIMS AI Backend")

# Enable CORS for the KIMS website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "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")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = os.environ.get("GROQ_MODEL", "llama3-70b-8192")

KIMS_SYSTEM = """You are KAIA, the professional AI assistant for Koshys Institute of Management Studies (KIMS), Bengaluru.
Your goal is to assist students and parents with admission queries, course details, campus life, and placements.

INSTITUTION DETAILS:
- Name: Koshys Institute of Management Studies (KIMS)
- Established: 2003 (23+ years of excellence)
- Location: Hennur-Bagalur Road, Kannur P.O., Bengaluru, Karnataka 562149.
- Affiliation: Bangalore City University (BCU).
- Approval: AICTE New Delhi.

CORE DEPARTMENTS & COURSES:
1. Management: BBA (General, Aviation, Industry Integrated), MBA (Fintech, Data Science, Strategic Leadership).
2. Commerce: B.Com (General, Logistics & Supply Chain Management).
3. Technology: BCA (AI, Cloud Computing, Cybersecurity), MCA.
4. Arts & Design: BVA (Animation & Multimedia, Graphic Design, Interior & Spatial Design - 4 Year programs).
5. Science: B.Sc Forensic Science (3 Years with lab training).

COURSE HIGHLIGHTS:
- BVA Interior & Spatial Design: Focuses on space planning, furniture design, and industrial exposure.
- B.Com Logistics: Industry integrated with certifications in SAP, Tally, and Advanced Excel.
- Placements: 100% assistance, 150+ partners (Amazon, Deloitte, Wipro). Avg Package 5.2 LPA.

RULES:
1. Be professional, warm, and helpful.
2. For fee questions: "For detailed fee structures and scholarship options, please contact our admission counselor at +91 81472 15707."
3. Keep responses concise (2-4 sentences). Use bullet points for lists.
4. If unsure, suggest visiting the campus or calling the admission team.
5. End with a helpful follow-up question.
"""

async def get_ai_response(messages: list) -> str:
    groq_messages = [{"role": "system", "content": KIMS_SYSTEM}]
    
    # Limit history to last 10 messages
    for msg in messages[-10:]:
        if isinstance(msg, dict) and "content" in msg:
            role = "user" if msg.get("role") == "user" else "assistant"
            groq_messages.append({"role": role, "content": msg.get("content", "")})

    payload = {
        "model": MODEL,
        "messages": groq_messages,
        "temperature": 0.7,
        "max_tokens": 500
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(GROQ_URL, json=payload, headers=headers)
            if response.status_code != 200:
                try:
                    err_data = response.json()
                    err_msg = err_data.get("error", {}).get("message", "Unknown Groq Error")
                except:
                    err_msg = response.text[:100]
                return f"Technical moment (Status {response.status_code}: {err_msg}). Please try again."
            
            data = response.json()
            return data['choices'][0]['message']['content']
    except Exception:
        return "I'm currently adjusting my brain. Please try again later or call 81472 15707."

@app.get("/")
async def root():
    return {"status": "KIMS AI Running", "v": "2.5"}

@app.get("/api")
async def api_health():
    return {"api": "active", "groq_configured": bool(GROQ_API_KEY)}

@app.post("/api/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        messages = body.get("messages", [])
        # Support both 'message' (reference bot) and 'messages' (original widget) formats
        if not messages and body.get("message"):
            messages = [{"role": "user", "content": body.get("message")}]
            
        response_text = await get_ai_response(messages)
        return {"response": response_text, "reply": response_text} # Success parity with both formats
    except Exception as e:
        return {"response": "Brain freeze! Please try again.", "reply": "Brain freeze!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
