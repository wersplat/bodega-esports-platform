import gspread
from oauth2client.service_account import ServiceAccountCredentials

SCOPE = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
SERVICE_ACCOUNT_FILE = "backend/credentials/service_account.json"  # path to your JSON creds

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
    worksheet.append_row(headers)
    for row in rows:
        worksheet.append_row(row)
