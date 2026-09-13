from google import genai
from app.config import settings
import json


class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = "gemini-3.6-flash"

    # ---------------------------------------------------------
    # Helper: clean Gemini JSON response
    # ---------------------------------------------------------
    def _clean_json(self, text: str) -> dict:
        text = text.strip()

        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        return json.loads(text)

    # ---------------------------------------------------------
    # Medical Report / PDF Analysis
    # ---------------------------------------------------------
    def analyze_medical_text(self, text: str) -> dict:

        prompt = f"""
You are an AI medical report analysis assistant.

Analyze the medical report text provided below.

IMPORTANT RULES:
1. Return valid JSON only.
2. Do not use Markdown.
3. Do not invent patient information.
4. If information is not available, use null or an empty array.
5. Do not make a definitive medical diagnosis.
6. Clearly distinguish reported findings from AI interpretation.
7. Recommendations should encourage consultation with an appropriate qualified healthcare professional.
8. Do not create fake confidence percentages.

Return exactly this JSON structure:

{{
    "patient_name": null,
    "age": null,
    "gender": null,
    "test_type": null,
    "hospital": null,
    "doctor": null,
    "date": null,
    "summary": "",
    "findings": [],
    "risk_level": "unknown",
    "recommendations": [],
    "lifestyle_advice": [],
    "suggested_specialist": null
}}

Medical Report:
{text}
"""

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )

            result = self._clean_json(response.text)

            return result

        except Exception as e:

            print("=" * 60)
            print("GEMINI MEDICAL TEXT ERROR:")
            print(repr(e))
            print("=" * 60)

            return {
                "error": "Failed to analyze medical report",
                "patient_name": None,
                "age": None,
                "gender": None,
                "test_type": None,
                "hospital": None,
                "doctor": None,
                "date": None,
                "summary": "Unable to complete the medical report analysis.",
                "findings": [],
                "risk_level": "unknown",
                "recommendations": [
                    "Please consult a qualified medical professional."
                ],
                "lifestyle_advice": [],
                "suggested_specialist": None
            }

    # ---------------------------------------------------------
    # Medical Image Analysis
    # ---------------------------------------------------------
    def analyze_medical_image(self, file_path: str) -> dict:

        prompt = """
You are an AI medical image analysis assistant.

Analyze the supplied medical image.

The image may be:
- X-Ray
- MRI
- CT scan
- Ultrasound
- Other medical imaging

IMPORTANT RULES:

1. Return valid JSON only.
2. Do not use Markdown.
3. Do not invent abnormalities.
4. Do not provide a definitive diagnosis.
5. If the image quality is insufficient, clearly say so.
6. Describe visible findings cautiously.
7. Do not generate a fake numerical confidence percentage.
8. Do not claim certainty.
9. Recommendations should encourage review by a qualified medical professional.
10. If you cannot reliably interpret the image, say that the image requires professional radiological review.

Return exactly this JSON structure:

{
    "summary": "",
    "findings": [],
    "risk_level": "unknown",
    "recommendations": [],
    "suggested_specialist": null
}
"""

        try:

            # IMPORTANT:
            # The installed Google GenAI SDK expects "path"
            # instead of "file" for this upload call.
            uploaded_file = self.client.files.upload(
                path=file_path
            )

            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    uploaded_file,
                    prompt
                ]
            )

            result = self._clean_json(response.text)

            return result

        except Exception as e:

            print("=" * 60)
            print("GEMINI IMAGE ERROR:")
            print(repr(e))
            print("=" * 60)

            return {
                "error": str(e),
                "summary": "Unable to complete AI image analysis.",
                "findings": [],
                "risk_level": "unknown",
                "recommendations": [
                    "Please have the image reviewed by a qualified medical professional.",
                    "Do not rely on AI analysis alone for diagnosis."
                ],
                "suggested_specialist": None
            }

    # ---------------------------------------------------------
    # Medical Chatbot
    # ---------------------------------------------------------
    def chat_with_context(
        self,
        message: str,
        context: str = ""
    ) -> str:

        prompt = f"""
You are MediVision AI, a healthcare information assistant.

Your job is to help users understand medical information in simple
and understandable language.

IMPORTANT:
- Do not claim to be a doctor.
- Do not provide definitive diagnosis.
- Do not prescribe medicines.
- Do not tell users to stop or change prescribed medication.
- Explain medical terminology in simple language.
- If the user provides a medical report, explain what it says.
- If information is missing, ask the user to provide the relevant report
  or details.
- For serious symptoms, recommend appropriate professional medical care.
- Be calm, clear and helpful.

Additional medical context:
{context}

User question:
{message}
"""

        try:

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )

            return response.text.strip()

        except Exception as e:

            print("=" * 60)
            print("GEMINI CHAT ERROR:")
            print(repr(e))
            print("=" * 60)

            return (
                "Sorry, I could not process your question right now. "
                "Please try again."
            )


# ---------------------------------------------------------
# Create AI service instance
# ---------------------------------------------------------

ai_service = AIService()