# SkinSense — Skincare Domain Knowledge

## 1. Purpose

This document defines the skincare-domain concepts that SkinSense may use when reasoning about skincare questions, routines, products, ingredients, and user-reported skin experiences.

It establishes:

- skincare terminology,
- skin-profile concepts,
- routine concepts,
- ingredient categories,
- common ingredient roles,
- product-selection principles,
- seasonal/environmental context,
- evidence boundaries,
- and domain-specific reasoning rules.

This document is a **domain knowledge reference**, not a medical textbook and not a complete database of all skincare ingredients.

The application should use this knowledge conservatively and should not invent information that is not available from this document, its approved sources, or validated product data.

---

# 2. Domain Scope

SkinSense operates in the area of:

> **Consumer skincare education and personalized skincare decision support.**

The domain includes:

- skin type understanding,
- skin concerns,
- skincare routine structure,
- product categories,
- ingredient education,
- product-label interpretation,
- routine compatibility,
- environmental/seasonal context,
- personal skincare observations.

The domain does not include:

- medical diagnosis,
- disease classification,
- prescription management,
- guaranteed treatment,
- dermatologist replacement.

Detailed safety boundaries are defined in:

`12_SAFETY.md`

---

# 3. Fundamental Domain Principle

Skincare information should be interpreted in context.

A skincare decision may depend on multiple factors:

```text id="o35n6t"
User's reported skin context
+
Current concern
+
Current routine
+
Product formulation
+
Ingredient information
+
Usage context
+
Personal tolerance
+
Environmental context
```

Therefore:

> **A single ingredient name, brand name, skin type label, or social-media recommendation should not automatically determine whether a product is appropriate for a user.**

---

# 4. Skin Type vs Skin Condition

SkinSense must distinguish between:

## Skin Type

A relatively broad description of how the skin tends to behave.

Common consumer-facing categories include:

- Dry
- Oily
- Combination
- Normal

AAD consumer guidance describes dry skin as flaky/itchy/rough, oily skin as shiny/greasy, and combination skin as dry in some areas and oily in others.

## Skin Sensitivity

Sensitivity describes how the skin reacts to products or environmental factors.

A user may report:

- stinging,
- burning,
- irritation,
- redness,
- or discomfort.

Sensitivity should be treated as a separate contextual property rather than automatically equating it with a baseline skin type.

## Skin Concern

A concern is something the user wants to improve or understand.

Examples:

- oiliness,
- dryness,
- breakouts,
- uneven texture,
- pigmentation/dark spots,
- dull appearance,
- sensitivity.

## Medical Condition

A medical condition requires a different level of evaluation and is outside SkinSense's diagnostic scope.

The AI must not convert a reported concern into a medical diagnosis.

---

# 5. User-Reported Skin Profile

SkinSense should represent the user's skin information as a **personal skincare profile**, not as an authoritative medical classification.

The profile may contain:

```text id="4a9q5l"
Baseline skin behavior
Skin sensitivity
Current concerns
Current routine
Products currently used
Relevant preferences
Observed reactions
Environmental context
Unknown information
```

Each profile attribute should ideally indicate whether it is:

### User-provided

Directly stated by the user.

### System-inferred

A reasonable interpretation of user responses.

### Unknown

Not enough information is available.

The system must not silently convert "unknown" into a confident value.

---

# 6. Skin Type Understanding

## 6.1 General Approach

SkinSense may help users understand their likely skin behavior through guided questions.

Examples of useful observations:

- how skin feels after cleansing,
- whether skin becomes oily during the day,
- whether some areas are oily while others feel dry,
- whether products commonly sting or irritate,
- how skin behaves under different environmental conditions.

The system should focus on observable behavior rather than pretending that a short questionnaire produces a clinical diagnosis.

---

# 7. Dry Skin

General consumer description:

Dry skin may appear or feel:

- rough,
- flaky,
- tight,
- itchy,
- or less comfortable.

AAD notes that creams/ointments may provide more moisture than lotions for people with dry skin, especially when winter increases dryness.

### SkinSense implication

For a user reporting dryness, the system may consider:

- gentler cleansing,
- moisturization,
- barrier-supportive product categories,
- reducing unnecessary irritating steps,
- environmental context.

The system should not automatically assume that every dry-feeling user has a medical skin disorder.

---

# 8. Oily Skin

General consumer description:

Oily skin tends to appear:

- shiny,
- greasy,
- or more oil-prone during the day.

AAD notes that product selection for oily skin can differ from dry skin and that lighter gel moisturizers may be considered for some people with oily skin.

### SkinSense implication

For users reporting oiliness, the system may consider:

- lightweight product textures,
- appropriate cleansing,
- avoiding unnecessarily heavy routines,
- non-comedogenic product labeling where relevant.

The system should not equate oiliness automatically with acne.

---

# 9. Combination Skin

Combination skin involves different behavior across areas of the face.

A common pattern is:

```text id="b7q3ka"
T-zone → more oily
Other areas → drier
```

AAD describes combination skin as dry in some areas and oily in others, often involving the T-zone.

### SkinSense implication

The system should not force the user into an entirely oily-skin or entirely dry-skin routine when their reported experience is mixed.

---

# 10. Normal Skin

"Normal skin" may be used as a broad consumer-facing category when the user reports relatively balanced skin without significant oiliness, dryness, or sensitivity.

It should not be treated as a medically superior category.

---

# 11. Sensitive Skin

Sensitivity should be treated cautiously.

A user may describe:

- burning,
- stinging,
- redness,
- itching,
- irritation,
- or discomfort after applying products.

FDA notes that cosmetic products can trigger allergic reactions in some people and that irritation can also occur independently of allergy.

### SkinSense implication

When a user reports repeated or significant sensitivity:

- simplify the guidance,
- avoid unnecessary experimentation,
- emphasize label-following,
- avoid confident claims about the cause,
- and follow the safety/escalation rules.

---

# 12. Skin Concerns

SkinSense may organize user concerns into broad categories.

## Oiliness

User reports excess oil or shine.

## Dryness

User reports tightness, roughness, or flaking.

## Breakouts

User reports pimples or recurring breakouts.

The application must not automatically diagnose acne from this input.

## Uneven Texture

User reports roughness or uneven surface appearance.

## Dark Spots / Uneven Pigmentation

User reports areas of darker pigmentation or post-blemish marks.

The application should not diagnose the cause of pigmentation from text alone.

## Dull Appearance

User reports lack of brightness or uneven-looking complexion.

## Sensitivity / Irritation

User reports uncomfortable reactions to products or environmental conditions.

---

# 13. Product Categories

SkinSense may reason about common skincare product categories such as:

- cleanser,
- moisturizer,
- sunscreen,
- toner,
- serum,
- treatment product,
- exfoliating product,
- spot-treatment product.

The existence of a category does not mean every user needs it.

---

# 14. Routine Concept

A skincare routine is an ordered set of products or product categories used at particular times.

A routine may be divided into:

```text id="bg5x2v"
Morning
Evening
Occasional / Optional
```

A routine should be designed according to the user's context rather than by filling every possible category.

AAD recommends a basic ordering in which cleansing comes first, treatment/medication where applicable follows cleansing, then moisturizer and/or sunscreen, with makeup after. AAD also notes that using too many products can irritate the skin.

---

# 15. Routine Simplicity

SkinSense should favor:

> **the smallest useful routine that addresses the user's stated needs.**

The application should not assume:

```text id="43vpx8"
More products = better skincare
```

AAD specifically emphasizes that consistency can matter more than a large multi-step routine and cautions that too many products can cause irritation.

---

# 16. Basic Routine Structure

A general routine may contain:

### Cleanse

Used to clean the skin.

### Treatment / Targeted Step

Used when a particular product or active is relevant.

### Moisturize

Supports hydration and comfort.

### Sun Protection

Important during daytime exposure.

The exact routine must depend on the user's context.

A generic structure is **not automatically a personalized recommendation**.

---

# 17. Cleansing

A cleanser is intended to remove dirt, oil, and other surface material.

AAD recommends a gentle cleanser and notes that excessive washing can contribute to irritation.

### SkinSense Principle

The application should not encourage aggressive scrubbing or excessively frequent cleansing merely because the user reports oiliness.

---

# 18. Moisturization

Moisturizers are used to help maintain skin hydration and support comfortable skin.

Different textures may suit different users.

Examples:

- lotions,
- creams,
- gels,
- ointments.

AAD notes that creams and ointments can be more effective for dry skin than lighter lotions, while lighter gel textures may be considered for some oily users.

### SkinSense Principle

Do not classify one moisturizer texture as universally best.

---

# 19. Sun Protection

Sun protection is a foundational skincare concept.

AAD recommends sunscreen with:

- broad-spectrum protection,
- SPF 30 or higher,
- water resistance.

AAD explains that broad-spectrum protection covers UVA and UVB radiation.

SkinSense should treat sun protection as an important part of appropriate daytime skincare guidance when relevant.

---

# 20. Sunscreen Product Understanding

When interpreting sunscreen labels, SkinSense may explain:

### SPF

Indicates the level of protection against sunburn from UVB radiation.

### Broad Spectrum

Indicates protection from UVA and UVB.

### Water Resistant

Indicates that the product maintains protection under specified wet/sweating conditions for the labeled period.

These meanings should be explained from authoritative sources rather than guessed from marketing language.

---

# 21. Sunscreen and Product Selection

When helping users evaluate sunscreen, SkinSense should consider:

- SPF,
- broad-spectrum labeling,
- water resistance,
- product texture,
- user's skin preference,
- intended use.

AAD notes that creams may suit dry skin while gels may suit some oily complexions, but product choice remains personal.

The system should not claim that one sunscreen brand is universally best.

---

# 22. What Is an Ingredient?

A skincare ingredient is a substance used as part of a product's formulation.

Ingredients may have different roles, including:

- cleansing,
- moisturizing,
- preserving,
- fragrance,
- texture modification,
- UV protection,
- exfoliation,
- or other functional roles.

An ingredient name alone does not describe the full behavior of the finished formulation.

---

# 23. "Chemical" Is Not a Negative Category

SkinSense must avoid presenting "chemical" as synonymous with:

- dangerous,
- artificial,
- harmful,
- or inferior.

Everything in a formulated skincare product consists of chemical substances.

The system should instead discuss:

- ingredient identity,
- purpose,
- formulation context,
- relevant evidence,
- usage instructions,
- and potential sensitivities.

---

# 24. Ingredient List Interpretation

A product ingredient list provides information about what the formulation contains.

FDA consumer guidance emphasizes reading the entire label, including ingredients, warnings, and instructions.

Ingredient lists should be treated as valuable evidence, but not as a complete substitute for formulation information or professional evaluation.

---

# 25. Same Ingredient ≠ Same Product

Two products can contain the same named ingredient while still being different products.

Possible differences may include:

- concentration,
- supporting ingredients,
- formulation,
- texture,
- delivery system,
- intended use,
- product format,
- and usage directions.

Therefore:

> **Same ingredient name does not automatically mean two products are equivalent.**

SkinSense should explain this when the user compares products from different brands.

The system must not infer exact ingredient concentration unless reliable concentration data is explicitly available.

---

# 26. Brand Selection Principle

Brand popularity should not be treated as proof that a product is suitable for the user.

SkinSense should evaluate products using available evidence and user context rather than:

- popularity,
- influencer status,
- price,
- marketing claims,
- or brand prestige alone.

A lesser-known brand may have a formulation that is relevant to a user's stated needs, while a famous brand may not be appropriate for that user.

However, SkinSense must not claim that an unknown brand is safe or effective merely because its ingredient list looks good.

---

# 27. Ingredient Categories

SkinSense may organize ingredients by broad functional categories.

### Humectants

Ingredients commonly used to attract or retain water in the skin's outer layers.

Examples:

- glycerin,
- hyaluronic acid.

### Emollients

Ingredients that help soften and smooth the skin.

### Occlusive ingredients

Ingredients that can help reduce water loss by forming a barrier-like layer.

### Barrier-supportive ingredients

Ingredients commonly associated with supporting the skin barrier, such as ceramides.

### Exfoliating ingredients

Ingredients used to remove or loosen dead surface cells.

Examples include AHAs and salicylic acid.

### Antioxidant ingredients

Ingredients commonly used in formulations for antioxidant-related skincare purposes.

Examples may include vitamin C derivatives and certain botanical/other antioxidant compounds.

### Cleansing agents

Ingredients that help remove oils, dirt, or other materials.

### Preservatives

Ingredients that help protect a product from microbial growth and maintain product stability.

### Fragrance components

Ingredients used to provide or modify scent.

Some people may be sensitive to fragrance ingredients. FDA lists fragrance ingredients among common cosmetic allergen categories.

---

# 28. Glycerin

Glycerin is commonly used as a humectant in skincare products.

SkinSense may explain:

> "Glycerin is commonly used to help attract and retain water, supporting skin hydration."

Do not claim:

> "Glycerin will cure dry skin."

Ingredient explanations should remain about general function.

---

# 29. Hyaluronic Acid

Hyaluronic acid is commonly used in skincare formulations for hydration.

SkinSense should explain it in terms of its common cosmetic role rather than presenting it as a guaranteed treatment.

Example:

> "Hyaluronic acid is commonly used as a hydrating ingredient."

---

# 30. Ceramides

Ceramides are lipid components associated with the skin barrier and are commonly used in moisturizers designed to support barrier function.

SkinSense may explain:

> "Ceramides are commonly used in moisturizers to support the skin barrier."

Do not infer that the presence of ceramides guarantees a particular clinical outcome.

---

# 31. Niacinamide

Niacinamide is a form of vitamin B3 used in skincare formulations.

SkinSense may explain its commonly discussed cosmetic roles, which can include:

- supporting the skin barrier,
- helping manage oiliness,
- and addressing appearance-related pigmentation concerns.

The system must distinguish general ingredient roles from guaranteed outcomes.

---

# 32. Vitamin C

Vitamin C and its derivatives are commonly used in skincare products for antioxidant and appearance-related purposes.

SkinSense should consider:

- formulation type,
- product instructions,
- user's tolerance,
- other active products,
- and available evidence.

The system should not assume that every vitamin C product behaves identically.

---

# 33. Salicylic Acid

Salicylic acid is commonly used in skincare and acne products.

AAD states that salicylic acid can help open clogged pores and exfoliate skin and is used in products for acne.

SkinSense should describe this as a **common use**, not a guaranteed result.

---

# 34. Alpha Hydroxy Acids — AHAs

AHAs are a class of acids commonly used in cosmetic products.

Examples include:

- glycolic acid,
- lactic acid.

FDA notes that AHAs are used for purposes such as improving skin texture and tone and that topical AHA use can increase sensitivity to ultraviolet radiation.

### SkinSense Rule

When discussing topical AHA products:

- explain their exfoliating role,
- follow product directions,
- mention sun-protection considerations where relevant,
- avoid encouraging excessive use,
- avoid assuming that all AHA formulations behave identically.

---

# 35. Beta Hydroxy Acids — BHAs

Salicylic acid is the BHA most commonly used in cosmetics.

FDA notes that BHA-containing products should be used according to label directions and that consumers should consider small-area testing and sun protection where applicable.

SkinSense should avoid turning this into a universal "everyone should use BHA" recommendation.

---

# 36. Retinoids / Retinol

Retinoids are vitamin-A-related compounds used in skincare and dermatology.

Different retinoid products can have substantially different regulatory status, strength, and use cases.

SkinSense should therefore:

- distinguish cosmetic retinol from prescription retinoids where necessary,
- rely on available product information,
- avoid prescription decisions,
- avoid treatment claims,
- and defer medical treatment decisions to qualified professionals.

The application must not assume that a user should add a retinoid merely because they mention aging, acne, or texture concerns.

---

# 37. Benzoyl Peroxide

Benzoyl peroxide is an established acne-related active ingredient.

It can also contribute to dryness or irritation in some contexts.

SkinSense must not prescribe a benzoyl peroxide regimen.

It may explain the general role of the ingredient and the importance of following product directions or professional guidance.

---

# 38. Azelaic Acid

Azelaic acid is used in skincare and dermatology for several acne- and pigmentation-related purposes.

AAD describes azelaic acid as an acne treatment that can help with clogged pores, inflammation, and post-acne dark spots.

SkinSense should describe this as an established use rather than guaranteeing an outcome for a particular user.

---

# 39. Ingredient Interaction Principle

SkinSense should not maintain an uncontrolled list of:

> "Ingredient A + Ingredient B = dangerous"

without an evidence basis.

Instead, interaction reasoning should consider:

```text id="l4avkm"
Ingredient
+
Product formulation
+
User context
+
Other active products
+
Usage directions
+
Known evidence
```

When evidence is unclear:

> **State the uncertainty.**

Do not invent compatibility rules.

---

# 40. Ingredient Overlap

Ingredient overlap does not automatically mean that a routine is unsafe.

SkinSense should distinguish:

### Same ingredient

The same named ingredient appears in multiple products.

### Same functional role

Different ingredients serve similar purposes.

### Excessive duplication

Multiple products may provide overlapping functionality without adding useful value.

### Potential irritation burden

Multiple active products may increase the potential for irritation depending on the specific products and user context.

The system must assess the available information rather than treating every overlap as a warning.

---

# 41. Active Ingredients

An "active" should be treated as an ingredient intended to have a particular functional effect in the product.

For SkinSense, active-ingredient reasoning should consider:

- ingredient identity,
- product purpose,
- product labeling,
- concentration when explicitly available,
- formulation,
- user context,
- other actives already used.

The system must not infer an exact concentration merely from ingredient placement in an ingredient list.

---

# 42. Product Formulation Matters

SkinSense must teach users that:

> **Ingredients are part of a formulation, not isolated substances acting independently.**

Two products containing the same featured ingredient can differ because of their complete formulations.

Therefore, product evaluation should consider the complete available ingredient information whenever possible.

---

# 43. Fragrance

Fragrance may improve sensory experience but can also be relevant to users who are sensitive to fragrance ingredients.

FDA identifies fragrances among cosmetic components that can contribute to allergic reactions or sensitivities for some individuals.

SkinSense must not claim:

> "Fragrance is always bad."

Instead:

> "Some people may be sensitive to fragrance ingredients."

For users reporting sensitivity, the system may suggest paying attention to fragrance information when evaluating products, without presenting fragrance-free labeling as a guarantee of safety.

---

# 44. "Hypoallergenic" and Marketing Claims

SkinSense should treat marketing terms cautiously.

FDA notes that there is no federal standard or definition governing the term "hypoallergenic" for cosmetics in the United States.

Therefore:

- "hypoallergenic" should not be treated as a guarantee,
- "natural" should not automatically mean safer,
- "organic" should not automatically mean safer,
- "dermatologist tested" should not automatically mean suitable for every user.

Marketing language is evidence of what a product claims, not proof that the claim applies to the individual user.

---

# 45. Natural vs Synthetic

SkinSense must avoid the assumption:

```text id="q4s7lq"
Natural = Safe
Synthetic = Harmful
```

The origin of an ingredient does not by itself determine whether a formulation will be suitable for an individual.

FDA explicitly cautions consumers not to assume that "natural" or "organic" cosmetics are automatically safer.

---

# 46. Patch Testing

Patch testing should be described carefully because the term can refer to different practices.

Professional patch testing may be used by healthcare professionals to investigate allergic contact dermatitis and is different from casually trying a small amount of a product at home.

FDA describes clinical patch testing as a medical process used to help identify allergens.

For consumer guidance, SkinSense should follow the product's own instructions and approved safety guidance rather than inventing a universal patch-testing protocol.

---

# 47. Product Introduction

When introducing a new skincare product, SkinSense should encourage a conservative approach where appropriate.

The user should avoid simultaneously changing many products when trying to understand how their skin responds, because doing so makes personal attribution difficult.

This is a product-behavior principle, not a guarantee about physiological response.

---

# 48. Product Effectiveness

SkinSense must recognize that:

> **"Is this product working?" is not always immediately answerable.**

Effectiveness may depend on:

- the concern,
- the product,
- consistency,
- formulation,
- user tolerance,
- duration of use,
- environmental conditions,
- and other factors.

The system must not promise a fixed timeline for every skincare product.

---

# 49. Progress Interpretation

SkinSense may analyze user-reported observations.

Example:

> "You reported less oiliness during the period when you used Product X consistently."

This is acceptable as an observation.

The system should not automatically conclude:

> "Product X caused the improvement."

Personal tracking can identify patterns, but the application must avoid presenting simple personal correlations as scientific proof.

---

# 50. Seasonal and Environmental Context

SkinSense may consider environmental context such as:

- temperature,
- humidity,
- sun exposure,
- sweating,
- seasonal changes,
- and user-reported environmental conditions.

The application must not assume:

```text id="m8pvrw"
Summer = oily skin
Winter = dry skin
```

for every individual.

Instead:

```text id="y9oxad"
Environmental context
+
User's reported skin behavior
+
Current routine
```

should be considered together.

---

# 51. Winter Context

Cold or dry conditions may be associated with increased dryness for some users.

AAD specifically notes that winter can make dry skin worse for some people.

SkinSense may respond to reported winter dryness by considering:

- moisturization,
- gentler cleansing,
- reduced unnecessary irritation,
- and barrier-supportive options.

It must not automatically rewrite a user's routine solely because the calendar season changed.

---

# 52. Summer / Hot Weather Context

Hot weather can change how users experience products, particularly through:

- sweating,
- increased oiliness,
- product feel,
- outdoor exposure.

SkinSense should combine environmental context with the user's reported experience.

It should not automatically conclude that every summer user needs oil-control products.

---

# 53. Humidity Context

Humidity may influence how a product feels on the skin and may influence user-reported oiliness or heaviness.

The system may consider lighter or heavier textures depending on the user's experience.

This should remain contextual rather than deterministic.

---

# 54. Sun Exposure Context

Sun exposure is particularly relevant when discussing:

- sunscreen,
- AHAs,
- pigmentation-related concerns,
- outdoor routines.

AAD recommends broad-spectrum SPF 30+ sunscreen and additional sun-protection measures.

SkinSense should never imply that sunscreen completely eliminates sun-related risk.

---

# 55. Ingredient Evidence Levels

SkinSense should internally distinguish evidence quality.

Suggested levels:

### High confidence

Supported by strong authoritative/clinical evidence and established guidance.

### Moderate confidence

Supported by credible evidence but with limitations.

### Limited / emerging

Evidence exists but is less established.

### Unknown

Reliable information is unavailable.

The UI may simplify these categories, but the reasoning system should avoid treating all ingredient claims equally.

---

# 56. Source Hierarchy

When resolving skincare facts, prefer:

```text id="a6qvpp"
1. Government / regulatory sources
2. Major dermatology organizations
3. Peer-reviewed scientific literature
4. Established medical references
5. Manufacturer information
6. General consumer content
7. Social media / influencer claims
```

Social media content should not be treated as authoritative medical evidence.

Manufacturer information may help identify product ingredients and intended use, but it should not automatically establish product effectiveness.

---

# 57. Product Label vs Marketing

SkinSense should distinguish:

### Label information

Ingredients, instructions, warnings, claims, and product information presented by the manufacturer.

### Marketing language

Promotional statements intended to influence purchasing decisions.

The system should not convert marketing claims directly into factual statements.

---

# 58. Ingredient Concentration

The exact concentration of many cosmetic ingredients is not available from a standard ingredient list.

Therefore:

> **Do not infer an exact percentage unless the manufacturer explicitly provides it or reliable product data provides it.**

Ingredient order may provide some formulation information, but it is not enough to establish exact concentration.

---

# 59. Ingredient Name Ambiguity

Ingredient names may appear in different forms.

SkinSense should normalize recognized ingredient names carefully.

If an ingredient name is:

- misspelled,
- truncated,
- ambiguous,
- or unreadable,

the system should not silently invent the intended ingredient.

Instead:

> "I couldn't identify this ingredient confidently."

or request clearer information.

---

# 60. Product Label Image Interpretation

A product photograph can provide useful information but may be:

- blurry,
- incomplete,
- incorrectly oriented,
- partially covered,
- or missing the full ingredient list.

SkinSense should distinguish:

```text id="gdewsf"
Information actually read
vs
Information inferred
vs
Information unavailable
```

The product-analysis workflow is defined separately in:

`09_PRODUCT_ANALYSIS.md`

---

# 61. Routine Compatibility

"Compatibility" should mean:

> Whether the available product information appears reasonably consistent with the user's stated routine and context.

It should not mean:

> Guaranteed safe for the individual.

Possible compatibility states:

```text id="1m7yx7"
Reasonably compatible
Consider carefully
Insufficient information
Professional evaluation recommended
```

The exact decision logic belongs in:

`09_PRODUCT_ANALYSIS.md`

and

`12_SAFETY.md`

---

# 62. Product Suitability

The phrase:

> **"Perfect product for you"**

should not be used as a default system outcome.

No product should be treated as universally ideal.

SkinSense should instead explain:

- why the product may fit,
- what information supports that conclusion,
- what remains uncertain,
- and what the user should consider.

---

# 63. Brand Comparison

When users compare brands, the system should focus on meaningful product differences.

Possible comparison dimensions:

- product purpose,
- complete ingredient list,
- notable ingredients,
- disclosed concentration,
- formulation characteristics where available,
- user context,
- usage instructions,
- relevant considerations.

Avoid:

> "Brand A is better because it is more famous."

---

# 64. Cost and Value

If price becomes part of product analysis, cost should be treated as a **user preference/constraint**, not proof of quality.

The system may help a user compare:

> "Which option meets my stated preferences and budget?"

It should not equate:

```text id="r1c6om"
Higher price = better formulation
```

or:

```text id="1m9ytv"
Lower price = poor quality
```

without evidence.

---

# 65. Product Claims

SkinSense should separate three things:

### Ingredient role

What an ingredient is commonly used for.

### Product claim

What the manufacturer says the finished product does.

### Personalized interpretation

How that information relates to the specific user.

These must not be merged into one unsupported statement.

---

# 66. Common Consumer Questions

The domain model should support questions such as:

> "What is my skin type?"

> "What does niacinamide do?"

> "What is salicylic acid used for?"

> "Why do these two brands have the same ingredient?"

> "Why is this product expensive if the ingredient is the same?"

> "Do I need this serum?"

> "How should I structure my routine?"

> "Does this product fit with what I already use?"

> "Why is my skin feeling dry?"

> "How can I tell whether my routine is helping?"

The system should answer according to the available information and safety boundaries.

---

# 67. Questions That Need More Context

Some questions cannot be answered responsibly from a single product name or ingredient.

Examples:

> "Is this product perfect for me?"

> "Will this definitely clear my acne?"

> "Why is my face burning?"

> "Can I use these five actives together?"

For these questions, SkinSense should use the relevant user context and safety rules.

If the necessary information is unavailable, it should ask for relevant information or communicate uncertainty.

---

# 68. Ingredient Education Format

For most ingredient questions, a useful explanation structure is:

```text id="bq9jly"
Ingredient
↓
What it is
↓
Common skincare role
↓
Where it appears
↓
Relevant considerations
↓
How it relates to this user, if enough context exists
```

The explanation should begin with plain language.

---

# 69. Routine Education Format

For routine questions:

```text id="2r1wla"
Step
↓
Purpose
↓
Why this user may need it
↓
When it is generally used
↓
Important considerations
```

The user should understand the purpose of the step rather than memorizing a product order.

---

# 70. Product Education Format

For product questions:

```text id="i9i1ag"
What is this?
↓
What are the notable ingredients?
↓
What are those ingredients generally used for?
↓
How does this relate to my routine?
↓
What should I consider?
↓
What remains uncertain?
```

---

# 71. Safety-Aware Domain Reasoning

Certain observations should trigger extra caution:

- significant or persistent irritation,
- swelling,
- severe burning,
- suspected allergic reaction,
- worsening unexplained symptoms,
- eye-area reactions,
- symptoms suggesting something beyond routine skincare.

The system should not diagnose the cause.

FDA notes that cosmetic allergic reactions can include itching, rashes, swelling and other symptoms, and advises seeking medical care for suspected significant reactions.

Detailed escalation behavior belongs in `12_SAFETY.md`.

---

# 72. Medical Products

Some skincare products contain ingredients that function as medicines or are regulated differently depending on jurisdiction and claims.

SkinSense must not assume that:

```text id="98wbc1"
"skincare product"
=
"ordinary cosmetic"
```

The system should use the product's available labeling and remain within its educational scope.

---

# 73. Prescription Products

Prescription products are outside normal consumer product recommendation scope.

SkinSense should not:

- prescribe them,
- change doses,
- replace a prescriber's instructions,
- or recommend prescription treatment based on an AI diagnosis.

If such products appear in user-provided information, the system should explain them cautiously and defer treatment decisions appropriately.

---

# 74. Children / Special Populations

Age and special circumstances can materially change skincare considerations.

SkinSense should not assume that advice appropriate for one adult automatically applies to:

- children,
- adolescents,
- pregnancy,
- breastfeeding,
- users taking medications,
- users with known dermatological conditions.

When such context is relevant, the system should follow `12_SAFETY.md` and avoid unsupported individualized medical advice.

---

# 75. Pregnancy and Medication Context

Certain skincare ingredients or treatment products may have special considerations depending on pregnancy, breastfeeding, or concurrent medication.

SkinSense should not create a universal safety list without evidence.

When a user raises such context:

> obtain relevant information where appropriate and apply the safety/escalation rules.

Do not confidently recommend or reject a product solely from memory or generic assumptions.

---

# 76. "Work or Not Work" Model

SkinSense should treat product effectiveness as a multi-factor observation problem.

Conceptually:

```text id="4nmz2e"
Product
+
Consistent use
+
Time
+
User's concern
+
Tolerance
+
Routine context
+
Environment
+
Personal variability
```

Therefore, progress tracking should focus on **observed patterns** rather than absolute claims.

---

# 77. Trial-and-Error Reduction

The core domain goal is not:

> eliminate every skincare experiment.

Instead:

> **reduce unnecessary trial and error by helping users understand their own context and available product information before making decisions.**

This directly addresses the validated user's problem.

---

# 78. Domain Anti-Patterns

The AI must avoid reasoning patterns such as:

### Ingredient absolutism

> "This ingredient is good, therefore the product is good."

### Brand absolutism

> "This is a famous brand, therefore the product is good."

### Natural-product absolutism

> "Natural means safer."

### Price absolutism

> "Expensive means higher quality."

### More-is-better

> "Add more products for better results."

### Skin-type absolutism

> "You have oily skin, therefore every oily-skin product is suitable."

### Seasonal absolutism

> "It is winter, therefore you must change your whole routine."

### Visual diagnosis

> "Your selfie proves you have a specific skin disease."

---

# 79. Domain Uncertainty

The system should explicitly recognize uncertainty when:

- ingredient concentration is unknown,
- the ingredient list is incomplete,
- the product image is unclear,
- the user's skin information is insufficient,
- the evidence is limited,
- the formulation is unknown,
- or the user's symptoms may require professional evaluation.

Unknown information must remain unknown.

---

# 80. Source Citation in Knowledge Responses

When SkinSense eventually uses a retrieval/knowledge layer, authoritative claims should have traceable sources where practical.

The system should prefer primary or authoritative references.

Potential source organizations include:

- American Academy of Dermatology (AAD)
- U.S. Food and Drug Administration (FDA)
- other recognized regulatory/medical sources
- peer-reviewed scientific literature

Example current reference sources:

- AAD skincare routine guidance: https://www.aad.org/public/everyday-care/skin-care-basics/care/apply-skin-care-certain-order
- AAD sunscreen guidance: https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen
- AAD skin-type and basic skincare guidance: https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men
- FDA cosmetic ingredients: https://www.fda.gov/cosmetics/cosmetic-products-ingredients/cosmetic-ingredients
- FDA cosmetic allergens: https://www.fda.gov/cosmetics/cosmetic-ingredients/allergens-cosmetics
- FDA AHA guidance: https://www.fda.gov/cosmetics/cosmetic-ingredients/alpha-hydroxy-acids

These are reference sources for the project, not an exhaustive skincare knowledge base.

---

# 81. Knowledge Update Principle

Skincare knowledge can evolve.

Therefore:

- do not hard-code every skincare claim into application logic,
- separate domain knowledge from application code,
- identify sources for important claims,
- allow knowledge to be updated independently from the frontend,
- and avoid relying on outdated social-media trends.

When a domain claim is changed, its supporting source should also be reviewed.

---

# 82. Domain Data Representation

Where structured skincare knowledge is needed, concepts should be representable in structured form.

Conceptually:

```text id="9tf4rj"
Ingredient
├── name
├── aliases
├── category
├── common_roles
├── considerations
├── evidence_level
├── source_references
└── notes
```

For product-related reasoning:

```text id="lphdyq"
Product
├── name
├── category
├── ingredient_list
├── disclosed_actives
├── claims
├── usage_instructions
└── source
```

The exact database schema belongs in:

`13_DATA_MODEL.md`

---

# 83. Knowledge vs Reasoning

This document defines **domain knowledge**.

It does not define exactly how the AI should reason over that knowledge.

For example:

This document may define:

> Salicylic acid is commonly used for acne-related skincare and exfoliation.

But:

> "How should the system decide whether this user's new salicylic-acid product fits their existing routine?"

belongs to:

`07_AI_ARCHITECTURE.md`

and

`09_PRODUCT_ANALYSIS.md`

---

# 84. Knowledge vs Safety

This document describes skincare concepts.

`12_SAFETY.md` controls what the application is actually allowed to recommend or claim.

If a domain fact and a safety restriction appear to conflict:

> **Safety rules take precedence.**

---

# 85. Domain vs User-Specific Advice

Domain knowledge describes general facts.

The user's profile supplies personal context.

The AI must not turn a general fact into a personalized recommendation without considering the user's context.

Conceptually:

```text id="4etx0b"
General Knowledge
       +
User Context
       +
Product Context
       ↓
Personalized Explanation
```

---

# 86. Core Domain Principle for SkinSense

The purpose of skincare knowledge inside SkinSense is:

> **Help the user understand skincare information well enough to make a more informed personal decision.**

It is not:

> **Make the AI sound like a dermatologist.**

---

# 87. Definition of Domain Knowledge Done

This document is sufficiently complete for the current MVP when SkinSense can reliably represent and explain:

- basic skin-profile concepts,
- major user concerns,
- routine structure,
- product categories,
- common ingredient categories,
- important common skincare ingredients,
- ingredient/formulation distinctions,
- product-selection principles,
- seasonal/environmental context,
- product-effectiveness uncertainty,
- evidence hierarchy,
- and domain-specific anti-patterns.

It does not need to contain every skincare ingredient before the product can launch.

---

# 88. Source-of-Truth Boundaries

Use this document for:

- skincare terminology,
- general skincare concepts,
- ingredient roles,
- product categories,
- domain principles,
- skincare evidence concepts.

Use other documents for:

- `02_USER_PROBLEM.md` → what the real friend actually struggles with
- `03_PRODUCT_REQUIREMENTS.md` → what the product must do
- `05_UI_UX.md` → how the information is presented
- `07_AI_ARCHITECTURE.md` → how AI reasons over this knowledge
- `08_AI_PROMPTS.md` → exact AI instructions
- `09_PRODUCT_ANALYSIS.md` → product-analysis pipeline
- `10_PERSONALIZATION.md` → user-specific adaptation
- `11_VOICE_SYSTEM.md` → voice interaction
- `12_SAFETY.md` → medical and recommendation boundaries
- `13_DATA_MODEL.md` → structured storage
- `14_SYSTEM_ARCHITECTURE.md` → technical architecture
- `16_TESTING.md` → domain/AI validation

---

# 89. Final Domain Rule

When the system encounters a skincare question:

```text id="w4l0tc"
Do not ask:
"What answer sounds convincing?"

Ask:
"What is actually known?"
       ↓
"What information do we have about this user?"
       ↓
"What information do we have about this product?"
       ↓
"What does the evidence support?"
       ↓
"What remains uncertain?"
       ↓
"What is safe and appropriate to communicate?"
```

The resulting response should be:

> **clear + evidence-aware + personalized + uncertainty-aware + non-diagnostic.**