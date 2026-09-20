from collections import Counter


def detect_patterns(daily_logs, symptoms=None, cycles=None):
    """
    Detect recurring personal wellness patterns.

    This is a wellness/pattern-analysis function.
    It does not diagnose PCOS or any medical condition.
    """

    if not daily_logs:
        return []

    patterns = []

    # --------------------------------------------------
    # Sleep + stress pattern
    # --------------------------------------------------

    sleep_values = [
        float(log["sleepHours"])
        for log in daily_logs
        if log.get("sleepHours") is not None
    ]

    stress_values = [
        float(log["stressLevel"])
        for log in daily_logs
        if log.get("stressLevel") is not None
    ]

    if len(sleep_values) >= 4 and len(stress_values) >= 4:
        avg_sleep = sum(sleep_values) / len(sleep_values)
        avg_stress = sum(stress_values) / len(stress_values)

        low_sleep_high_stress_days = 0

        for log in daily_logs:
            sleep = log.get("sleepHours")
            stress = log.get("stressLevel")

            if sleep is not None and stress is not None:
                if float(sleep) < avg_sleep - 0.5 and float(stress) > avg_stress + 0.5:
                    low_sleep_high_stress_days += 1

        if low_sleep_high_stress_days >= 2:
            patterns.append({
                "title": "Poor sleep + higher stress",
                "description": (
                    "Lower sleep and higher stress have appeared together "
                    "on multiple check-in days."
                ),
                "type": "sleep_stress",
                "daysObserved": low_sleep_high_stress_days,
            })

    # --------------------------------------------------
    # Activity + energy pattern
    # --------------------------------------------------

    activity_values = [
        float(log["activityMinutes"])
        for log in daily_logs
        if log.get("activityMinutes") is not None
    ]

    energy_values = [
        float(log["energyLevel"])
        for log in daily_logs
        if log.get("energyLevel") is not None
    ]

    if len(activity_values) >= 4 and len(energy_values) >= 4:
        avg_activity = sum(activity_values) / len(activity_values)
        avg_energy = sum(energy_values) / len(energy_values)

        low_activity_low_energy_days = 0

        for log in daily_logs:
            activity = log.get("activityMinutes")
            energy = log.get("energyLevel")

            if activity is not None and energy is not None:
                if (
                    float(activity) < avg_activity
                    and float(energy) < avg_energy
                ):
                    low_activity_low_energy_days += 1

        if low_activity_low_energy_days >= 2:
            patterns.append({
                "title": "Lower activity + lower energy",
                "description": (
                    "Lower activity and lower energy have appeared together "
                    "on multiple check-in days."
                ),
                "type": "activity_energy",
                "daysObserved": low_activity_low_energy_days,
            })

    # --------------------------------------------------
    # Repeated symptoms
    # --------------------------------------------------

    if symptoms:
        symptom_counter = Counter()

        for record in symptoms:
            for symptom in record.get("symptoms", []):
                symptom_counter[symptom] += 1

        for symptom, count in symptom_counter.most_common():
            if count >= 3:
                patterns.append({
                    "title": f"Recurring symptom: {symptom}",
                    "description": (
                        f"{symptom} has been logged {count} times "
                        "in your recent symptom history."
                    ),
                    "type": "recurring_symptom",
                    "symptom": symptom,
                    "occurrences": count,
                })

    # --------------------------------------------------
    # Cycle-related symptom pattern
    # --------------------------------------------------

    if symptoms and cycles:
        cycle_pattern = detect_cycle_symptoms(symptoms, cycles)

        if cycle_pattern:
            patterns.append(cycle_pattern)

    return patterns


def detect_cycle_symptoms(symptoms, cycles):
    """
    Look for symptoms that repeatedly occur during a similar
    part of the user's cycle.

    This is only a personal pattern observation.
    """

    if not cycles:
        return None

    observations = []

    for symptom_record in symptoms:
        symptom_date = symptom_record.get("date")

        if not symptom_date:
            continue

        try:
            symptom_day = parse_date(symptom_date)
        except ValueError:
            continue

        for cycle in cycles:
            start_date = cycle.get("startDate")

            if not start_date:
                continue

            try:
                cycle_start = parse_date(start_date)
            except ValueError:
                continue

            if symptom_day >= cycle_start:
                cycle_day = (symptom_day - cycle_start).days + 1

                # Only associate the symptom if it falls
                # within a reasonable cycle window.
                if 1 <= cycle_day <= 60:
                    for symptom in symptom_record.get("symptoms", []):
                        observations.append(
                            (symptom, cycle_day)
                        )

    if len(observations) < 4:
        return None

    grouped = {}

    for symptom, day in observations:
        grouped.setdefault(symptom, []).append(day)

    for symptom, days in grouped.items():
        if len(days) < 2:
            continue

        average_day = sum(days) / len(days)

        close_days = [
            day
            for day in days
            if abs(day - average_day) <= 3
        ]

        if len(close_days) >= 2:
            rounded_day = round(sum(close_days) / len(close_days))

            return {
                "title": f"{symptom} appears around cycle day {rounded_day}",
                "description": (
                    f"{symptom} has appeared around a similar point "
                    "in your recent cycles."
                ),
                "type": "cycle_symptom",
                "symptom": symptom,
                "cycleDay": rounded_day,
            }

    return None


def parse_date(value):
    """
    Convert YYYY-MM-DD into a date object.
    """

    from datetime import datetime

    return datetime.strptime(
        str(value)[:10],
        "%Y-%m-%d"
    ).date()