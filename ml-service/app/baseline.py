from statistics import mean


def calculate_baseline(daily_logs):
    """
    Calculate a user's personal baseline from historical daily logs.

    Expected daily log format:

    {
        "date": "2026-08-27",
        "sleepHours": 7.5,
        "waterIntakeMl": 2000,
        "activityMinutes": 30,
        "energyLevel": 4,
        "stressLevel": 2
    }

    Returns the user's usual values.
    """

    if not daily_logs:
        return None

    sleep_values = []
    water_values = []
    activity_values = []
    energy_values = []
    stress_values = []

    for log in daily_logs:
        if log.get("sleepHours") is not None:
            sleep_values.append(float(log["sleepHours"]))

        if log.get("waterIntakeMl") is not None:
            water_values.append(float(log["waterIntakeMl"]))

        if log.get("activityMinutes") is not None:
            activity_values.append(float(log["activityMinutes"]))

        if log.get("energyLevel") is not None:
            energy_values.append(float(log["energyLevel"]))

        if log.get("stressLevel") is not None:
            stress_values.append(float(log["stressLevel"]))

    def average(values):
        if not values:
            return None
        return round(mean(values), 2)

    return {
        "sleepHours": average(sleep_values),
        "waterIntakeMl": average(water_values),
        "activityMinutes": average(activity_values),
        "energyLevel": average(energy_values),
        "stressLevel": average(stress_values),
        "daysUsed": len(daily_logs),
    }