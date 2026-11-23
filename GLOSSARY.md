# Momen Pro — Domain Language

The first-run experience: a person arrives at the Splash, sets their daily intentions for worship and practice, and lands on an arrival screen confirming the targets they chose. A person may move backward at any point. From there Home is where those intentions are lived, one Day at a time.

## Language

**Flow**:
The ordered, reversible sequence of Steps a person moves through after leaving the Splash. The Flow is what "progress" is progress through.
_Avoid_: Wizard, funnel, onboarding carousel

**Step**:
One numbered stage inside the Flow where a person sets an Intention Target or preference, owning one segment of the progress bar.
_Avoid_: Screen, page, slide

**Chrome**:
The persistent frame of the Flow — brand header with Back, step progress, and the primary CTA. Chrome is anchored; it does not travel with a Step's content.
_Avoid_: Layout, nav bar

**Shell**:
The outer surface of the Flow — Chrome plus the Stage — that a Step's content is rendered inside. Entry from and exit to the Splash fade the Shell as one surface, so the Stage never fades separately from its own Chrome.
_Avoid_: Container, wrapper, frame layout

**Stage**:
The region inside the Chrome where one Step's content is shown at a time.
_Avoid_: Content area, viewport, body

**Splash**:
The screen shown before the Flow begins. It is not a Step and owns no progress-bar segment.

**Arrival**:
The screen reached after the final Step, where the answers given across the Flow are confirmed. It is not a Step; the progress bar reads as complete rather than counting toward it.

**Home**:
The surface a person lands on once the Flow is finished. Home is where a Day is lived: it shows every Intention set during the Flow and whether it has been kept today.
_Avoid_: Dashboard, main screen

**Intention**:
One thing a person committed to doing each Day — Prayer, Darood, Dhikr, Qur’an, or Qadha. An Intention owns one Target and is either kept or not kept for a given Day.
_Avoid_: Goal, habit, task

**Target**:
The amount an Intention asks for in one Day: a floor for Prayer (any N of the five named prayers), a count for Darood, Qur’an and Qadha, and the chosen routines for Dhikr. An Intention without a real Target is not an Intention Home can hold, so it does not appear there.
_Avoid_: Limit, quota, aim

**Check-in**:
One recorded act against an Intention for the current Day — a named prayer marked offered, a count added, a routine ticked off. A Check-in belongs to exactly one Day.
_Avoid_: Log, entry, mark

**Day**:
The unit a Check-in belongs to. A Day begins at local midnight; there is no prayer-time rollover yet, and no Check-in is kept beyond its own Day.
_Avoid_: Today, date, session

**Tab Bar**:
The anchored navigation at the bottom of the app once the Flow is done: Home, plus the sections that are still placeholders. It is not part of the Flow's Chrome.
_Avoid_: Bottom nav, menu

**Forward / Back**:
The two directions of travel through the Flow. Direction is meaningful — it is what distinguishes resuming the Flow from retracing it.

**Transition**:
The change from one Step's content to the next inside the Stage. Not a navigation event: the person has not gone anywhere, they have advanced.
_Avoid_: Page change, screen change, navigation

**Flight**:
One move in progress: the Step leaving, the Step arriving, the direction, and the position between them. A Flight is interruptible, carries exactly one destination, and ends either by landing or being cancelled.
_Avoid_: Animation, transition state, isTransitioning

**Beat**:
One of the two staggered moments a Step's content arrives in. The second beat carries the interactive block, so the eye reads before it is invited to act.
_Avoid_: Stagger group, animation step
