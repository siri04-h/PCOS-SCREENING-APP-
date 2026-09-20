def generate_recommendations(data):
    """
    Generate personalized wellness recommendations.

    The function works with the daily-log format used by Lunara
    and can optionally receive the personal baseline calculated
    by baseline.py.

    This provides wellness guidance only.
    It is not a medical diagnosis.
    """

    recommendations = []

    # --------------------------------------------------
    # Current values from Lunara daily check-in
    # --------------------------------------------------

    sleep_hours = data.get("sleepHours")
    water_intake = data.get("waterIntakeMl")
    activity_minutes = data.get("activityMinutes")
    energy_level = data.get("energyLevel")
    stress_level = data.get("stressLevel")

    # --------------------------------------------------
    # Personal baseline
    # --------------------------------------------------

    baseline = data.get("baseline") or {}

    usual_sleep = baseline.get("sleepHours")
    usual_water = baseline.get("waterIntakeMl")
    usual_activity = baseline.get("activityMinutes")
    usual_energy = baseline.get("energyLevel")
    usual_stress = baseline.get("stressLevel")

    # --------------------------------------------------
    # Sleep
    # --------------------------------------------------

    if sleep_hours is not None:
        sleep_hours = float(sleep_hours)

        if sleep_hours < 6:
            recommendations.append({
                "title": "Prioritize your sleep",
                "message": (
                    "Your sleep was quite low today. "
                    "Try keeping a consistent bedtime and giving yourself "
                    "enough time to rest."
                ),
                "basedOn": "Today's sleep check-in",
            })

        elif usual_sleep is not None:
            if sleep_hours < float(usual_sleep) - 0.5:
                recommendations.append({
                    "title": "Your sleep is below your usual level",
                    "message": (
                        "Your recent sleep is lower than your personal baseline. "
                        "A consistent sleep routine may help you get closer to your "
                        "usual pattern."
                    ),
                    "basedOn": "Sleep pattern vs. personal baseline",
                })

    # --------------------------------------------------
    # Stress
    # --------------------------------------------------

    if stress_level is not None:
        stress_level = float(stress_level)

        if stress_level >= 4:
            recommendations.append({
                "title": "Give yourself a stress reset",
                "message": (
                    "Your stress level is elevated today. "
                    "Consider a short breathing exercise, quiet break, "
                    "or gentle activity if comfortable."
                ),
                "basedOn": "Today's stress check-in",
            })

        elif usual_stress is not None:
            if stress_level > float(usual_stress) + 0.5:
                recommendations.append({
                    "title": "Stress is above your usual level",
                    "message": (
                        "Your recent stress is higher than your personal baseline. "
                        "Consider making some time for rest or a calming activity."
                    ),
                    "basedOn": "Stress pattern vs. personal baseline",
                })

    # --------------------------------------------------
    # Energy
    # --------------------------------------------------

    if energy_level is not None:
        energy_level = float(energy_level)

        if energy_level <= 2:
            recommendations.append({
                "title": "Listen to your energy levels",
                "message": (
                    "Your energy is low today. "
                    "Consider pacing yourself and choosing gentle activities."
                ),
                "basedOn": "Today's energy check-in",
            })

        elif usual_energy is not None:
            if energy_level < float(usual_energy) - 0.5:
                recommendations.append({
                    "title": "Your energy is below usual",
                    "message": (
                        "Your recent energy is lower than your personal baseline. "
                        "Consider allowing yourself some rest and keeping your "
                        "routine manageable."
                    ),
                    "basedOn": "Energy pattern vs. personal baseline",
                })

    # --------------------------------------------------
    # Hydration
    # --------------------------------------------------

    if water_intake is not None:
        water_intake = float(water_intake)

        if water_intake < 1500:
            recommendations.append({
                "title": "Remember to hydrate",
                "message": (
                    "Your logged water intake is relatively low today. "
                    "Keep water nearby and drink regularly throughout the day."
                ),
                "basedOn": "Today's hydration check-in",
            })

        elif usual_water is not None:
            if water_intake < float(usual_water) - 250:
                recommendations.append({
                    "title": "Hydration is below your usual level",
                    "message": (
                        "You've logged less water than you usually do. "
                        "Try keeping water nearby and drinking regularly."
                    ),
                    "basedOn": "Hydration pattern vs. personal baseline",
                })

    # --------------------------------------------------
    # Activity
    # --------------------------------------------------

    if activity_minutes is not None:
        activity_minutes = float(activity_minutes)

        if activity_minutes < 10:
            recommendations.append({
                "title": "Add a little movement",
                "message": (
                    "You've logged very little activity today. "
                    "If you feel comfortable, a short walk or gentle stretching "
                    "could be a simple way to add movement."
                ),
                "basedOn": "Today's activity check-in",
            })

        elif usual_activity is not None:
            if activity_minutes < float(usual_activity) - 10:
                recommendations.append({
                    "title": "Activity is below your usual level",
                    "message": (
                        "Your recent activity is lower than your personal baseline. "
                        "A short, comfortable walk or stretch could help you stay active."
                    ),
                    "basedOn": "Activity pattern vs. personal baseline",
                })

    # --------------------------------------------------
    # Pattern-based recommendations
    # --------------------------------------------------

    patterns = data.get("patterns") or []

    for pattern in patterns:
        pattern_type = pattern.get("type")

        if pattern_type == "sleep_stress":
            recommendations.append({
                "title": "Notice the sleep and stress connection",
                "message": (
                    "Your data suggests that lower sleep and higher stress "
                    "often appear together. Paying attention to your sleep routine "
                    "may be useful when stress starts increasing."
                ),
                "basedOn": "Recurring personal pattern",
            })

        elif pattern_type == "sleep_energy":
            recommendations.append({
                "title": "Sleep may be connected with your energy",
                "message": (
                    "Your data suggests that lower sleep often appears alongside "
                    "lower energy."
                ),
                "basedOn": "Recurring personal pattern",
            })

    # --------------------------------------------------
    # Remove duplicate recommendations
    # --------------------------------------------------

    unique_recommendations = []
    seen_titles = set()

    for recommendation in recommendations:
        title = recommendation["title"]

        if title not in seen_titles:
            seen_titles.add(title)
            unique_recommendations.append(recommendation)

    # --------------------------------------------------
    # Default recommendation
    # --------------------------------------------------

    if not unique_recommendations:
        unique_recommendations.append({
            "title": "Keep tracking consistently",
            "message": (
                "You're building your personal wellness picture. "
                "Keep logging your daily check-ins so Lunara can notice "
                "patterns over time."
            ),
            "basedOn": "Your ongoing check-ins",
        })

    return unique_recommendations