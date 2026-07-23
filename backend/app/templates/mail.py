def get_mail_html(link: str) -> str:
    return f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2e86de; text-align: center;">Welcome to Health Platform!</h2>
            <p>Hi there,</p>
            <p>Thank you for registering at <strong>Health Platform</strong>.</p>
            <p>To activate your account, please click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{link}" style="background-color: #2e86de; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Activate Account
                </a>
            </div>
            <p>If you didn’t request this email, you can safely ignore it.</p>
            <p style="margin-top: 40px;">Best regards,<br><strong>Health Platform Team</strong></p>
            </div>
        </body>
        </html>
"""


def get_activate_html() -> str:
    return f"""
        <html>
        <body>
            <p>Письмо с подтверждением отправлено на почту!</p>
        </body>
        </html>
"""
