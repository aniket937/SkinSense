### Task 5: Landing `/` (rewrite `src/app/page.tsx`)
Client page. Sections in order, all using primitives:
1. **Hero** — eyebrow "YOUR SKINCARE COMPANION", h1 display: "Skincare decisions, made easier to understand." supporting copy about understanding skin context, routine, ingredients and products before deciding. CTAs: primary "Understand My Skin" → `/onboarding`; secondary "See How It Works" → `#how`. Hero visual: composed CSS/SVG collage of 4 labeled mini-cards ("Your skin profile", "Your routine", "Your product", "Ingredient"), **no generic AI imagery** — build from `.brutal` cards + simple SVG glyphs.
2. **Real Problem** (`#problem`) — SectionHeading "The real problem" — 5 editorial cards (quote-style, display font italic) with the exact questions from the spec ("How do I know my skin type?" … "How do I know whether my skincare is really working?").
3. **How SkinSense Helps** (`#how`) — 4 capability cards: Understand Your Skin → `/onboarding`, Build Your Routine → `/routine`, Check Your Products → `/check-product`, Understand Ingredients → `/ingredients`.
4. **Open AI** section — horizontal 6-step flow: Your context → Relevant knowledge → Open-weight AI → Validation → Safety → Response. Simple connected boxes with numbers, plain-language one-liners each (e.g. Validation: "Answers are checked in a fixed format before you see them."). Not an engineering dashboard.
5. **Voice section** — big quote card: "Ye serum mere routine ke saath theek rahega?" + "Ask naturally — by text or voice." + CTA → `/ask?voice=1`.
6. **Responsible AI** — 5 principle badges/cards: No diagnosis · No fake certainty · No blind product pushing · Clear uncertainty · Safety-first guidance.
7. **Final CTA** — full-width blush band: "Start Understanding Your Skin" primary → `/onboarding`.
Footer: wordmark + "Not a medical device. Educational decision support only."
