import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.models import SharedMaterial
from typing import Optional

# Setup Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class AIAssistant:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def ask_about_material(self, db: Session, material_id: int, question: str) -> str:
        # 1. Fetch material metadata
        material = db.query(SharedMaterial).filter(SharedMaterial.id == material_id).first()
        if not material:
            return "Error: Material not found."

        # 2. Read file content
        content = ""
        file_path = material.file_path
        
        if not os.path.exists(file_path):
            return f"Error: File not found on server at {file_path}. Please contact support."

        try:
            # Simple text/markdown reading for now
            # To handle PDF/DOCX, we would need additional libraries
            if file_path.endswith(('.txt', '.md', '.py', '.js', '.html', '.css')):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                return f"Sorry, I can currently only read text-based files (.txt, .md, .py). This file is a {file_path.split('.')[-1]}."

        except Exception as e:
            return f"Error reading file content: {str(e)}"

        if not content.strip():
            return "The document appears to be empty."

        # 3. Construct RAG Prompt
        prompt = f"""
        You are 'EduNexus AI', a helpful academic assistant.
        The user is asking a question about the following study material:
        
        Title: {material.title}
        Category: {material.category}
        
        --- CONTENT START ---
        {content[:15000]}  # Simple truncation for context window safety
        --- CONTENT END ---
        
        Question: {question}
        
        Answer based ONLY on the provided content. If the answer isn't in the content, say you don't know based on these notes.
        Be concise and academic.
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Generation Error: {str(e)}. (Check if GEMINI_API_KEY is valid)"

ai_assistant = AIAssistant()
