# SkinSense — User Problem & Research

## 1. Purpose of This Document

This document defines the **real user problem** that led to the creation of SkinSense.

It is the primary reference for understanding:

* who the initial user is,
* what the user currently struggles with,
* how the user currently makes skincare decisions,
* what creates uncertainty,
* what the user expects from a better solution,
* and which observations are confirmed versus which are still assumptions.

This document must remain grounded in **actual user feedback**.

Do not invent additional pain points, behaviors, demographics, requirements, or motivations unless they are supported by future user research.

---

# 2. Initial User

## User Type

The initial SkinSense user is a real friend who actively engages with skincare and has experience using skincare products.

The project is being built specifically to address this person's skincare decision-making difficulties.

The initial user is not being treated as a representative of every skincare user.

Insights from this user can guide the first version of the product, but broader claims about the general population require additional validation.

---

# 3. How the Problem Was Identified

The product direction was developed by directly asking the friend about her current skincare behavior and areas of confusion.

The goal of the conversation was not to sell or validate a predetermined application idea.

The questions focused on understanding:

* skincare confusion,
* product selection,
* ingredient understanding,
* routine selection,
* product effectiveness,
* and current decision-making methods.

The responses below represent the current validated observations.

---

# 4. Confirmed User Problems

## 4.1 Difficulty Identifying Skin Type

### User problem

The user finds it confusing to determine:

> **"What is my skin type?"**

This is one of the first uncertainties in the user's skincare journey.

The user believes that understanding their skin type is an important step toward choosing suitable skincare products.

### Why it matters

Without confidence about their skin type, the user finds it harder to determine:

* which products to consider,
* which products to avoid,
* which routine may make sense,
* and which recommendations are relevant to them.

### Current workaround

The user currently tries to:

* understand their own skin type,
* then select products based on that understanding.

This creates uncertainty because the initial classification itself may not be clear.

### Product implication

SkinSense should make the process of understanding the user's skincare profile clearer and easier.

The system should not present a user-generated skin profile as a medical diagnosis.

---

# 5. Difficulty Choosing the Right Brand or Product

## User problem

The user is uncertain about:

> **"What brand should I select?"**

The problem is not simply finding skincare brands.

There are many available brands and products, but the user does not have a reliable decision process for determining which one is appropriate for their own needs.

### Current uncertainty

The user may encounter multiple products that appear to address the same concern and does not always know how to distinguish between them.

### Product implication

SkinSense should help the user evaluate products based on relevant information rather than blindly promoting a particular brand.

The system should focus on:

* product information,
* ingredients,
* intended use,
* compatibility with the user's context,
* and transparent reasoning.

SkinSense should not automatically interpret an expensive or popular brand as better.

---

# 6. Confusion About Different Brands Using the Same Ingredient

## User observation

The user confirmed that they encounter situations where:

> Different brands contain the same ingredient.

This creates a natural question:

> **"If the ingredient is the same, why are there different products and brands?"**

### Why this matters

The user may not understand why two products with a shared ingredient can differ in:

* formulation,
* supporting ingredients,
* concentration,
* texture,
* intended use,
* or overall suitability.

### Product implication

SkinSense should help the user understand that:

> **An ingredient name alone is not enough to completely evaluate a product.**

The system should explain relevant distinctions without oversimplifying them.

It should help answer:

* What is the ingredient?
* What is it generally used for?
* What role does it play in this product?
* What else is present in the formulation?
* How does this product relate to the user's existing routine?

---

# 7. Routine Order Is Known, but Personal Relevance Is Unclear

## User observation

The user is familiar with a common skincare sequence such as:

> Face wash → Toner → Serum → Moisturizer → ...

However, knowing a generic sequence does not necessarily answer:

> **Which of these steps does this person actually need?**

### Core distinction

The problem is therefore not simply:

> "I don't know the order of skincare products."

The deeper problem is:

> **"I don't know which steps and products make sense for my own skin and situation."**

### Product implication

SkinSense should avoid creating a routine merely by filling every possible skincare step.

Instead, it should:

* understand the user's context,
* determine which steps are relevant,
* keep the routine practical,
* explain why each included step exists,
* and avoid unnecessary complexity.

---

# 8. Uncertainty About Whether Skincare Is Actually Working

## User problem

One of the most important concerns identified by the user is:

> **"Is my skincare actually working?"**

This creates uncertainty after a product or routine has already been selected.

### Why this matters

The user may use a product without being sure:

* whether the product is helping,
* whether enough time has passed,
* whether the observed change is meaningful,
* whether another factor affected the outcome,
* or whether they should continue, change, or stop the routine.

### Current problem

The user does not have a structured way to evaluate their personal skincare experience.

### Product implication

SkinSense may provide a lightweight tracking capability that helps the user record:

* product introduction dates,
* products being used,
* self-reported skin changes,
* and personal observations.

The system can identify patterns in the user's own records.

It must not automatically claim:

> "This product caused this change."

Simple correlation in a personal journal is not proof of causation.

---

# 9. Lack of Understanding of Skincare Ingredients and Acids

## User problem

The user wants to understand:

> **"What do these chemicals or acids actually do?"**

This reflects a knowledge gap around skincare terminology and active ingredients.

### Example of the type of confusion

The user may see ingredient names or acids on a product label without clearly understanding:

* what they are,
* why they are included,
* what they are commonly used for,
* how they differ,
* or why they may or may not be relevant to their routine.

### Product implication

SkinSense should translate ingredient terminology into understandable explanations.

The system should prioritize:

* simple language,
* context,
* practical meaning,
* and appropriate uncertainty.

It should not overwhelm users with unnecessary technical chemistry.

Detailed ingredient knowledge belongs in:

`06_SKINCARE_DOMAIN.md`

---

# 10. Difficulty Determining Which Product or Ingredient Is Right for the User

## User problem

The user explicitly identified difficulty with:

> **"How to decide which product or ingredients are perfect for me?"**

This is closely connected to the earlier problems but represents the broader decision-making challenge.

The user currently relies primarily on:

> **Trial and error**

or:

> **Understanding their skin type first.**

### Current decision process

The current process can be represented as:

```text
See a product
↓
Try to understand skin type
↓
Choose a product
↓
Use it
↓
Observe what happens
↓
Decide whether it works
```

This can feel uncertain because there is no clear personalized decision framework before purchasing or introducing a product.

### Product implication

SkinSense should move the user toward:

```text
Understand personal context
↓
Understand product/ingredients
↓
Compare with current routine
↓
Understand potential fit and considerations
↓
Make an informed decision
↓
Track personal experience
```

The goal is not to eliminate all uncertainty.

The goal is to **reduce unnecessary trial and error** and improve the quality of the user's decision.

---

# 11. Current User Behavior

The current user behavior identified so far can be summarized as:

### Before choosing a product

The user tries to understand their skin type and decide which brand/product to select.

### While comparing products

The user notices that different brands may contain the same ingredient and is unsure how much that should influence the decision.

### While following a routine

The user knows a general sequence of skincare steps but still has uncertainty about whether the routine is actually right for them.

### After using a product

The user wants to know whether the skincare is genuinely working.

### When researching ingredients

The user wants to understand the purpose of chemicals, acids, and other active ingredients.

### Overall selection method

The user currently relies significantly on:

> **Trial and error**

---

# 12. Current Workarounds

The user currently relies on two major workarounds:

## 12.1 Trial and Error

The user tries products and observes what happens.

This can eventually provide personal experience but does not provide much confidence before making a purchase or introducing a new product.

## 12.2 Understanding Skin Type

The user attempts to identify their skin type and uses that information to guide product selection.

This is useful as a starting point but does not completely answer product-selection questions.

---

# 13. Root Problem

The different complaints appear to connect to one broader issue:

> **The user has access to many skincare products and a large amount of skincare information, but lacks a clear, personalized framework for turning that information into confident skincare decisions.**

The problem is therefore not simply:

> lack of skincare information.

It is:

> **difficulty interpreting skincare information in the context of the user's own skin, routine, products, and goals.**

---

# 14. User's Desired Outcome

Based on the current feedback, the user needs a way to:

1. Understand their skin type/profile more clearly.
2. Understand what skincare ingredients actually do.
3. Compare skincare products more intelligently.
4. Understand why different brands may use similar ingredients.
5. Know which skincare steps are relevant for their situation.
6. Determine whether a product fits with what they already use.
7. Reduce unnecessary trial and error.
8. Better understand whether their skincare routine is producing useful personal results.

The goal is not to create absolute certainty.

The goal is to make the decision process **clearer, more personalized, and more informed**.

---

# 15. Problem Hierarchy

The user's problems can be organized into a decision journey:

```text
                    SKINCARE DECISION PROBLEM
                              │
             ┌────────────────┴────────────────┐
             │                                 │
       Understand Myself                 Understand Products
             │                                 │
       What is my skin type?             Which brand?
       What does my skin need?           Which ingredients?
             │                           What do acids do?
             │                           Same ingredient,
             │                           different brands?
             │                                 │
             └──────────────┬──────────────────┘
                            │
                            ▼
                    Make a Decision
                            │
                            ▼
                  Build / Change Routine
                            │
                            ▼
                    Use the Products
                            │
                            ▼
                   "Is it working?"
```

This hierarchy is more important than any individual feature.

---

# 16. What the Product Must Solve

The first version of SkinSense should primarily address three connected decisions:

## Decision 1 — Understand My Skin

Help the user build a useful personal skincare profile.

## Decision 2 — Understand This Product

Help the user understand what a product contains and what its important ingredients generally do.

## Decision 3 — Does This Make Sense for Me?

Use the user's context and product information together to explain whether adding the product to the user's routine appears reasonable and what considerations exist.

These three decisions represent the strongest connection between the observed user problems and the proposed product.

---

# 17. What the Product Should Not Assume

The following are **not yet validated** and must not be treated as confirmed user requirements:

* the user wants a marketplace,
* the user wants product purchasing inside the application,
* the user wants influencer recommendations,
* the user wants social features,
* the user wants automatic facial diagnosis,
* the user wants a complex daily habit system,
* the user wants dozens of skincare steps,
* the user wants recommendations based only on product popularity,
* the user wants a particular brand.

Future research may validate or reject these assumptions.

---

# 18. Important Product Research Questions

Future research should investigate:

1. How does the user currently determine their skin type?
2. What sources does the user trust when choosing a product?
3. How does the user compare two products with similar ingredients?
4. How long does the user normally use a product before deciding whether it works?
5. How does the user track skincare progress, if at all?
6. What information would make the user trust a product-analysis result?
7. Which parts of the skincare decision process should remain under the user's control?
8. What type of guidance would make the user feel informed rather than controlled?

These questions should be answered through actual user interaction rather than assumptions.

---

# 19. Core User Job

The user's core job can currently be expressed as:

> **"Help me understand my skin and the products I am considering well enough to make a better skincare decision without relying entirely on trial and error."**

This is the primary user job that SkinSense should serve.

---

# 20. User Problem → Product Capability Mapping

| Real User Problem                               | Potential SkinSense Capability            |
| ----------------------------------------------- | ----------------------------------------- |
| Don't know skin type                            | Guided skin-profile experience            |
| Don't know which brand/product to select        | Product understanding and comparison      |
| Different brands use same ingredients           | Ingredient and formulation explanation    |
| Don't know skincare steps                       | Personalized routine generation           |
| Don't understand acids/chemicals                | Simple ingredient explanations            |
| Don't know if skincare is working               | Personal progress/journal tracking        |
| Uses trial and error                            | Pre-purchase/product-fit decision support |
| Unsure whether new product fits current routine | Routine compatibility analysis            |

This mapping is a product-development aid, not proof that every capability must be built in the MVP.

---

# 21. Most Important Insight

The strongest insight from the initial user research is:

> **The user does not simply need more skincare information. The user needs help connecting skincare information to their own situation.**

A product can explain what an ingredient is without solving the user's actual problem.

SkinSense should therefore connect:

```text
My skin
+
My concerns
+
My current routine
+
This product
+
These ingredients
+
My experience over time
```

and turn that information into an understandable decision-support experience.

---

# 22. Product Research Principle

The project must remain **problem-led, not feature-led**.

Do not begin with:

> "What AI feature can we add?"

Begin with:

> "What part of the user's skincare decision is currently difficult?"

Then determine whether AI can meaningfully improve that part.

---

# 23. Validation Status

### Confirmed

* Skin-type identification is confusing.
* Brand/product selection is confusing.
* Different brands can contain the same ingredient and this creates questions.
* The user wants to understand skincare steps.
* The user wants to understand ingredients/acids.
* The user is uncertain about whether skincare is actually working.
* The user does not have a reliable way to determine which product/ingredient is right for them.
* Trial and error is a current selection strategy.

### Not Yet Confirmed

* Exact preferred interface.
* Exact preferred routine complexity.
* Exact trust requirements.
* Preferred voice interaction frequency.
* Whether the user would upload product photos regularly.
* Whether the user wants progress tracking.
* Which specific skincare categories matter most.
* Which specific product-analysis information is most valuable.

These should be validated before being treated as strong product requirements.

---

# 24. Non-Negotiable Research Rule

When new user research conflicts with an existing product assumption:

> **User evidence wins.**

The product should change when the real user's problem changes or becomes better understood.

The team should never manipulate user research to fit an already-built feature.

---

# 25. Definition of Done

This document is considered sufficiently validated for the current MVP when:

* the original user's core problem is clearly documented,
* the current workaround is understood,
* the main decision points are identified,
* the product's primary problem is separated from secondary symptoms,
* confirmed facts are separated from assumptions,
* and every MVP feature can be traced back to a real user problem.

This document must be updated when meaningful new user research is obtained.
