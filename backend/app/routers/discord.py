"""
This module provides endpoints for sending notifications to Discord
using webhooks.

Endpoints:
- `/send-announcement`: Send a general announcement.
- `/send-standings-update`: Send standings updates.
- `/send-stat-update`: Send stat updates.
- `/send-export-notification`: Notify about exported files.
- `/send-message`: Send custom messages to specific channels.
- `/send-registration-notification`: Notify about new registrations.
- `/send-roster-update`: Notify about roster updates.
- `/send-league-update`: Notify about league updates.
- `/send-match-result`: Notify about match results.
- `/send-profile-notification`: Notify about user profile events.
- `/send-player-notification`: Notify about player events.
- `/send-contract-notification`: Notify about contract updates.
- `/send-conference-update`: Notify about conference updates.
- `/send-division-update`: Notify about division updates.
- `/send-workflow-notification`: Notify about workflow events.
- `/send-bulk-notifications`: Send bulk notifications to multiple webhooks.
"""

from fastapi import APIRouter, HTTPException, Depends
from app.utils.discord import send_discord_message
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool
import logging

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/discord", tags=["Discord"])


def create_embed(
    title: str, description: str, color: int,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """
    Utility function to create a Discord embed object.

    Args:
        title (str): The title of the embed.
        description (str): The description of the embed.
        color (int): The color of the embed (in decimal format).
        footer (str, optional): Footer text for the embed. Defaults to None.
        timestamp (str, optional): Timestamp for the embed. Defaults to None.
        thumbnail (str, optional): URL for the embed's thumbnail image.
            Defaults to None.

    Returns:
        dict: A dictionary representing the embed object.
    """
    embed = {
        "title": title,
        "description": description,
        "color": color
    }
    if footer:
        embed["footer"] = {"text": footer}
    if timestamp:
        embed["timestamp"] = timestamp
    if thumbnail:
        embed["thumbnail"] = {"url": thumbnail}
    return embed


@router.post("/send-announcement")
async def send_announcement(
    webhook_url: str, title: str, description: str, color: int = 5814783,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """Send a general announcement to Discord."""
    embed = create_embed(
        title, description, color, footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info("Announcement sent successfully: %s", title)
    except Exception as e:
        logger.error("Failed to send announcement: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send announcement: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Announcement sent successfully."
    }


@router.post("/send-standings-update")
async def send_standings_update(
    webhook_url: str, standings: dict, color: int = 3447003,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """Send standings updates to Discord."""
    embed = create_embed(
        "Standings Update", str(standings), color, footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info("Standings update sent successfully.")
    except Exception as e:
        logger.error("Failed to send standings update: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send standings update: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Standings update sent successfully."
    }


@router.post("/send-stat-update")
async def send_stat_update(
    webhook_url: str, stats: dict, color: int = 16776960,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """Send stat updates to Discord."""
    embed = create_embed(
        "Stat Update", str(stats), color, footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info("Stat update sent successfully.")
    except Exception as e:
        logger.error("Failed to send stat update: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send stat update: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Stat update sent successfully."
    }


@router.post("/send-export-notification")
async def send_export_notification(
    webhook_url: str, file_url: str
):
    """Send a notification to Discord about an exported file."""
    embed = create_embed(
        "Export Completed", f"File available at: {file_url}", 65280
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "Export notification sent successfully for file: %s", file_url
        )
    except Exception as e:
        logger.error("Failed to send export notification: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send export notification: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Export notification sent successfully."
    }


@router.post("/send-message")
async def send_message(
    webhook_url: str, channel: str, content: str
):
    """Send a custom message to a specific Discord channel."""
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content=content)
        logger.info("Message sent successfully to channel: %s", channel)
    except Exception as e:
        logger.error("Failed to send message: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send message: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Message sent successfully."
    }


@router.post("/send-registration-notification")
async def send_registration_notification(
    webhook_url: str, team_name: str, league_name: str
):
    """Send a notification to Discord about a new registration."""
    embed = create_embed(
        "New Registration",
        f"Team {team_name} has registered for league {league_name}.",
        3447003
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "Registration notification sent successfully for team: %s "
            "in league: %s",
            team_name, league_name
        )
    except Exception as e:
        logger.error("Failed to send registration notification: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send registration notification: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Registration notification sent successfully."
    }


@router.post("/send-roster-update")
async def send_roster_update(
    webhook_url: str, team_name: str, season_name: str
):
    """Send a notification to Discord about a roster update."""
    embed = create_embed(
        "Roster Update",
        f"Team {team_name} has updated their roster for season {season_name}.",
        16776960
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "Roster update notification sent successfully for team: %s "
            "in season: %s",
            team_name, season_name
        )
    except Exception as e:
        logger.error("Failed to send roster update: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send roster update: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Roster update notification sent successfully."
    }


@router.post("/send-league-update")
async def send_league_update(
    webhook_url: str, league_name: str, update_message: str,
    color: int = 65280, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a league update."""
    embed = create_embed(
        f"League Update: {league_name}", update_message, color,
        footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "League update notification sent successfully for league: %s",
            league_name
        )
    except Exception as e:
        logger.error("Failed to send league update: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send league update: {str(e)}"
        )
    return {
        "status": "success",
        "message": "League update notification sent successfully."
    }


@router.post("/send-match-result")
async def send_match_result(
    webhook_url: str, match_id: int, result_message: str,
    color: int = 16711680, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a match result."""
    embed = create_embed(
        f"Match Result: Match {match_id}", result_message, color,
        footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "Match result notification sent successfully for match ID: %d",
            match_id
        )
    except Exception as e:
        logger.error("Failed to send match result: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send match result: {str(e)}"
        )
    return {
        "status": "success",
        "message": "Match result notification sent successfully."
    }


@router.post("/send-profile-notification")
async def send_profile_notification(
    webhook_url: str, username: str, event: str, color: int = 3447003,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """Send a notification to Discord about a user profile event."""
    embed = create_embed(
        f"Profile {event.capitalize()}",
        f"The profile for user '{username}' has been {event}.",
        color, footer, timestamp, thumbnail
    )
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(
            "Profile %s notification sent successfully for user: %s",
            event, username
        )
    except Exception as e:
        logger.error("Failed to send profile notification: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send profile notification: {str(e)}"
        )
    return {
        "status": "success",
        "message": f"Profile {event} notification sent successfully."
    }


async def log_notification(
    db: AsyncSession, webhook_url: str, notification_type: str, status: str,
    error_message: str = None
):
    """
    Log a notification into the notification_logs table.
    """
    try:
        await db.execute(
            """
            INSERT INTO notification_logs (
                webhook_url, notification_type, status, error_message
            )
            VALUES (
                :webhook_url, :notification_type, :status, :error_message
            )
            """,
            {
                "webhook_url": webhook_url,
                "notification_type": notification_type,
                "status": status,
                "error_message": error_message,
            },
        )
        await db.commit()
    except SQLAlchemyError as e:
        logger.error("Failed to log notification: %s", str(e))


async def update_notification_analytics(
    db: AsyncSession, notification_type: str, success: bool
):
    """
    Update the notification_analytics table.
    """
    try:
        if success:
            await db.execute(
                """
                INSERT INTO notification_analytics (
                    notification_type, total_sent, total_success, last_sent_at
                )
                VALUES (
                    :notification_type, 1, 1, CURRENT_TIMESTAMP
                )
                ON CONFLICT (notification_type) DO UPDATE
                SET total_sent = notification_analytics.total_sent + 1,
                    total_success = notification_analytics.total_success + 1,
                    last_sent_at = CURRENT_TIMESTAMP
                """,
                {"notification_type": notification_type},
            )
        else:
            await db.execute(
                """
                INSERT INTO notification_analytics (
                    notification_type, total_sent, total_failure, last_sent_at
                )
                VALUES (
                    :notification_type, 1, 1, CURRENT_TIMESTAMP
                )
                ON CONFLICT (notification_type) DO UPDATE
                SET total_sent = notification_analytics.total_sent + 1,
                    total_failure = notification_analytics.total_failure + 1,
                    last_sent_at = CURRENT_TIMESTAMP
                """,
                {"notification_type": notification_type},
            )
        await db.commit()
    except SQLAlchemyError as e:
        logger.error("Failed to update notification analytics: %s", str(e))


async def send_discord_notification(
    db: AsyncSession, webhook_url: str, embed: dict, notification_type: str,
    success_message: str, error_message: str
):
    """
    Utility function to send a Discord notification.
    Logs the notification and updates analytics.
    """
    try:
        await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
        logger.info(success_message)
        await log_notification(db, webhook_url, notification_type, "success")
        await update_notification_analytics(db, notification_type, True)
    except Exception as e:
        logger.error("%s: %s", error_message, str(e))
        await log_notification(db, webhook_url, notification_type, "failure", str(e))
        await update_notification_analytics(db, notification_type, False)
        raise HTTPException(
            status_code=500,
            detail=f"{error_message}: {str(e)}"
        )


@router.post("/send-player-notification")
async def send_player_notification(
    webhook_url: str, player_name: str, event: str, team_name: str = None,
    color: int = 3447003, footer: str = None, timestamp: str = None,
    thumbnail: str = None, db: AsyncSession = Depends(get_db)
):
    """
    Send a notification to Discord about a player event.
    """
    description = f"Player {player_name} has {event}."
    if team_name:
        description += f" Team: {team_name}."
    embed = create_embed(
        f"Player {event.capitalize()}", description, color, footer,
        timestamp, thumbnail
    )
    send_discord_notification(
        db, webhook_url, embed, "player_notification",
        f"Player notification sent successfully for player: {player_name}",
        "Failed to send player notification"
    )
    return {
        "status": "success",
        "message": "Player notification sent successfully."
    }


@router.post("/send-contract-notification")
async def send_contract_notification(
    webhook_url: str, player_name: str, contract_status: str, team_name: str,
    color: int = 65280, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a contract update."""
    embed = create_embed(
        f"Contract {contract_status.capitalize()}",
        f"Player {player_name}'s contract with team {team_name} has been "
        f"{contract_status}.",
        color, footer, timestamp, thumbnail
    )
    send_discord_notification(
        webhook_url, embed,
        f"Contract notification sent successfully for player: {player_name}",
        "Failed to send contract notification"
    )
    return {
        "status": "success",
        "message": "Contract notification sent successfully."
    }


@router.post("/send-conference-update")
async def send_conference_update(
    webhook_url: str, conference_name: str, update_message: str,
    color: int = 3447003, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a conference update."""
    embed = create_embed(
        f"Conference Update: {conference_name}", update_message, color,
        footer, timestamp, thumbnail
    )
    send_discord_notification(
        webhook_url, embed,
        f"Conference update notification sent successfully for "
        f"conference: {conference_name}",
        "Failed to send conference update"
    )
    return {
        "status": "success",
        "message": "Conference update notification sent successfully."
    }


@router.post("/send-division-update")
async def send_division_update(
    webhook_url: str, division_name: str, update_message: str,
    color: int = 3447003, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a division update."""
    embed = create_embed(
        f"Division Update: {division_name}", update_message, color,
        footer, timestamp, thumbnail
    )
    send_discord_notification(
        webhook_url, embed,
        f"Division update notification sent successfully for "
        f"division: {division_name}",
        "Failed to send division update"
    )
    return {
        "status": "success",
        "message": "Division update notification sent successfully."
    }


@router.post("/send-workflow-notification")
async def send_workflow_notification(
    webhook_url: str, workflow_name: str, event: str,
    color: int = 3447003, footer: str = None, timestamp: str = None,
    thumbnail: str = None
):
    """Send a notification to Discord about a workflow event."""
    embed = create_embed(
        f"Workflow {event.capitalize()}",
        f"Workflow '{workflow_name}' has been {event}.",
        color, footer, timestamp, thumbnail
    )
    send_discord_notification(
        webhook_url, embed,
        f"Workflow notification sent successfully for "
        f"workflow: {workflow_name}",
        "Failed to send workflow notification"
    )
    return {
        "status": "success",
        "message": "Workflow notification sent successfully."
    }


@router.post("/send-bulk-notifications")
async def send_bulk_notifications(
    webhook_urls: list, title: str, description: str, color: int = 3447003,
    footer: str = None, timestamp: str = None, thumbnail: str = None
):
    """Send bulk notifications to multiple Discord webhooks."""
    embed = create_embed(
        title, description, color, footer, timestamp, thumbnail
    )
    failed_webhooks = []
    for webhook_url in webhook_urls:
        try:
            await run_in_threadpool(send_discord_message, webhook_url, content="", embeds=[embed])
            logger.info(
                "Notification sent successfully to webhook: %s",
                webhook_url
            )
        except Exception as e:
            logger.error(
                "Failed to send notification to webhook: %s. Error: %s",
                webhook_url, str(e)
            )
            failed_webhooks.append(webhook_url)
    if failed_webhooks:
        return {
            "status": "partial_success",
            "message": "Some notifications failed to send.",
            "failed_webhooks": failed_webhooks
        }
    return {
        "status": "success",
        "message": "All notifications sent successfully."
    }
