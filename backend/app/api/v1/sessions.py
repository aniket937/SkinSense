from fastapi import APIRouter
import uuid

router = APIRouter()


@router.get(
    "/",
    summary="Get or create user session",
    description="Returns a session ID for tracking the user's onboarding flow. "
                "Stateless — no server-side session store required for MVP.",
)
async def get_session():
    """Minimal session management: return a session ID for the frontend to track."""
    session_id = str(uuid.uuid4())
    return {"session_id": session_id}