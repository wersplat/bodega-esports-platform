import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Define Google Sheets access scope and credentials path
SCOPE = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
SERVICE_ACCOUNT_FILE = "backend/credentials/service_account.json"  # Local service account file

def get_client():
    creds = ServiceAccountCredentials.from_json_keyfile_name(SERVICE_ACCOUNT_FILE, SCOPE)
    return gspread.authorize(creds)

def write_sheet(sheet_id, tab_name, headers, rows):
    client = get_client()
    sheet = client.open_by_key(sheet_id)

    try:
        worksheet = sheet.worksheet(tab_name)
        sheet.del_worksheet(worksheet)
    except:
        pass

    worksheet = sheet.add_worksheet(title=tab_name, rows="100", cols="20")

    # Write headers
    worksheet.append_row(headers)

    # Write rows
    for row in rows:
        worksheet.append_row(row)

def append_leaderboard_to_sheet(season_id: int, data: list):
    """
    Exports leaderboard data to a new tab in the specified Google Sheet.
    """
    sheet_id = os.getenv("GOOGLE_SHEET_ID", "your-default-sheet-id")
    tab_name = f"Season {season_id}"

    headers = ["Profile", "Points", "Assists", "Rebounds", "Win %"]
    rows = [
        [
            player["username"],
            player["points_per_game"],
            player["assists_per_game"],
            player["rebounds_per_game"],
            player["win_percentage"]
        ]
        for player in data
    ]

    try:
        write_sheet(sheet_id, tab_name, headers, rows)
        return True
    except Exception as e:
        print(f"[Sheets Export] Failed: {e}")
        return False
