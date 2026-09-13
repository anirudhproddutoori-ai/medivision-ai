# MediVision AI Backend

Complete Python backend for MediVision, an AI-powered healthcare platform.

## Features
- FastAPI & MongoDB (Motor)
- JWT Authentication
- Medical PDF and Image AI Analysis (Gemini Integration)
- Report Generation (PDF)
- Context-aware Healthcare Chatbot

## Installation

1. Clone and navigate to `backend/`
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` and ensure MongoDB is running locally or provide a cloud URI.

## Running Locally

```bash
uvicorn app.main:app --reload --port 8000
```

Access API Documentation at `http://localhost:8000/docs`.
