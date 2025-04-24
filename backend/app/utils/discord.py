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
        raise Exception(f"Failed to send message to Discord webhook: {response.status_code}, {response.text}")
