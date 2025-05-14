from fastapi import APIRouter

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
)

@router.post("/send")
async def send_contract():
    """
    Send a contract offer to a player.
    """
    # TODO: Fetch webhook for contract offers
    # webhook_url = fetch_webhook_url(webhook_type="contract_sent")
    # send_discord_webhook(content="New contract offer sent!", webhook_url=webhook_url)
    pass

@router.post("/{contract_id}/accept")
async def accept_contract(contract_id: str):
    """
    Accept a contract offer.
    """
    pass

@router.post("/{contract_id}/reject")
async def reject_contract(contract_id: str):
    """
    Reject a contract offer.
    """
    pass

@router.post("/{contract_id}/buyout")
async def buyout_contract(contract_id: str):
    """
    Buyout an existing contract.
    """
    pass
