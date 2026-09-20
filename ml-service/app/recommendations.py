def generate_recommendations(
    daily_logs,
    patterns=None,
    baseline=None,
):
    """
    Generate personalized wellness recommendations.

    This function provides general wellness suggestions.
    It does not diagnose or treat any medical condition.
    """

    if not daily_logs:
        return []

    recommendations = []

    patterns = patterns or []

    # --------------------------------------------------
    # Calculate current values
    # --------------------------------------------------

    recent_logs = daily_logs[-3:]

    sleep_values = [
        float(log["sleepHours"])
        for log in recent_logs
        if log.get("sleepHours") is not None
    ]

    stress_values = [
        float(log["stressLevel"])
        for log in recent_logs
        if log.get("stressLevel") is not None
    ]

    energy_values = [
        float(log["energyLevel"])
        for log in recent_logs
        if log.get("energyLevel") is not None
    ]

    activity_values = [
        float(log["activityMinutes"])
        for log in recent_logs
        if log.get("activityMinutes") is not None
    ]

    water_values = [
        float(log["waterIntakeMl"])
        for log in recent_logs
        if log.get("waterIntakeMl") is not None
    ]

    # --------------------------------------------------
    # Sleep recommendation
    # --------------------------------------------------

    if baseline and baseline.get("sleepHours") and sleep_values:
        current_sleep = sum(sleep_values) / len(sleep_values)
        usual_sleep = float(baseline["sleepHours"])

        if current_sleep < usual_sleep - 0.5:
            recommendations.append({
                "title": "Prioritize sleep",
                "message": (
                    "Your recent sleep has been lower than your usual "
                    "level. Consider keeping a consistent bedtime "
                    "and giving yourself enough time to rest."
                ),
                "basedOn": [
                    "Recent sleep",
                    "Personal sleep baseline",
                ],
                "type": "sleep",
                "source": "member4",
            })

    # --------------------------------------------------
    # Stress recommendation
    # --------------------------------------------------

    if baseline and baseline.get("stressLevel") and stress_values:
        current_stress = sum(stress_values) / len(stress_values)
        usual_stress = float(baseline["stressLevel"])

        if current_stress > usual_stress + 0.5:
            recommendations.append({
                "title": "Make space for a calm moment",
                "message": (
                    "Your recent stress level is higher than your usual "
                    "pattern. A short walk, breathing exercise, quiet "
                    "break, or relaxing activity may help you reset."
                ),
                "basedOn": [
                    "Recent stress",
                    "Personal stress baseline",
                ],
                "type": "stress",
                "source": "member4",
            })

    # --------------------------------------------------
    # Energy + activity recommendation
    # --------------------------------------------------

    if energy_values and activity_values:
        current_energy = sum(energy_values) / len(energy_values)
        current_activity = sum(activity_values) / len(activity_values)

        if current_energy <= 2.5 and current_activity < 30:
            recommendations.append({
                "title": "Try some gentle movement",
                "message": (
                    "Your recent energy has been on the lower side "
                    "alongside lower activity. If you feel comfortable, "
                    "a short gentle walk or light movement may be a "
                    "manageable place to start."
                ),
                "basedOn": [
                    "Energy check-ins",
                    "Activity check-ins",
                ],
                "type": "activity",
                "source": "member4",
            })

    # --------------------------------------------------
    # Hydration recommendation
    # --------------------------------------------------

    if water_values:
        current_water = sum(water_values) / len(water_values)

        if current_water < 1500:
            recommendations.append({
                "title": "Keep an eye on hydration",
                "message": (
                    "Your recent logged water intake has been relatively "
                    "low. Keep water nearby and drink regularly throughout "
                    "the day."
                ),
                "basedOn": [
                    "Recent water intake",
                ],
                "type": "nutrition",
                "source": "member4",
            })

    # --------------------------------------------------
    # Pattern-based recommendations
    # --------------------------------------------------

    for pattern in patterns:
        pattern_type = pattern.get("type")

        if pattern_type == "sleep_stress":
            recommendations.append({
                "title": "Watch the sleep–stress connection",
                "message": (
                    "Your logs show that lower sleep and higher stress "
                    "have appeared together more than once. Paying "
                    "attention to rest on stressful days may be useful."
                ),
                "basedOn": [
                    "Sleep pattern",
                    "Stress pattern",
                ],
                "type": "sleep",
                "source": "member4",
            })

        elif pattern_type == "recurring_symptom":
            symptom = pattern.get("symptom", "A symptom")

            recommendations.append({
                "title": f"Keep tracking {symptom.lower()}",
                "message": (
                    f"{symptom} has appeared repeatedly in your recent "
                    "logs. Continue tracking when it happens and any "
                    "other factors you notice around it."
                ),
                "basedOn": [
                    f"Recurring symptom: {symptom}",
                ],
                "type": "general",
                "source": "member4",
            })

    # --------------------------------------------------
    # Avoid duplicate recommendation types
    # --------------------------------------------------

    unique = []
    seen = set()

    for recommendation in recommendations:
        key = recommendation["title"]

        if key not in seen:
            seen.add(key)
            unique.append(recommendation)

    return unique