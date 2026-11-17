import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';

/**
 * A Step's permission to leave. Forward is the only move that can be refused:
 * Back, the swipe-back gesture and the hardware back button always work, so a
 * half-finished Step is never a place the user is trapped in.
 */
export interface StepGuard {
  /** False holds the Flow where it is. The Step is responsible for saying why. */
  canContinue: () => boolean;
}

interface StepGateApi {
  setGuard: (step: number, guard: StepGuard | null) => void;
  canContinue: (step: number) => boolean;
}

const StepGateContext = createContext<StepGateApi | null>(null);

/**
 * The Flow's CTA lives in Chrome, outside any Step, so a Step cannot own its own
 * submit button. This gate is the seam: a Step registers what "done" means for
 * it, and the Flow asks before it moves.
 */
export const StepGateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const guards = useRef(new Map<number, StepGuard>());

  const api = useMemo<StepGateApi>(
    () => ({
      setGuard(step, guard) {
        if (guard) guards.current.set(step, guard);
        else guards.current.delete(step);
      },
      canContinue(step) {
        const guard = guards.current.get(step);
        return guard ? guard.canContinue() : true;
      },
    }),
    []
  );

  return (
    <StepGateContext.Provider value={api}>{children}</StepGateContext.Provider>
  );
};

/** Registered by a Step for as long as it is mounted. */
export function useStepGuard(step: number, guard: StepGuard): void {
  const api = useContext(StepGateContext);

  // Deliberately no dependency list: a Step's guard closes over its live form
  // state, so the newest one is registered after every render. Writing a ref
  // during render would be cheaper and is exactly what React forbids.
  useEffect(() => {
    if (!api) return;
    api.setGuard(step, guard);
    return () => api.setGuard(step, null);
  });
}

/** The Flow's side of the gate. */
export function useStepGate(): StepGateApi {
  const api = useContext(StepGateContext);
  if (!api) throw new Error('useStepGate must be used within StepGateProvider');
  return api;
}
