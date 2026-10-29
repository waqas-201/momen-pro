# Momen Pro — Onboarding Context

The first-run experience: a person arrives at the Splash, is walked through a short sequence of questions about their worship, and lands on an arrival screen confirming the intentions they set. A person may move backward at any point.

## Language

**Flow**:
The ordered, reversible sequence of Steps a person moves through after leaving the Splash. The Flow is what "progress" is progress through.
_Avoid_: Wizard, funnel, onboarding carousel

**Step**:
One numbered question inside the Flow, owning one segment of the progress bar.
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
