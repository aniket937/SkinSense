from ai.validators.safety import (
    contains_prohibited_language,
    find_prohibited_language,
)


def test_allows_grounded_uncertainty_language() -> None:
    text = (
        "Based on the information you provided, this ingredient is commonly "
        "used for oil-related concerns. Individual response can vary."
    )

    assert contains_prohibited_language(text) is False


def test_detects_guarantee_claim() -> None:
    assert contains_prohibited_language("This will definitely work for you.")


def test_detects_perfect_for_you_claim() -> None:
    assert contains_prohibited_language("This is the perfect product for you.")


def test_detects_hundred_percent_safe_claim() -> None:
    assert contains_prohibited_language("This product is 100% safe.")


def test_detects_cure_claim() -> None:
    assert contains_prohibited_language("This will cure your acne.")


def test_detects_diagnostic_identity() -> None:
    assert contains_prohibited_language("You have rosacea.")


def test_returns_matched_phrases() -> None:
    findings = find_prohibited_language("Guaranteed results and you have eczema.")

    assert "Guaranteed" in findings
    assert "you have" in findings
