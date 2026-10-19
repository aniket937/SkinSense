from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user_profile import UserProfile

router = APIRouter(tags=["user-profile"])

@router.get("/",
    summary="Get user profile",
    description="Retrieve the current user's skincare profile. Creates a default profile if none exists."
)
async def get_profile(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == "default").first()
    if not profile:
        profile = UserProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile.to_dict()

@router.put("/",
    summary="Update user profile",
    description="Update the user's skincare profile with new information from questionnaire."
)
async def update_profile(
    profile_data: dict = Body(...),
    db: Session = Depends(get_db),
):
    profile = db.query(UserProfile).filter(UserProfile.id == "default").first()
    if not profile:
        profile = UserProfile()
        db.add(profile)
    profile.from_dict(profile_data)
    db.commit()
    db.refresh(profile)
    return profile.to_dict()
