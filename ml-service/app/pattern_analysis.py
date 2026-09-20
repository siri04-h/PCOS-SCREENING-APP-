def analyze_pattern(data):
    """
    Analyze changes between the user's usual baseline
    and their current values.

    This is a wellness pattern detector.
    It does not diagnose any medical condition.
    """

    insights = []

    current_sleep = data.get("currentSleep")
    usual_sleep = data.get("usualSleep")

    current_stress = data.get("currentStress")
    usual_stress = data.get("usualStress")

    current_energy = data.get("currentEnergy")
    usual_energy = data.get("usualEnergy")

    current_activity = data.get("currentActivity")
    usual_activity = data.get("usualActivity")

    # -----------------------------
    # Sleep
    # -----------------------------

    if current_sleep is not None and usual_sleep is not None:
        difference = float(current_sleep) - float(usual_sleep)

        if difference <= -0.5:
            insights.append({
                "type": "sleep",
                "title": "Sleep below usual",
                "message": (
                    "Your recent sleep has been lower than your usual pattern."
                ),
                "direction": "decreased",
                "difference": round(difference, 1),
            })

        elif difference >= 0.5:
            insights.append({
                "type": "sleep",
                "title": "Sleep above usual",
                "message": (
                    "Your recent sleep has been higher than your usual pattern."
                ),
                "direction": "increased",
                "difference": round(difference, 1),
            })

    # -----------------------------
    # Stress
    # -----------------------------

    if current_stress is not None and usual_stress is not None:
        difference = float(current_stress) - float(usual_stress)

        if difference >= 0.5:
            insights.append({
                "type": "stress",
                "title": "Stress above usual",
                "message": (
                    "Your recent stress has been higher than your usual pattern."
                ),
                "direction": "increased",
                "difference": round(difference, 1),
            })

        elif difference <= -0.5:
            insights.append({
                "type": "stress",
                "title": "Stress below usual",
                "message": (
                    "Your recent stress has been lower than your usual pattern."
                ),
                "direction": "decreased",
                "difference": round(difference, 1),
            })

    # -----------------------------
    # Energy
    # -----------------------------

    if current_energy is not None and usual_energy is not None:
        difference = float(current_energy) - float(usual_energy)

        if difference <= -0.5:
            insights.append({
                "type": "energy",
                "title": "Energy below usual",
                "message": (
                    "Your recent energy has been lower than your usual pattern."
                ),
                "direction": "decreased",
                "difference": round(difference, 1),
            })

        elif difference >= 0.5:
            insights.append({
                "type": "energy",
                "title": "Energy above usual",
                "message": (
                    "Your recent energy has been higher than your usual pattern."
                ),
                "direction": "increased",
                "difference": round(difference, 1),
            })

    # -----------------------------
    # Activity
    # -----------------------------

    if current_activity is not None and usual_activity is not None:
        difference = float(current_activity) - float(usual_activity)

        if difference <= -10:
            insights.append({
                "type": "activity",
                "title": "Activity below usual",
                "message": (
                    "Your recent activity has been lower than your usual pattern."
                ),
                "direction": "decreased",
                "difference": round(difference, 1),
            })

        elif difference >= 10:
            insights.append({
                "type": "activity",
                "title": "Activity above usual",
                "message": (
                    "Your recent activity has been higher than your usual pattern."
                ),
                "direction": "increased",
                "difference": round(difference, 1),
            })

    # -----------------------------
    # No significant change
    # -----------------------------

    if not insights:
        insights.append({
            "type": "stable",
            "title": "No significant change",
            "message": (
                "Your recent values are close to your usual pattern."
            ),
            "direction": "stable",
            "difference": 0,
        })

    return {
        "insights": insights
    }