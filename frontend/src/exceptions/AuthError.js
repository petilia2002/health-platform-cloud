export default class AuthError extends Error {
  constructor(message = "Пользователь не авторизован", status = 401) {
    super(message);
    this.status = status;
  }
}
