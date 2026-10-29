# Flow transitions are anchored shared-axis moves, not screen replacements

**Status**: accepted

## Context

The first-run experience is one Flow of seven numbered Steps between a Splash and an Arrival, not eight destinations. It was built as eight unrelated screens swapped by a 120ms fade-out → 220ms fade-in in `App.tsx`, with each screen carrying its own copy of the Chrome (`BrandHeader`, `StepProgress`, `BottomCTA`). The result read as a snap: a blank frame between steps, no direction, and the one part that should feel anchored dissolving along with the content.

## Decision

The Flow is a single surface. Chrome is hoisted into a persistent shell and never travels; only the Stage animates, using a direction-aware horizontal *shared axis* move: outgoing content translates and fades out to one side, incoming content enters from the other, with the two crossing rather than following each other. Forward travels left, Back travels right, and travelling Back from Step 1 reverse-slides the Splash in.

Motion is calm and interruptible: 360ms forward / 300ms back on Material's emphasized curve (`0.2, 0, 0, 1`) with no overshoot, transform and opacity only, so every frame stays on the UI thread. Targets are absolute, so a repeated tap cannot advance twice; a reversal during a flight settles the Stage back to where it came from rather than stacking a second move.

The Stage travels **30dp** — Material's own shared-axis distance. The reasoning is worth recording because it is counter-intuitive: at 30dp the travel is a whisper and the *fade* carries the change. Trying to make the slide do the work would need ~90dp, which starts to read as a carousel. The distance lives in one constant (`TRAVEL` in `src/flow/motion.ts`) precisely so that judgement can be revisited in one line.

The fade is where this deliberately departs from Material. `MaterialSharedAxis` runs its outgoing and incoming fades in **sequence**, leaving the surface near-empty around 35% of the move — the exact blink this Flow exists to remove. Here the two windows **overlap**: outgoing fades over 0→70%, incoming over 25%→100%, so the outgoing content is still at ~64% when the incoming starts and the two cross at ~31% each. It reads as a dissolve, never as a gap.

Content lands in **two beats**, not three: the reflection and question arrive with the move, and the interactive block (`StageBeat`) settles ~70ms behind it, so the eye has a path — read, then act — instead of a whole page arriving as one block.

Chrome participates only in place. The progress bar tracks a *continuous* step position, so it scrubs with the move (and with the finger, during a drag) instead of repainting segment by segment; the step title and count cross-fade with a 6dp directional nudge; the CTA label cross-fades rather than swapping.

Entry and exit are their own moment. Splash→Step 1 and Step 1→Splash do not slide the Stage at all: the shell (Chrome and Stage together) fades as one surface while the Splash slides 60dp away. This also fixes a multiplicative-fade bug — letting both the shell and the Stage fade produced an `opacity²` ramp that made the Stage lag behind its own Chrome, which is why `StageLayer` takes a `fade` prop.

Skip is a fade-lift with no lateral travel, since crossing seven Steps sideways would read as a glitch.

The back gesture is finger-tracked: the previous Step is revealed under the finger and springs back below ~35% travel or on a flick (velocity > 500). The interactive move is allowed a much longer travel than the button move — `clamp(width × 0.45, 160, 280)` dp — because a surface that follows a thumb cannot move 30dp and still feel attached to it. This is the only part of the system that cannot be approximated with core `Animated`, and it is why `react-native-gesture-handler` and `react-native-reanimated` (+ `react-native-worklets`) were added; both ship in Expo Go and run on web. Android hardware Back is routed into the Flow as Back rather than exiting the app.

Reduced motion is honoured via `useReducedMotion()`: travel drops to 0, the stagger is dropped, and every move becomes a 160ms cross-fade while the progress fill stays, because that fill is information rather than decoration.

## Considered options

- **Cross-dissolve + scale** (Calm/Headspace register): rejected because it carries no direction, so Back and Forward look identical and the Flow stops feeling traversable.
- **Vertical rise** (wizard/talk-track): rejected as it reads as a modal stack rather than progress through a sequence.
- **React Navigation native-stack**: rejected because it animates whole screens, which is precisely what anchored Chrome forbids, and its web support is its weakest surface while the visual QA loop runs through Expo web.
- **Whole-screen animation with duplicated Chrome**: rejected as the cheapest option that keeps the original flaw; the logo and CTA moving is what made the old transition feel like flicking slides.
- **Trigger-only back gesture**: rejected because a drag that does not follow the thumb feels broken next to everything else here.
- **Material's 450ms shared axis**: rejected as too slow for a seven-step flow the user may step through quickly; 360/300 keeps the same curve and overlap while feeling decisive.
- **Queueing a target that arrives mid-flight**: rejected in implementation. Draining the queue needs either a render-time ref read or a `setState` inside an effect, both of which the project's React Compiler lint rejects, and the only reachable case (tapping Skip during the ~320ms Splash lift) recovers with Back → Skip. A move is one destination; a second target during it is dropped.

## Consequences

Every screen loses its own Chrome and exports only Stage content plus a descriptor (title, CTA label, testIDs); `src/flow/Flow.tsx` owns `step`, the in-flight `Flight`, and at most two live Steps. Skipping the Chrome hoist in future work would silently reintroduce the snap, and replacing the interruptible position with a boolean "transitioning" lock would bring back the dead-input feel.

`test-e2e.js` is the guard: it traces every move frame by frame and asserts that two surfaces coexist, that peak opacity never collapses, that travel is direction-aware, that the CTA and progress bar do not drift, that the exiting layer is inert, and that rapid taps advance exactly one Step. Those assertions are the only thing standing between this and a silent regression to a snap — deleting them, or relaxing the mid-flight ones, is how the original defect returns.

Adding a Step is now a file in `src/steps/` plus an entry in `src/steps/index.ts`; a Step is declared by its Chrome metadata, never by its own header or CTA. `react-native-reanimated` and `react-native-gesture-handler` are native dependencies, so a custom `expo-dev-client` needs one rebuild after first pulling this; Expo Go already includes both.
