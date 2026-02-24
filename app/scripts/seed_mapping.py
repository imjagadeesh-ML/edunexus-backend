import json
import os
import sys

# Add parent directory to path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal, engine
from app import models

SUBJECT_DATA = [
    {
        "subject_name": "Data Structures",
        "subject_code": "CS201",
        "credits": 4,
        "industry_roles": [
            {
                "title": "Software Development Engineer (SDE)",
                "average_salary": "₹8,000,000 - ₹25,000,000",
                "required_skills": ["Algorithm Design", "Problem Solving", "Optimization"],
                "tools_used": ["LeetCode", "Git", "IDE Debuggers"],
                "projects": [
                    "High-performance caching system using LRU cache",
                    "Custom Memory Allocator using Tree Maps"
                ]
            }
        ]
    },
    {
        "subject_name": "Operating Systems",
        "subject_code": "CS301",
        "credits": 4,
        "industry_roles": [
            {
                "title": "Systems Engineer / DevOps",
                "average_salary": "₹7,000,000 - ₹22,000,000",
                "required_skills": ["Linux Internals", "Concurrency", "Bash Scripting", "Multithreading"],
                "tools_used": ["Linux/Unix", "Docker", "Kubernetes", "C/C++"],
                "projects": [
                    "Thread Pool Scheduler Implementation",
                    "Custom File System Driver"
                ]
            }
        ]
    },
    {
        "subject_name": "Machine Learning",
        "subject_code": "CS401",
        "credits": 3,
        "industry_roles": [
            {
                "title": "Machine Learning Engineer",
                "average_salary": "₹10,000,000 - ₹30,000,000",
                "required_skills": ["Statistical Modeling", "Python", "Deep Learning", "Data Preprocessing"],
                "tools_used": ["TensorFlow", "PyTorch", "Scikit-Learn", "Jupyter"],
                "projects": [
                    "Customer Churn Prediction Model",
                    "Real-time Image Classification Pipeline"
                ]
            }
        ]
    },
    {
        "subject_name": "DBMS",
        "subject_code": "CS202",
        "credits": 4,
        "industry_roles": [
            {
                "title": "Data Engineer / Backend Developer",
                "average_salary": "₹8,000,000 - ₹24,000,000",
                "required_skills": ["SQL Optimization", "Relational Design", "NoSQL", "Indexing"],
                "tools_used": ["PostgreSQL", "MongoDB", "Redis", "Apache Kafka"],
                "projects": [
                    "Distributed E-commerce Inventory Database",
                    "High-throughput Analytical Data Warehouse"
                ]
            }
        ]
    },
    {
        "subject_name": "Computer Networks",
        "subject_code": "CS302",
        "credits": 3,
        "industry_roles": [
            {
                "title": "Network Engineer / Cloud Architect",
                "average_salary": "₹9,000,000 - ₹26,000,000",
                "required_skills": ["TCP/IP", "Load Balancing", "Cloud Networking", "Security Protocols"],
                "tools_used": ["AWS VPC", "Wireshark", "Nginx", "Cisco Packet Tracer"],
                "projects": [
                    "Custom Load Balancer implementation",
                    "Secure VPC Architecture Setup"
                ]
            }
        ]
    }
]

def seed_database():
    print("Connecting to Database...")
    db = SessionLocal()
    try:
        # Create tables if not exist (Only works properly if not strictly using Supabase schema.sql)
        # models.Base.metadata.create_all(bind=engine)
        
        print("Starting Seeding Subject -> Industry Mapping...")
        for subject_data in SUBJECT_DATA:
            # 1. Insert Subject
            subject = db.query(models.Subject).filter_by(code=subject_data["subject_code"]).first()
            if not subject:
                subject = models.Subject(
                    name=subject_data["subject_name"],
                    code=subject_data["subject_code"],
                    credits=subject_data["credits"]
                )
                db.add(subject)
                db.flush()
            
            for role_data in subject_data["industry_roles"]:
                # 2. Insert Industry Role
                role = db.query(models.IndustryRole).filter_by(title=role_data["title"]).first()
                if not role:
                    role = models.IndustryRole(
                        title=role_data["title"],
                        average_salary=role_data["average_salary"]
                    )
                    db.add(role)
                    db.flush()
                
                # 3. Insert Skills & Mapping
                for skill_name in role_data["required_skills"]:
                    skill = db.query(models.Skill).filter_by(name=skill_name).first()
                    if not skill:
                        skill = models.Skill(name=skill_name)
                        db.add(skill)
                        db.flush()
                    
                    role_skill = db.query(models.RoleSkillMapping).filter_by(role_id=role.id, skill_id=skill.id).first()
                    if not role_skill:
                        db.add(models.RoleSkillMapping(role_id=role.id, skill_id=skill.id))
                
                # 4. Insert Subject-Industry Mapping
                sub_role = db.query(models.SubjectIndustryMapping).filter_by(subject_id=subject.id, role_id=role.id).first()
                if not sub_role:
                    mapping = models.SubjectIndustryMapping(
                        subject_id=subject.id,
                        role_id=role.id,
                        projects=json.dumps(role_data["projects"]),
                        tools=json.dumps(role_data["tools"])
                    )
                    db.add(mapping)
                    
        db.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
