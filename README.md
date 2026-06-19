# Erasmatch+ 🌍✨

A concept **mockup** for a Tinder-style platform that matches young people with
**Erasmus+ Youth** opportunities based on their **age** and **country**.

> Swipe. Match. Go abroad. 💙💛

## What it does

1. **Onboarding** — enter your age, country, and (optionally) pick interests.
2. **Swipe deck** — get a stack of matched Erasmus+ opportunities. Swipe
   **right to save**, **left to pass**, or tap ℹ️ for full details.
3. **Saved list** — review everything you liked and "Apply".

Matching is a simple mock: opportunities are filtered by **age eligibility**,
then ranked by **interest overlap** and a small boost for ones hosted in your
own country. There are **12 opportunities** to swipe through, spanning Youth
Exchanges, ESC Volunteering, Training Courses, Youth Participation and
DiscoverEU.

## How to view it

It's a pure static site — no build step, no dependencies.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

…or just open `index.html` directly in any modern browser.

### Controls
- **Drag** a card, or use the **✗ / ♥** buttons.
- **← / →** arrow keys also pass / save.
- **ℹ️** opens the full opportunity details.

## Design

Built around the **Erasmus+ Youth / EU colour palette**:
EU flag **blue `#003399`** and **gold `#FFCC00`**, with vibrant accent
gradients (teal, violet, coral, orange) for the cards.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App structure (onboarding · swipe · saved · modal) |
| `styles.css` | All styling + the EU colour palette |
| `data.js` | Mock opportunities, countries & interests |
| `app.js` | Matching, swipe gestures, navigation |

> ⚠️ This is a **mockup**. All opportunities are fictional and no real
> applications are submitted. Not affiliated with the European Commission or
> the official Erasmus+ programme.
