def detect_alerts(
    daily_logs,
    baseline=None,
    minimum_days=3,
):
    """
    Detect persistent changes in a user's wellness data.

    These are non-diagnostic wellness alerts.
    They identify changes from the user's own baseline.
    """

    if not daily_logs or not baseline:
        return []

    alerts = []

    # Use the most recent days for checking persistent changes.
    recent_logs = daily_logs[-minimum_days:]

    # --------------------------------------------------
    # Persistent low sleep
    # --------------------------------------------------

    usual_sleep = baseline.get("sleepHours")

    if usual_sleep is not None:
        low_sleep_days = 0

        for log in recent_logs:
            sleep = log.get("sleepHours")

            if sleep is not None:
                if float(sleep) < float(usual_sleep) - 0.5:
                    low_sleep_days += 1

        if low_sleep_days >= minimum_days:
            alerts.append({
                "type": "sleep",
                "title": "Sleep has been lower than usual",
                "message": (
                    f"Your sleep has been below your usual level "
                    f"for the last {low_sleep_days} logged days."
                ),
                "daysObserved": low_sleep_days,
                "severity": "low",
            })

    # --------------------------------------------------
    # Persistent high stress
    # --------------------------------------------------

    usual_stress = baseline.get("stressLevel")

    if usual_stress is not None:
        high_stress_days = 0

        for log in recent_logs:
            stress = log.get("stressLevel")

            if stress is not None:
                if float(stress) > float(usual_stress) + 0.5:
                    high_stress_days += 1

        if high_stress_days >= minimum_days:
            alerts.append({
                "type": "stress",
                "title": "Stress has been higher than usual",
                "message": (
                    f"Your stress level has been above your usual "
                    f"pattern for the last {high_stress_days} logged days."
                ),
                "daysObserved": high_stress_days,
                "severity": "low",
            })

    # --------------------------------------------------
    # Persistent low energy
    # --------------------------------------------------

    usual_energy = baseline.get("energyLevel")

    if usual_energy is not None:
        low_energy_days = 0

        for log in recent_logs:
            energy = log.get("energyLevel")

            if energy is not None:
                if float(energy) < float(usual_energy) - 0.5:
                    low_energy_days += 1

        if low_energy_days >= minimum_days:
            alerts.append({
                "type": "energy",
                "title": "Energy has been lower than usual",
                "message": (
                    f"Your energy level has been below your usual "
                    f"pattern for the last {low_energy_days} logged days."
                ),
                "daysObserved": low_energy_days,
                "severity": "low",
            })

    # --------------------------------------------------
    # Persistent low activity
    # --------------------------------------------------

    usual_activity = baseline.get("activityMinutes")

    if usual_activity is not None and float(usual_activity) > 0:
        low_activity_days = 0

        for log in recent_logs:
            activity = log.get("activityMinutes")

            if activity is not None:
                if float(activity) < float(usual_activity) * 0.5:
                    low_activity_days += 1

        if low_activity_days >= minimum_days:
            alerts.append({
                "type": "activity",
                "title": "Activity has been lower than usual",
                "message": (
                    f"Your logged activity has been noticeably lower "
                    f"than your usual level for the last "
                    f"{low_activity_days} logged days."
                ),
                "daysObserved": low_activity_days,
                "severity": "low",
            })

    return alerts