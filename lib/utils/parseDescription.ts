export interface ParsedDescription {
  narrative: string;
  features: { label: string; value: string }[];
}

/**
 * Many product descriptions follow a "<narrative paragraph> Key
 * Features - Label: Value - Label: Value..." convention. This splits
 * that out into a clean narrative + structured feature list where the
 * pattern is present, and just returns the whole thing as narrative
 * (features empty) for descriptions that don't follow it — never
 * breaks on descriptions written differently.
 */
export function parseProductDescription(description: string): ParsedDescription {
  const marker = "Key Features";
  const markerIndex = description.indexOf(marker);

  if (markerIndex === -1) {
    return { narrative: description.trim(), features: [] };
  }

  const narrative = description.slice(0, markerIndex).trim();
  const featuresText = description.slice(markerIndex + marker.length);

  const features = featuresText
    // Split on a plain hyphen surrounded by any amount of whitespace —
    // flexible spacing/newlines (a literal " - " match was too strict
    // and missed real descriptions), but NOT en-dash/em-dash, since
    // those show up as ordinary punctuation inside values (e.g. a
    // brand tagline like "ZERO ARC – Wear Your Next Arc.") and
    // shouldn't be treated as list delimiters.
    .split(/\s*-\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const colonIndex = chunk.indexOf(":");
      if (colonIndex === -1) return { label: "", value: chunk };
      return {
        label: chunk.slice(0, colonIndex).trim(),
        value: chunk.slice(colonIndex + 1).trim(),
      };
    })
    // A trailing sentence after the last "Label: Value" (e.g. "Pair it
    // with cargos... ZERO ARC – Wear Your Next Arc.") often ends up
    // stuck onto the last real feature's value rather than forming
    // its own bullet — harmless to leave in, but anything with no
    // colon at all is closing marketing copy, not a spec, so drop it.
    .filter((f) => f.label);

  return { narrative, features };
}
