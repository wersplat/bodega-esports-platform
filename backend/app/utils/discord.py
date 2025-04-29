import requests


def send_discord_message(webhook_url: str, content: str, embeds: list = None):
    """
    Sends a message to a Discord webhook.

    :param webhook_url: The Discord webhook URL.
    :param content: The message content.
    :param embeds: A list of embed objects for rich content (optional).
    """
    payload = {"content": content}

    if embeds:
        payload["embeds"] = embeds

    headers = {"Content-Type": "application/json"}

    response = requests.post(webhook_url, json=payload, headers=headers)

    if response.status_code != 204:
        raise Exception(
            "Failed to send message to Discord webhook: "
            f"{response.status_code}, {response.text}"
        )


def send_discord_webhook(webhook_url: str, content: str, embeds: list = None):
    """
    Sends a webhook to a Discord URL.

    :param webhook_url: The Discord webhook URL.
    :param content: The message content.
    :param embeds: A list of embed objects for rich content (optional).
    """
    send_discord_message(webhook_url, content, embeds)
