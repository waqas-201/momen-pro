# Spec: Flow Expansion, Username Personalization & Comprehensive Daily Intentions

## Problem Statement

The onboarding flow transitions to a goal-setting screen ("Your Daily Intentions") that failed to reflect the spiritual habits collected in preceding steps. Specifically:
- Darood o Salam (Step 2) was completely absent from daily goal setting.
- Missed prayers (Step 6) was missing an actionable daily make-up pace.
- Dhikr (Step 4) only presented a blunt generic 100/day stepper, ignoring the specific adhkar routines selected by the user.
- The flow lacked a personal identity step to capture the believer's name, preventing personalized spiritual encouragement and clear intention ownership before reaching arrival.

## Solution

1. Introduce a dedicated "Your Name" Step immediately prior to goal setting (Step 7 of 8).
2. Overhaul the "Daily Intentions" Step (Step 8 of 8) to comprehensively reflect all preceding worship commitments:
   - Dynamic personalized header addressing the user by name.
   - Core 4 daily habit cards: Fard Prayers, Darood o Salam, Dhikr & Azkar (displaying active routine badges from Step 4), and Qur’an recitation.
   - Conditional 5th habit card for Qadha makeup when missed prayers are recorded in Step 6.
3. Update the Arrival summary card (Step 9) to celebrate the believer's name and present their full set of daily commitments.
4. Maintain anchored Chrome, shared-axis transitions, and 8-segment progress scrubbing without regressions.

## User Stories

1. As a believer entering Momen Pro, I want to be asked for my preferred name before setting my intentions, so that my worship goals feel deeply personal.
2. As a believer, I want my name clearly displayed when setting daily intentions, so that I feel addressed with warmth and dignity.
3. As a believer who sends Darood o Salam, I want to set a daily Darood intention in my daily goals, so that I can nurture my daily connection to the Prophet ﷺ.
4. As a believer who selected specific adhkar routines (such as morning and evening azkar), I want those routines shown alongside my dhikr intention count, so that my goal reflects the routines I committed to rather than a vague number.
5. As a believer with missed prayers to make up, I want a daily Qadha makeup goal presented alongside my daily intentions, so that I have a clear, sustainable daily pace.
6. As a believer completing onboarding, I want the arrival summary to confirm all my set intentions—including prayers, darood, dhikr, Qur’an, and qadha—under my name.
7. As a mobile user navigating the flow, I want the step progress bar to accurately track 8 distinct steps, scrubbing continuously across transitions.
8. As a user tapping back or using the edge drag gesture, I want to navigate backward seamlessly from arrival through daily intentions, name, and previous questions.

## Implementation Decisions

- **Domain Alignment**: Respect the Momen Pro glossary (Flow, Step, Chrome, Stage, Beat, Flight).
- **Onboarding State Hoisting**: Extend `OnboardingState` with `userName`, `targetDarood`, and `targetQadha`, with default values (`''`, `33`, and `1`).
- **Stage Ordering**: Update `STAGES` and `META` with `TOTAL_STEPS = 8` and `ARRIVAL = 9`. Step 7 is `UsernameStep`, Step 8 is `DailyIntentionsStep`, and Step 9 is `ArrivalStep`.
- **Chrome Anchoring**: Pass `totalSteps={TOTAL_STEPS}` to `StepProgress` to ensure 8 discrete segments.
- **Dynamic Intention Cards**: In `DailyIntentionsStep`, dynamically render routine chips for non-empty adhkar selections and conditionally mount the Qadha card only when `missedPrayers > 0`.
- **Arrival Confirmation**: Extend `ArrivalStep` to include Darood and Qadha rows in the intention summary card.

## Testing Decisions

- Testing behavior against external surfaces:
  - Frame-by-frame shared-axis movement and coexistence of two stage layers.
  - Directional travel forward (left) and reverse (right).
  - Anchored Chrome stability (zero CTA and progress bar drift).
  - Rapid tap protection (one advance per gesture).
  - E2E coverage updated in `test-e2e.js` across all 9 destinations (Splash + 8 steps + Arrival).

## Out of Scope

- Adding calligraphic ﷺ symbol changes to Screen 2 (`DaroodStep`), as explicitly declined in the grilling interview.
- Cloud account sync or authentication (onboarding state is local context).

## Further Notes

- Verified with TypeScript 6.0 (`npx tsc --noEmit`) and Expo ESLint with 0 warnings/errors.
