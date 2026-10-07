export function createColorVariables(
  palette: Record<string, Record<string, string>>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette).flatMap(([group, steps]) =>
      Object.entries(steps).map(([step, hex]) => [
        `--color-${group}-${step}`,
        hex,
      ]),
    ),
  );
}
