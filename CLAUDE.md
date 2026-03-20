# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

App to manage properties, documents and house incidencies

## Commands

```bash
npm start          # Start Expo dev server (then press i/a/w for iOS/Android/web)
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
npm run lint       # Run ESLint
npm run reset-project  # Reset to blank Expo template
```

No test runner is configured.

## Folder Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── home/
│   ├── profile/
│   └── [one folder per Stitch screen/feature]
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── navigation/
```

## Architecture

This is an **Expo Router** app (file-based routing) targeting iOS, Android, and Web from a single codebase.

**Routing**: `app/` directory uses Expo Router's file-based routing. `app/(tabs)/` is a tab group with bottom navigation. `app/_layout.tsx` is the root layout providing the React Navigation theme.

**Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native) is the primary styling approach. Tailwind classes work on native via the Metro + Babel transform configured in `metro.config.js` and `babel.config.js`. Global CSS is in `globals.css`.

**Theming**: Light/dark mode is handled via `hooks/use-theme-color.ts` and `constants/theme.ts`. Components accept `lightColor`/`darkColor` props to override theme defaults. The web color scheme hook (`hooks/use-color-scheme.web.ts`) has hydration guard to avoid SSR mismatches.

**Platform-specific files**: Use `.ios.tsx` / `.web.ts` suffixes for platform variants (e.g., `components/ui/icon-symbol.ios.tsx`, `hooks/use-color-scheme.web.ts`). Expo Router resolves these automatically.

**Icons**: `components/ui/icon-symbol.tsx` maps SF Symbol names to MaterialIcons for Android/web. The iOS variant (`icon-symbol.ios.tsx`) uses native SF Symbols directly via `expo-symbols`.

**Animations**: `react-native-reanimated` is used throughout (parallax scroll header, collapsible rotation, hello wave).

**Path alias**: `@/` maps to the project root — use it for all imports (e.g., `import { Colors } from '@/constants/theme'`).

**Experiments enabled** (in `app.json`): Typed routes and React Compiler are active.
