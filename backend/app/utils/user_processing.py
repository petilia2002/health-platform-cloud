from datetime import date


def calculate_age(birthdate: date) -> str:
    today = date.today()
    # Вычитаем годы
    age = today.year - birthdate.year
    # Если день рождения в этом году ещё не наступил — уменьшаем на 1
    if (today.month, today.day) < (birthdate.month, birthdate.day):
        age -= 1
    return str(age)


def calculate_gender(gender: str) -> str:
    if gender == "Мужчина":
        return "1"
    if gender == "Женщина":
        return "0"


def find_by_substring(analytes: list[dict], substring: str) -> dict | None:
    substring_lower = substring.lower()
    for obj in analytes:
        if substring_lower in obj["name"].lower():
            return obj
    return None
