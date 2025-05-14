from fastapi import APIRouter

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)

@router.get("/history")
async def get_payment_history():
    """
    Fetch payment history for current user.
    """
    pass

@router.post("/create-checkout-session")
async def create_checkout_session():
    """
    Create a Stripe Checkout session for registration or membership.
    """
    pass

@router.post("/webhook")
async def stripe_webhook():
    """
    Stripe webhook listener.
    """
    # TODO: Fetch webhook for successful payments
    # webhook_url = fetch_webhook_url(webhook_type="payment_completed")
    # send_discord_webhook(content="Payment completed.", webhook_url=webhook_url)
    pass
