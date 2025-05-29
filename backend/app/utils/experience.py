def calculate_level(xp: int) -> int:
    # Simple XP curve: level up every 100 XP
    return (xp // 100) + 1

def normalize_theme(theme: str) -> str:
    return theme.strip().title()


from app.utils.experience import calculate_level, normalize_theme

def award_experience_and_achievements(user, submission, db):
    base_xp = 10 if submission.is_generated else 15
    xp_earned = submission.score * base_xp

    # Update global XP and level
    user.experience_points += xp_earned
    user.level = calculate_level(user.experience_points)

    theme = normalize_theme(submission.topic)
    new_achievements = []

    # Update per-topic XP
    if not user.topic_experience:
        user.topic_experience = {}

    user.topic_experience[theme] = user.topic_experience.get(theme, 0) + xp_earned
    topic_xp = user.topic_experience[theme]

    # === Achievements ===

    # Perfect Score in Theme
    if submission.score == submission.total_questions:
        tag = f"Perfect Score: {theme}"
        if tag not in user.achievements:
            new_achievements.append(tag)

    # First quiz in Theme
    if f"First Quiz: {theme}" not in user.achievements:
        new_achievements.append(f"First Quiz: {theme}")

    # General XP Milestone
    if user.experience_points >= 100 and "Novice" not in user.achievements:
        new_achievements.append("Novice")

    # Topic-Specific Milestone
    if topic_xp >= 300:
        expert_tag = f"Expert in {theme}"
        if expert_tag not in user.achievements:
            new_achievements.append(expert_tag)

    # You can add more tiers
    if topic_xp >= 500:
        master_tag = f"Master of {theme}"
        if master_tag not in user.achievements:
            new_achievements.append(master_tag)

    if new_achievements:
        user.achievements += new_achievements

    db.add(user)
    db.commit()