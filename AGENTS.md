Veyra is an Expo / React Native mobile application. The goal is not only a beautiful app but code that reads like it was written by a senior engineer. Prioritize mobile-first patterns, performance, cross-platform compatibility, and readability.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, NativeWind, Reanimated, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.
4. For NativeWind, check the installed major version and read its matching docs before touching `tailwind.config.js`, `global.css`, or `metro.config.js`.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Project structure

All source lives in `src/`. Create a folder the first time it is needed; never dump files at the `src/` root.

```
src/
├── app/                    # Expo Router routes only. Thin screens that compose sections.
├── components/
│   ├── ui/                 # Primitives: Button, TextInput, Card, Badge, Chip, Avatar, Skeleton...
│   ├── common/             # Shared, app-aware pieces: ScreenContainer, SectionHeader, EmptyState...
│   ├── icons/              # Custom SVG icons only. Prefer lucide-react-native for everything else.
│   └── <section>/          # One folder per feature/section: home/, projects/, about/, contact/...
├── data/                   # JSON files acting as the backend (see Data layer)
├── services/               # Async functions that read from data/ today, from an API tomorrow
├── hooks/                  # Reusable hooks (data hooks, theme hooks, animation hooks)
├── constants/              # Static values: layout, durations, springs, route names
├── types/                  # Shared TypeScript types and interfaces
├── utils/                  # Pure helper functions
└── theme/
    └── color.ts            # Single source of truth for colors
```

Use the `@/` path alias (`@/components/ui/Button`). Avoid deep relative imports.

Keep product documentation concise in `docs/PRD.md`, the single source of truth. Use its public prototype link for design references; do not store screenshots, source archives, or duplicate PRDs in the repo. Update the PRD when product decisions change.

## Data layer

There is no backend. JSON files in `src/data/` stand in for API responses so a real backend can be swapped in later without touching UI code.

- One JSON file per resource: `src/data/projects.json`, `src/data/skills.json`, `src/data/experience.json`.
- Shape each file like a realistic API response (ids, camelCase keys, ISO dates, nested objects as a server would return them).
- UI never imports JSON directly. The flow is always: `data/*.json` → `services/*.service.ts` → `hooks/use*.ts` → component.
- Services are async and return typed Promises, so replacing the body with `fetch` is the only change needed later.
- Every JSON shape has a matching type in `src/types/`.

```ts
// src/services/projects.service.ts
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return projects as Project[];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return projects.find((project) => project.id === id) as Project | undefined;
}
```

```ts
// src/hooks/useProjects.ts
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects.service";

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: getProjects });
}
```

Use TanStack Query (or the project's chosen data library) in hooks so loading, error, and caching behavior already exists when a real API arrives. Components must render loading (skeleton), error, and empty states.

## Component rules

Segregation is the main key to readable code.

- **One component per file, one export per file.** No exceptions. No helper components, no second export, no inline sub-components in the same file.
- File name matches the component name in PascalCase: `ProjectCard.tsx` exports `ProjectCard`.
- Props type lives in the same file (`type ProjectCardProps`) unless shared, then in `src/types/`.
- Extract logic into hooks, constants into `constants/`, and pure helpers into `utils/`. A component file contains render logic only.
- Screens in `src/app/` are thin: fetch via hooks, compose section components, nothing else.
- Primitives (`components/ui/`) are generic, have no business logic, no data fetching, and accept `className` plus a clear `variant` / `size` API. Build reusability here first; if a pattern appears twice, it becomes a primitive.
- `components/common/` holds shared pieces that know about the app but not a specific section.
- Section components go in `components/<section>/` and may use `ui/` and `common/`, never another section's internals.
- Icons: use `lucide-react-native` by default. When an SVG asset is supplied or already available, use it even if lucide has a match. Create `src/components/icons/` when first needed, wrap it in a reusable PascalCase component such as `SearchIcon.tsx` exporting `SearchIcon`, and import that component wherever needed. Never inline raw SVG inside another component.
- Prefer composition over boolean-prop explosions. Avoid prop drilling beyond two levels.

## Typography

Use the Manrope font-family classes already configured in `tailwind.config.js` and loaded in the root layout. Choose the matching font file for each weight instead of generic Tailwind font-weight utilities; do not combine them.

| Instead of        | Use                      |
| ----------------- | ------------------------ |
| `font-extralight` | `font-manropeExtraLight` |
| `font-light`      | `font-manropeLight`      |
| `font-normal`     | `font-manropeNormal`     |
| `font-medium`     | `font-manropeMedium`     |
| `font-semibold`   | `font-manropeSemiBold`   |
| `font-bold`       | `font-manropeBold`       |
| `font-extrabold`  | `font-manropeExtraBold`  |

Use `font-manropeNormal` for regular body text. Only use configured, loaded font families; do not invent classes for unsupported weights.

## Theming and color tokens (most important rule)

All colors come from `src/theme/color.ts` (`LightPallete`, `DarkPallete`). The app uses NativeWind with a semantic token system, so one class name works in both light and dark mode with no `dark:` prefixes.

How it works:

- Every palette group (`primary`, `secondary`, `tertiary`, `error`, `success`, `warning`, `info`, `text`, `border`, `background`) and its steps (`0`–`950`, plus `muted`, `success`, `warning`, `error`, `info` on `background`) is exposed as a Tailwind color in `tailwind.config.js`.
- Each token resolves to a CSS variable. Variable values are generated from `LightPallete` and `DarkPallete` and switched by color scheme (NativeWind `vars()` at the root). The dark palette is already inverted per step, so `bg-background-50` is the base surface in both modes.
- Components only ever reference the token class. They never know which mode is active.

Always:

```tsx
<View className="bg-background-50 border border-border-200 rounded-2xl p-4">
  <Text className="text-text-900 text-lg font-manropeSemiBold">{title}</Text>
  <Text className="text-text-500 font-manropeNormal">{subtitle}</Text>
</View>

<Pressable className="bg-primary-500 active:bg-primary-600 rounded-xl px-5 py-3">
  <Text className="text-text-0 font-manropeMedium">Continue</Text>
</Pressable>

<View className="bg-background-error border border-error-300 rounded-lg p-3" />
```

Never:

```tsx
<View className="bg-[#050914]" />          // hardcoded hex
<View style={{ backgroundColor: '#fff' }} /> // hardcoded style color
<View className="bg-white dark:bg-black" />  // raw Tailwind colors / dark: prefix
<View className="bg-slate-900" />            // default Tailwind palette
```

When a color is needed outside `className` (lucide icon `color`, Reanimated styles, `StatusBar`, navigation theme, `RefreshControl`, gradients), read it from the palette through the theme hook, never a literal:

```tsx
import { useThemeColors } from "@/hooks/useThemeColors";
import { Bell } from "lucide-react-native";

export function NotificationButton() {
  const colors = useThemeColors();
  return <Bell size={20} color={colors.text[700]} />;
}
```

`useThemeColors` returns `LightPallete` or `DarkPallete` based on the active color scheme. `Color` exported from `color.ts` is the default (dark) appearance and should only be used for static fallbacks such as splash configuration.

Token guidance:

- Surfaces: `background-*` (`background-0/50` for screens, `100/200` for cards and raised layers, `background-muted` for subtle fills).
- Text: `text-*` (`text-900` primary, `text-500` secondary, `text-400` placeholder).
- Lines: `border-*`.
- Brand and accents: `primary-*`, `tertiary-*`; neutral UI: `secondary-*`.
- Status: `error-*`, `success-*`, `warning-*`, `info-*`, and their `background-<status>` tints.
- If a needed color does not exist, add it to both palettes in `color.ts` first, then use the token. Never work around the system.

## Code quality

- TypeScript strict mode. No `any`, no non-null assertions to silence errors, no `@ts-ignore`.
- No unnecessary comments. Names and structure explain the code. Comment only the non-obvious "why" (a platform bug workaround, a deliberate performance trade-off). Never write comments that restate the code, section banners, or tutorial-style notes.
- No dead code, unused imports, `console.log`, or commented-out blocks.
- Small functions, early returns, descriptive names, no magic numbers (move to `constants/`).
- Consistent naming: components `PascalCase`, hooks `useCamelCase`, services `name.service.ts`, types in `PascalCase`, constants `SCREAMING_SNAKE_CASE` or grouped `as const` objects.
- Handle every async state (loading, error, empty) and every user input edge case.
- Accessibility is required: `accessibilityRole`, `accessibilityLabel`, minimum 44pt touch targets, sufficient contrast, and respect for reduced motion.

## Expo and React Native best practices

- Lists: `FlatList` / `FlashList` with stable `keyExtractor`, memoized `renderItem`, never `ScrollView` + `map` for long data.
- Memoize deliberately (`React.memo`, `useCallback`, `useMemo`) where it prevents real re-renders, not by default everywhere.
- Images: `expo-image` with proper `contentFit`, placeholders, and caching. Never the core `Image` for remote content.
- Animations: `react-native-reanimated` worklets on the UI thread. Avoid animating via React state. Gestures via `react-native-gesture-handler`.
- Safe areas: `react-native-safe-area-context`. Keyboard: handle avoidance explicitly on forms.
- Platform differences: `Platform.select` or `.ios.tsx` / `.android.tsx` files, never scattered `Platform.OS` checks inside JSX.
- Fonts and assets: load with `expo-font` / `expo-asset` and keep the splash screen visible until ready.
- Haptics (`expo-haptics`) on meaningful interactions only.
- Secrets and config via `app.json` / `app.config.ts` and EAS env, never hardcoded.
- Keep the JS bundle lean: audit dependencies before adding, prefer Expo modules.

## Design and motion

Veyra must look and feel like a 9.5/10 product, distinctive rather than templated.

- Commit to a clear visual identity built from the cyan/blue palette in `color.ts`: deliberate typography pairing, consistent spacing scale, generous whitespace, strong hierarchy. No generic default-looking layouts.
- Every screen needs intentional composition: considered empty states, skeleton loaders, and polished transitions between screens.
- Motion is part of the design: entrance choreography (staggered), spring-based press feedback, shared element or layout transitions, smooth scroll-linked effects. Keep durations and springs in `constants/` so motion feels consistent.
- Animations must run at 60fps and honor reduced-motion settings.
- Dark and light must both be designed, not merely functional. Verify every screen in both.
- Before building a screen, decide its layout, hierarchy, and motion plan, then implement. Reuse `ui/` primitives; if a primitive is missing, build it properly there first.

## Navigation and routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Maintaining this file

AGENTS.md is the project's living knowledge base. Update it in the same change whenever you:

- add or rename a top-level folder, or change a convention
- introduce a new library, pattern, or architectural decision
- add tokens to the theme or change how theming works
- discover a pitfall future contributors should avoid

Keep entries short, accurate, and free of fluff. Remove anything that is no longer true.

## Definition of done

1. Uses only theme tokens (no hardcoded colors) and looks correct in light and dark.
2. One component and one export per file; logic split into hooks, constants, utils, and services.
3. Data comes through `data/` → `services/` → `hooks/`.
4. Loading, error, and empty states handled; accessibility basics met.
5. `npx expo lint` and `npx tsc --noEmit` pass.
6. AGENTS.md updated if anything above changed.
