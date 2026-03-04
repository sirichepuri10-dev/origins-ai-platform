class RoadmapGenerator:
    @staticmethod
    def generate_dynamic_roadmap(goal, user_skills, all_roadmaps):
        """
        Dynamically filters or enhances a roadmap based on user's current skills.
        """
        user_skills_set = set([s.lower().strip() for s in user_skills])
        
        # Find the best matching static roadmap first
        template = None
        if not template or not template.get('steps'):
            # Generate a "Smart Fallback" roadmap for unknown or empty domains
            template = {
                "goal": goal,
                "steps": [
                    {"title": f"Core Foundations of {goal}", "desc": f"Master the fundamental concepts and basic syntax required for {goal}.", "skills": ["Basic Logic", "Syntax"]},
                    {"title": "Industry Standard Tools", "desc": f"Learn the primary libraries and frameworks used by professionals in the {goal} domain.", "skills": ["Developer Tools", "Frameworks"]},
                    {"title": f"Advanced {goal} Architectures", "desc": f"Deep dive into complex project structures and performance optimization for {goal}.", "skills": ["System Design", "Optimization"]},
                    {"title": "Capstone Career Project", "desc": f"Build and deploy a comprehensive {goal} application to your portfolio.", "skills": ["Cloud Deployment", "Project Portfolio"]}
                ]
            }
            
        processed_steps = []
        for step in template.get('steps', []):
            step_skills = step.get('skills', [])
            matched_skills = [s for s in step_skills if s.lower().strip() in user_skills_set]
            
            # Determine if step is completed
            is_completed = len(matched_skills) == len(step_skills) and len(step_skills) > 0
            
            processed_steps.append({
                **step,
                "is_completed": is_completed,
                "matched_count": len(matched_skills),
                "total_count": len(step_skills)
            })
            
        return {
            "goal": template.get('goal'),
            "steps": processed_steps,
            "overall_progress": round((sum(1 for s in processed_steps if s['is_completed']) / len(processed_steps)) * 100) if processed_steps else 0
        }
