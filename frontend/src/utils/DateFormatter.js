export default class DateFormatter {
  static format(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "неизвестная дата";
    }

    const diffTime = now - date;
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Только что / минуты
    if (diffSeconds < 60) {
      return "только что";
    }

    if (diffMinutes < 60) {
      return this.pluralizeMinutes(diffMinutes);
    }

    // Часы
    if (diffHours < 24) {
      return this.pluralizeHours(diffHours);
    }

    // Дни
    if (diffDays === 1) return "вчера";
    if (diffDays === 2) return "позавчера";
    if (diffDays < 7) return this.pluralizeDays(diffDays);

    // Недели
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "неделю назад";
    if (diffWeeks < 5) return this.pluralizeWeeks(diffWeeks);

    // Месяцы
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "месяц назад";
    if (diffMonths < 12) return this.pluralizeMonths(diffMonths);

    // Годы
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return "год назад";
    return this.pluralizeYears(diffYears);
  }

  static pluralizeMinutes(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (count == 1) {
      return "минуту назад";
    }

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} минут назад`;
    }

    if (lastDigit === 1) {
      return `${count} минуту назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} минуты назад`;
    }

    return `${count} минут назад`;
  }

  static pluralizeHours(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (count == 1) {
      return "час назад";
    }

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} часов назад`;
    }

    if (lastDigit === 1) {
      return `${count} час назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} часа назад`;
    }

    return `${count} часов назад`;
  }

  static pluralizeDays(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} дней назад`;
    }

    if (lastDigit === 1) {
      return `${count} день назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} дня назад`;
    }

    return `${count} дней назад`;
  }

  static pluralizeWeeks(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} недель назад`;
    }

    if (lastDigit === 1) {
      return `${count} неделю назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} недели назад`;
    }

    return `${count} недель назад`;
  }

  static pluralizeMonths(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} месяцев назад`;
    }

    if (lastDigit === 1) {
      return `${count} месяц назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} месяца назад`;
    }

    return `${count} месяцев назад`;
  }

  static pluralizeYears(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} лет назад`;
    }

    if (lastDigit === 1) {
      return `${count} год назад`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} года назад`;
    }

    return `${count} лет назад`;
  }
}
