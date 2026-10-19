from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "service": "SkinSense API",
        "version": "0.1.0"
    }
