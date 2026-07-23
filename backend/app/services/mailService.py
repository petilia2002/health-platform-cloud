from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import SecretStr, EmailStr
from typing import Dict

from app.core.config import SMTP_HOST, SMTP_PORT, SMTP_MAIL, SMTP_USER, SMTP_PASSWORD
from app.templates.mail import get_mail_html


class MailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=SMTP_USER,
            MAIL_PASSWORD=SecretStr(SMTP_PASSWORD),
            MAIL_FROM=SMTP_MAIL,
            MAIL_PORT=SMTP_PORT,
            MAIL_SERVER=SMTP_HOST,
            MAIL_STARTTLS=False,
            MAIL_SSL_TLS=True,
            USE_CREDENTIALS=True,
        )

    async def send_activation_mail(self, to: str, link: str) -> Dict[str, str]:
        template = get_mail_html(link)

        message = MessageSchema(
            subject="Account Activation",
            recipients=[to],
            body=template,
            subtype=MessageType.html,
        )

        fm = FastMail(self.conf)
        await fm.send_message(message)
        return {"Message": "Письмо успешно отправлено"}


mailService = MailService()
