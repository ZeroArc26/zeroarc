// Shared motion constants for the ZeroArc homepage.
//
// Every animated component pulls its timing/easing from here instead of
// inventing one-off values, so the whole homepage reads as one consistent
// motion language rather than a collection of separately-tuned effects.

export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // premium "expo-out" feel

export const DURATION = {
  micro: 0.2, // press/tap feedback
  ui: 0.35, // dropdowns, drawers, small UI transitions
  section: 0.45, // section/card reveals — tightened from 0.6s so content
  // never reads as "still loading" while scrolling
  hero: 1, // hero cinematic sequences
} as const;

// Positive bottom margin = the reveal fires *before* the section's top
// edge actually reaches the visible viewport (predictive trigger), so by
// the time the user scrolls it into view it's already settled in place —
// no perceived blank/white gap. (A negative margin, used previously,
// does the opposite: it shrinks the trigger zone and delays the reveal
// until the user has already scrolled well into the section.)
export const VIEWPORT = {
  once: true,
  margin: "0px 0px 120px 0px",
} as const;

export const STAGGER_GAP = 0.045; // tightened from 0.08 — card groups
// should read as one coordinated reveal, not a slow sequential one

