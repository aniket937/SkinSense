from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from datetime import datetime, timezone
from pydantic import BaseModel
import json

app = FastAPI(
    title="SkinSense",
    version="0.1.0",
    description="Personalized AI-powered skincare decision companion"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
class Base(DeclarativeBase):
    pass

engine = create_engine(
    "sqlite:///./skinsense.db",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# User profile model
class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(String, primary_key=True, default=lambda: "default")
    skin_behavior = Column(String, nullable=True)
    sensitivity = Column(String, nullable=True)
    concerns = Column(Text, nullable=True)
    current_products = Column(Text, nullable=True)
    preferences = Column(Text, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

# Create tables on startup
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic models for API ---

class RoutineGenerate(BaseModel):
    skin_behavior: str
    concerns: list[str]

class IngredientInfo(BaseModel):
    ingredient_name: str

class ProductCheck(BaseModel):
    product_name: str
    ingredients: list[str]
    skin_behavior: str
    concerns: list[str]

# --- Health Endpoint ---

@app.get("/api/v1/health/", tags=["health"])
async def health_check():
    return {"status": "healthy", "service": "SkinSense API", "version": "0.1.0"}

# --- Session Endpoint ---

@app.get("/api/v1/session/", tags=["session"])
async def get_session():
    import uuid
    return {"session_id": str(uuid.uuid4())}

# --- User Profile Endpoints ---

@app.get("/api/v1/user-profile/", tags=["user-profile"])
async def get_profile(db: Session = Depends(get_db)):
    from sqlalchemy.orm import Session as SQLSession
    db_gen = get_db()
    db = next(db_gen)
    profile = db.query(UserProfile).filter(UserProfile.id == "default").first()
    if not profile:
        profile = UserProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    concerns_list = profile.concerns.split(",") if profile.concerns else []
    products_list = profile.current_products.split(",") if profile.current_products else []
    return {
        "id": profile.id,
        "skin_behavior": profile.skin_behavior,
        "sensitivity": profile.sensitivity,
        "concerns": concerns_list,
        "current_products": products_list,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }

@app.put("/api/v1/user-profile/", tags=["user-profile"])
async def update_profile(profile_data: dict, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == "default").first()
    if not profile:
        profile = UserProfile()
        db.add(profile)
    profile.skin_behavior = profile_data.get("skin_behavior")
    profile.sensitivity = profile_data.get("sensitivity")
    profile.concerns = ",".join(profile_data.get("concerns", [])) if profile_data.get("concerns") else None
    profile.current_products = ",".join(profile_data.get("current_products", [])) if profile_data.get("current_products") else None
    from datetime import datetime, timezone
    profile.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(profile)
    concerns_list = profile.concerns.split(",") if profile.concerns else []
    products_list = profile.current_products.split(",") if profile.current_products else []
    return {
        "id": profile.id,
        "skin_behavior": profile.skin_behavior,
        "sensitivity": profile.sensitivity,
        "concerns": concerns_list,
        "current_products": products_list,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }

# --- Routine Generation Endpoint ---

@app.post("/api/v1/routine/generate", tags=["routine"])
async def generate_routine(payload: RoutineGenerate):
  """Simple routine generator based on skin behavior and concerns."""
  routine: dict[str, list[str]] = {"morning": [], "evening": [], "reasons": [], "safety_notes": []}
  
  if payload.skin_behavior == "oily":
    routine["morning"].append({"step": 1, "category": "cleanser", "purpose": "Control oil", "why": "Helps control excess oil production"})
    routine["morning"].append({"step": 2, "category": "moisturizer", "purpose": "Light hydration", "why": "Hydrate without clogging pores"})
    routine["morning"].append({"step": 3, "category": "spot treatment", "purpose": "Target acne", "why": "Contains acne-fighting ingredients"})
  elif payload.skin_behavior == "dry":
    routine["morning"].append({"step": 1, "category": "cleanser", "purpose": "Gentle cleanse", "why": "Clean without stripping natural oils"})
    routine["morning"].append({"step": 2, "category": "moisturizer", "purpose": "Deep hydration", "why": "Restore moisture barrier"})
    routine["evening"].append({"step": 1, "category": "moisturizer", "purpose": "Overnight repair", "why": "Restore skin while you sleep"})
  elif payload.skin_behavior == "combination":
    routine["morning"].append({"step": 1, "category": "cleanser", "purpose": "Balanced cleanse", "why": "Clean skin gently"})
    routine["morning"].append({"step": 2, "category": "spot treatment", "purpose": "Target oily zones", "why": "Address specific concerns"})
    routine["evening"].append({"step": 1, "category": "moisturizer", "purpose": "Overnight repair", "why": "Restore skin while you sleep"})
  else:
    routine["morning"].append({"step": 1, "category": "cleanser", "purpose": "Gentle cleanse", "why": "Start your routine"})
  
  if "acne" in payload.concerns:
    routine["morning"].append({"step": 3, "category": "spot treatment", "purpose": "Target acne", "why": "Contains acne-fighting ingredients"})
  if "dryness" in payload.concerns:
    routine["evening"].append({"step": 1, "category": "moisturizer", "purpose": "Overnight repair", "why": "Restore skin while you sleep"})
  if "oiliness" in payload.concerns:
    routine["morning"].append({"step": 3, "category": "toner", "purpose": "Balance oil", "why": "Helps control shine"})
  
  routine["safety_notes"].append("Patch test new products before full application")
  routine["safety_notes"].append("Introduce active ingredients gradually")
  
  return routine

# --- Ingredient Explainer Endpoint ---

class IngredientQuery(BaseModel):
    ingredient_name: str

@app.post("/api/v1/ingredient/explain", tags=["ingredient"])
async def explain_ingredient(payload: IngredientQuery):
  """Simple ingredient explainer based on common skincare knowledge."""
  ingredient = payload.ingredient_name.lower().strip()
  result = {
    "ingredient_name": payload.ingredient_name,
    "what_it_is": "",
    "common_roles": [],
    "relevant_considerations": [],
    "sources": []
  }
  
  ingredients_db = {
    "niacinamide": {
      "what_it_is": "Vitamin B3 derivative",
      "common_roles": ["brightening", "barrier support", "oil regulation"],
      "relevant_considerations": ["May cause initial purging", "Suitable for most skin types"],
      "sources": ["Commonly found in serums and moisturizers"]
    },
    "salicylic acid": {
      "what_it_is": "Beta hydroxy acid (BHA)",
      "common_roles": ["acne treatment", "exfoliation", "pore cleansing"],
      "relevant_considerations": ["Can increase sun sensitivity", "Start with low frequency"],
      "sources": ["Commonly found in cleansers and spot treatments"]
    },
    "hyaluronic acid": {
      "what_it_is": "Humectant",
      "common_roles": ["hydration", "moisture retention", "plumping"],
      "relevant_considerations": ["Suitable for all skin types", "Works well with other ingredients"],
      "sources": ["Found in moisturizers and serums"]
    },
    "retinol": {
      "what_it_is": "Vitamin A derivative",
      "common_roles": ["anti-aging", "cell turnover", "collagen stimulation"],
      "relevant_considerations": ["Increase sun sensitivity", "Pregnancy caution", "Start with low concentration"],
      "sources": ["Found in anti-aging creams and treatments"]
    },
    "vitamin c": {
      "what_it_is": "Ascorbic acid",
      "common_roles": ["brightening", "antioxidant", "collagen stimulation"],
      "relevant_considerations": ["Increase sun sensitivity"], 
      "sources": ["Found in serums and brightening products"]
    },
    "azelaic acid": {
      "what_it_is": "Dicarboxylic acid",
      "common_roles": ["acne treatment", "rosacea management", "brightening"],
      "relevant_considerations": ["Gentler than retinoids", "Suitable for sensitive skin"],
      "sources": ["Found in prescription and over-the-counter products"]
    },
    "ceramide": {
      "what_it_is": "Lipid molecule",
      "common_roles": ["barrier repair", "moisture retention", "skin protection"],
      "relevant_considerations": ["Suitable for all skin types", "Essential for healthy skin barrier"],
      "sources": ["Found in moisturizers and barrier repair creams"]
    },
    "benzoyl peroxide": {
      "what_it_is": "Peroxide compound",
      "common_roles": ["acne treatment", "bacteria reduction", "exfoliation"],
      "relevant_considerations": ["Can be drying", "May bleach fabrics", "Start with 2.5% concentration"],
      "sources": ["Found in acne treatment products"]
    },
    "AHA": {
      "what_it_is": "Alpha hydroxy acid",
      "common_roles": ["exfoliation", "brightening", "anti-aging"],
      "relevant_considerations": ["Increases sun sensitivity", "Use sunscreen daily"],
      "sources": ["Found in chemical peels and exfoliating products"]
    }
  }
  
  if ingredient in ingredients_db:
    db_entry = ingredients_db[ingredient]
    result["what_it_is"] = db_entry["what_it_is"]
    result["common_roles"] = db_entry["common_roles"]
    result["relevant_considerations"] = db_entry["relevant_considerations"]
    result["sources"] = db_entry["sources"]
  else:
    result["what_it_is"] = f"{ingredient} is a skincare ingredient"
    result["relevant_considerations"].append("This ingredient was not in our reference database. Consult a dermatologist for personalized advice.")
  
  return result

# --- Product Checker Endpoint ---

# Database of common skincare ingredients and their properties
PRODUCT_INGREDIENTS_DB = {
    "niacinamide": {
        "suitable_for": ["oily", "combination", "normal"],
        "contraindications": ["may cause initial purging in some users"],
        "roles": ["reduces inflammation", "minimizes pores", "regulates sebum"]
    },
    "salicylic acid": {
        "suitable_for": ["oily", "acne-prone"],
        "contraindications": ["increases sun sensitivity", "not for sensitive skin"],
        "roles": ["unclogs pores", "reduces acne", "exfoliates dead skin"]
    },
    "hyaluronic acid": {
        "suitable_for": ["all skin types"],
        "contraindications": ["generally well-tolerated"],
        "roles": ["holds 1000x its weight in water", "plumps skin"]
    },
    "retinol": {
        "suitable_for": ["normal", "mature", "acne-prone"],
        "contraindications": ["pregnancy caution", "increases sun sensitivity", "initial purging"],
        "roles": ["boosts collagen", "reduces fine lines", "accelerates cell turnover"]
    },
    "vitamin c": {
        "suitable_for": ["most skin types"],
        "contraindications": ["increases sun sensitivity"],
        "roles": ["collagen stimulation", "dark spot reduction", "protects from free radicals"]
    },
    "azelaic acid": {
        "suitable_for": ["sensitive", "rosacea", "acne-prone"],
        "contraindications": ["generally safe"],
        "roles": ["reduces inflammation", "clears pores", "evenes skin tone"]
    },
    "ceramide": {
        "suitable_for": ["all skin types"],
        "contraindications": ["generally well-tolerated"],
        "roles": ["restores skin barrier", "prevents transepidermal water loss"]
    },
    "benzoyl peroxide": {
        "suitable_for": ["oily", "acne-prone"],
        "contraindications": ["can be very drying", "may bleach fabrics"],
        "roles": ["kills acne bacteria", "reduces inflammation"]
    },
    "AHA": {
        "suitable_for": ["normal", "dry"],
        "contraindications": ["increases sun sensitivity", "not for sensitive skin"],
        "roles": ["removes dead skin cells", "improves texture", "brightens"]
    },
    "peptides": {
        "suitable_for": ["all skin types"],
        "contraindications": ["generally well-tolerated"],
        "roles": ["signals collagen production", "improves elasticity"]
    }
}

@app.post("/api/v1/product/check", tags=["product"])
async def check_product(payload: ProductCheck):
    """Check product ingredients against user's skin profile for compatibility."""
    concerns = payload.concerns
    skin_behavior = payload.skin_behavior
    
    analysis = {
        "product_name": payload.product_name,
        "compatibility_score": 100,
        "warnings": [],
        "recommendations": [],
        "ingredient_analysis": []
    }
    
    # Check each ingredient in the product
    for ingredient in payload.ingredients:
        ingredient_lower = ingredient.lower().strip()
        ingredient_info = PRODUCT_INGREDIENTS_DB.get(ingredient_lower)
        
        if ingredient_info:
            suitable_list = ingredient_info.get("suitable_for", [])
            is_suitable = skin_behavior in suitable_list if suitable_list else True
            
            analysis["ingredient_analysis"].append({
                "ingredient": ingredient,
                "roles": ingredient_info.get("roles", ["unknown"]),
                "suitable": is_suitable,
                "contraindications": ingredient_info.get("contraindications", [])
            })
            
            # Check contraindications against user's concerns
            for concern in concerns:
                concern_lower = concern.lower()
                for contra in ingredient_info.get("contraindications", []):
                    if concern_lower in contra.lower():
                        analysis["warnings"].append(
                            f"{ingredient} may not be suitable for: {concern}"
                        )
                        analysis["compatibility_score"] -= 15
            
            # Check suitability for skin behavior
            if not is_suitable:
                analysis["warnings"].append(
                    f"{ingredient} may not be ideal for {skin_behavior} skin"
                )
                analysis["compatibility_score"] -= 10
        else:
            # Unknown ingredient - generic safety check
            analysis["ingredient_analysis"].append({
                "ingredient": ingredient,
                "roles": ["unknown - consult dermatologist"],
                "suitable": None,
                "contraindications": ["unknown"]
            })
            analysis["compatibility_score"] -= 20
    
    # Ensure score doesn't go below 0
    analysis["compatibility_score"] = max(0, analysis["compatibility_score"])
    
    # Generate recommendations based on remaining score
    if analysis["compatibility_score"] >= 80:
        analysis["recommendations"].append("This product appears compatible with your skin profile")
    elif analysis["compatibility_score"] >= 50:
        analysis["recommendations"].append("This product may work but use with caution")
    else:
        analysis["recommendations"].append("Consult a dermatologist before using this product")
    
    if not analysis["warnings"]:
        analysis["recommendations"].append("No major conflicts detected with your current profile")
    
    # Add general skincare advice
    if "acne" in concerns:
        analysis["recommendations"].append("For acne-prone skin, look for non-comedogenic products")
    if "dryness" in concerns:
        analysis["recommendations"].append("For dry skin, ensure products contain hydrating ingredients like hyaluronic acid or ceramides")
    if "sensitivity" in concerns:
        analysis["recommendations"].append("For sensitive skin, patch test new products and introduce actives gradually")
    
    return analysis
