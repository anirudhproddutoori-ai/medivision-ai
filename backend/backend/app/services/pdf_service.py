import os
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from app.config import settings
from datetime import datetime

def generate_pdf_report(data: dict) -> str:
    if not os.path.exists(settings.REPORT_FOLDER):
        os.makedirs(settings.REPORT_FOLDER)
        
    filename = f"report_{uuid.uuid4()}.pdf"
    file_path = os.path.join(settings.REPORT_FOLDER, filename)
    
    c = canvas.Canvas(file_path, pagesize=letter)
    
    # Hospital Style Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "MediVision AI Health Analytics")
    c.setFont("Helvetica", 10)
    c.drawString(50, 735, "Confidential AI Generated Medical Report")
    c.drawString(50, 720, f"Date: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    
    c.line(50, 710, 550, 710)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 680, "Patient Information:")
    c.setFont("Helvetica", 11)
    c.drawString(50, 660, f"Name: {data.get('patient_name', 'Unknown')}")
    c.drawString(50, 640, f"Age: {data.get('age', 'N/A')} | Gender: {data.get('gender', 'N/A')}")
    c.drawString(50, 620, f"Test Type: {data.get('test_type', 'Unknown')}")
    c.drawString(50, 600, f"Hospital: {data.get('hospital', 'Unknown')} | Doctor: {data.get('doctor', 'Unknown')}")
    
    c.line(50, 580, 550, 580)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 550, "Risk Assessment:")
    c.setFont("Helvetica", 11)
    c.drawString(50, 530, f"Risk Level: {str(data.get('risk_level', 'Unknown')).upper()}")
    c.drawString(50, 510, f"Confidence Score: {data.get('confidence_score', 'N/A')}")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 480, "Summary:")
    c.setFont("Helvetica", 11)
    # Simple word wrap for summary
    import textwrap
    summary = str(data.get('summary', ''))
    wrapped_summary = textwrap.wrap(summary, width=80)
    y = 460
    for line in wrapped_summary:
        c.drawString(50, y, line)
        y -= 15
        
    c.setFont("Helvetica-Bold", 12)
    y -= 10
    c.drawString(50, y, "Recommendations:")
    c.setFont("Helvetica", 11)
    y -= 20
    for rec in data.get('recommendations', []):
        c.drawString(70, y, f"- {rec}")
        y -= 15
        if y < 100:
            c.showPage()
            y = 750
            
    c.save()
    return file_path
