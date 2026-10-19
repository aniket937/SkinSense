from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RoutineStep(BaseModel):
    step: int = Field(ge=1)
    category: str = Field(min_length=1)
    purpose: str = Field(min_length=1)
    why: str = Field(min_length=1)
    optional: bool = False


class RoutineOutput(BaseModel):
    morning: list[RoutineStep] = Field(default_factory=list)
    evening: list[RoutineStep] = Field(default_factory=list)
    general_notes: list[str] = Field(default_factory=list)
    considerations: list[str] = Field(default_factory=list)
    unknowns: list[str] = Field(default_factory=list)
    safety_notes: list[str] = Field(default_factory=list)


class AssessmentState(str, Enum):
    REASONABLY_COMPATIBLE = "REASONABLY_COMPATIBLE"
    CONSIDER_CAREFULLY = "CONSIDER_CAREFULLY"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"
    PROFESSIONAL_EVALUATION_RECOMMENDED = "PROFESSIONAL_EVALUATION_RECOMMENDED"


class CompatibilityOutput(BaseModel):
    assessment: AssessmentState
    summary: str = Field(min_length=1)
    reasons: list[str] = Field(default_factory=list)
    overlaps: list[str] = Field(default_factory=list)
    considerations: list[str] = Field(default_factory=list)
    unknowns: list[str] = Field(default_factory=list)
    safety_notes: list[str] = Field(default_factory=list)


class IngredientOutput(BaseModel):
    ingredient_name: str = Field(min_length=1)
    what_it_is: str = Field(min_length=1)
    common_roles: list[str] = Field(default_factory=list)
    relevant_considerations: list[str] = Field(default_factory=list)
    user_context: Optional[str] = None
    unknowns: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)
