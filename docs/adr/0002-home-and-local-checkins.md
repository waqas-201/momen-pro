# Home is a tabbed surface, and Check-ins stay on the device

**Status**: accepted

## Context

The Flow ended at the Arrival with a confirmation modal whose only exit was "Start Over", so the intentions a person had just set were never seen again. There was also no shell to put a second surface in: the app was a single hand-rolled animated Flow, `expo-router` was not installed despite `AGENTS.md` asking for it, and every Target lived only in `useState`, which vanishes on reload.

Home needed to answer one question — which of today's Intentions are kept — and could not answer it at all until check-ins existed somewhere durable.

## Decision

**Home is one tab of a small tabbed surface.** `src/shell/AppShell.tsx` owns the switch: the Flow until it is finished, then a Tab Bar with Home live and Prayer, Dhikr and Qur'an as placeholders. Finishing the Flow (`Enter Momen Pro` on the completion modal) writes a `momen-pro:begun:v1` flag, so a later launch opens on Home rather than the Splash; opening straight into the product is the point of onboarding.

The Tab Bar and the surface switch are hand-rolled, matching the Flow's existing philosophy rather than adopting `expo-router` in this change. The Flow deliberately is not a set of routes (ADR 0001), and introducing a router would mean either re-hosting it as one route while two navigation models coexist, or rewriting its transitions. When there are real sections behind the other tabs, the router decision deserves its own ADR.

**Check-ins are local-first, in AsyncStorage.** Each Day is one JSON record — `prayers`, `darood`, `quran`, `qadha`, `routines` — stored under `momen-pro:checkins:v1`. Only today's record exists: loading a record whose Day is not today discards it, so Home never has to reason about history. `expo-sqlite` was the alternative and was rejected for this stage: it needs a wasm setup on web, where the visual QA loop runs, and a single Day's counters do not need queries.

The Day boundary is **local midnight**, checked on foreground and on a quiet minute tick, not sunrise or a prayer time. There is no location or prayer-times module yet, so Fajr/Maghrib rollover cannot be defined; midnight is the only boundary that is the same everywhere and needs no new dependency.

**Home derives, it does not store.** `src/checkins/intentions.ts` is a pure function of the Targets chosen in the Flow and today's Check-in record, and it decides what appears: Prayer always (a floor of N of the five named prayers), Darood/Qur'an/Qadha only with a real count, Dhikr as a checklist of the routines chosen in the Flow. A Target of zero is not a missed Intention — it is one never set — so it is absent rather than shown as failed.

## Considered options

- **A dedicated Home screen that replaces the Arrival**: rejected. The Arrival is the Flow's payoff and the modal is its beat; replacing either loses the transition's landing point. The modal now leads onward instead of starting over.
- **Persisting through a backend or account**: rejected as out of scope — there is no authentication, and a Check-in is meaningful to one device only for now.
- **Rolling over at Fajr via `expo-location` + a prayer-times API**: rejected for this change. It is the right eventual boundary, but it adds a permission prompt and a network dependency to answer a question midnight already answers well enough.
- **A seven-day or streak view**: rejected. Nothing is stored beyond today, so any history would be a promise the storage cannot keep yet.

## Consequences

Check-ins are lost if the store is cleared or the app is reinstalled; that is accepted until accounts exist. Because only today is stored, adding streaks later means changing the record shape — the storage key is versioned (`v1`) for exactly that.

`HomeScreen` owns no state: check-in actions and the Day live in `CheckinsProvider`, and `buildIntentions` is the single place that decides "kept". A future Prayer or Dhikr tab must write through the same provider or Home will disagree with it.

`test-e2e.js` still drives the Flow and stops at the completion modal; it does not yet cover Home or the Tab Bar.
