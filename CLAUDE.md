# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Home Vault** — app to manage properties, documents and house incidences. Targets iOS, Android and Web from a single codebase using Expo Router + NativeWind.

## Commands

```bash
npm start          # Start Expo dev server (press i/a/w for iOS/Android/web)
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
npm run lint       # Run ESLint
```

No test runner is configured.

---

## Folder Structure

```
app/                        # Expo Router file-based routes
├── (tabs)/                 # Bottom tab group
│   ├── _layout.tsx         # Tab navigator (uses CustomTabBar)
│   ├── index.tsx           # Home tab (renders HomeScreen)
│   ├── propiedades.tsx
│   ├── empresas.tsx
│   └── perfil.tsx
├── auth/login.tsx
├── incidencias/
├── propiedades/
├── _layout.tsx             # Root layout (fonts, NativewindThemeProvider, Stack)
└── modal.tsx

src/
└── features/               # One folder per feature
    ├── home/
    │   ├── screens/        # Full screen components (rendered by app/ routes)
    │   └── components/     # Feature-specific components
    ├── auth/
    ├── companies/
    ├── incidents/
    └── properties/

components/                 # Complex shared app components
├── app-header.tsx          # Page header with title + notification bell
└── custom-tab-bar.tsx      # Custom bottom tab bar

components/ui/              # Base/primitive design system components
├── badge.tsx
├── button.tsx
├── card.tsx
├── screen.tsx              # Screen + ScreenSection layout components
├── section-title.tsx
├── nativewind-theme-provider.tsx
├── collapsible.tsx
├── icon-symbol.tsx         # Cross-platform icon (SF Symbols on iOS, MaterialIcons elsewhere)
└── icon-symbol.ios.tsx

lib/
└── theme-tokens.ts         # ⚠️ SINGLE SOURCE OF TRUTH for all color values

hooks/
├── use-theme-colors.ts     # JS color values for icons/shadows (imports from lib/theme-tokens.ts)
├── use-color-scheme.ts
└── use-color-scheme.web.ts # Hydration-safe web variant

globals.css                 # CSS variables for web + Tailwind base/components/utilities
tailwind.config.js          # Tailwind theme (colors, borderRadius, fontFamily)
```

---

## Theming System

This is the most important system to understand. There are **three layers** that must stay in sync:

### 1. `lib/theme-tokens.ts` — Single source of truth

Contains `lightTokens` and `darkTokens` as plain JS objects with hex values. **All color changes go here.** Never hardcode a color elsewhere.

```ts
import { lightTokens, darkTokens } from "@/lib/theme-tokens";
```

### 2. `components/ui/nativewind-theme-provider.tsx` — Native CSS variables

Wraps the app and injects CSS custom properties (`--primary`, `--card`, etc.) via NativeWind's `vars()`. Reads from `lib/theme-tokens.ts` automatically — no manual sync needed. Mounted in `app/_layout.tsx`.

This enables NativeWind classes like `bg-primary`, `text-foreground`, `border-border` to work on native.

### 3. `globals.css` — Web CSS variables

Manually mirrors the same values from `lib/theme-tokens.ts` as CSS custom properties for the web target. **Must be updated manually** when colors change in `theme-tokens.ts`.

### 4. `hooks/use-theme-colors.ts` — JS values for non-className usage

Use this hook when you need hex values directly (icon colors, shadow colors, inline styles). It returns the correct light/dark object based on the active scheme.

```ts
const colors = useThemeColors();
// colors.primary, colors.mutedForeground, colors.card, etc.
```

### Color tokens (shadcn naming convention)

| Token                                                         | Usage                                     |
| ------------------------------------------------------------- | ----------------------------------------- |
| `background` / `foreground`                                   | Screen background and primary text        |
| `card` / `cardForeground`                                     | Card surfaces                             |
| `primary` / `primaryForeground` / `primarySubtle`             | Brand blue, text on primary, light tint   |
| `secondary` / `secondaryForeground`                           | Secondary actions                         |
| `muted` / `mutedForeground`                                   | Subtle backgrounds and de-emphasized text |
| `accent` / `accentForeground` / `accentSubtle`                | Sky blue highlight                        |
| `destructive` / `destructiveForeground` / `destructiveSubtle` | Errors and danger                         |
| `success` / `successForeground` / `successSubtle`             | Positive states                           |
| `warning` / `warningForeground` / `warningSubtle`             | Warnings                                  |
| `border` / `input` / `ring`                                   | Borders and inputs                        |

### Radius tokens

Defined in `globals.css` and `nativewind-theme-provider.tsx`:

| Token                        | Value | Usage                       |
| ---------------------------- | ----- | --------------------------- |
| `rounded-lg` → `--radius`    | 24px  | Cards, modals               |
| `rounded-md` → `--radius-md` | 16px  | Inner card elements, images |
| `rounded-sm` → `--radius-sm` | 12px  | Buttons, inputs, badges     |

---

## Component Library

### `components/ui/` — Base primitives

These components have no app-specific logic. They form the design system.

#### `Button`

```tsx
<Button variant="default|destructive|outline|secondary|ghost|link" size="sm|default|lg|icon">
  Label
</Button>

// unstyled: skips all variant/size classes — use className to build from scratch
<Button unstyled onPress={fn} className="...">...</Button>
```

**Never use `TouchableOpacity` directly** — always use `Button` (with `unstyled` if needed for custom layouts).

#### `Card`

```tsx
<Card className="bg-card mx-5">        // plain View
<Card onPress={fn} className="bg-card mx-5">  // pressable (wraps in Button unstyled)
```

`Card` provides `rounded-lg` only. **The caller must always pass the background color** (`bg-card`, `bg-destructive-subtle`, etc.) in `className`. This avoids class conflicts with NativeWind.

Sub-components: `CardHeader` (px-4 pt-4 pb-2), `CardContent` (px-4 py-3), `CardFooter` (px-4 pt-2 pb-4).

#### `Badge`

```tsx
<Badge
  variant="default|secondary|destructive|destructive-subtle|success|success-subtle|accent|accent-subtle|muted|card|outline"
  size="sm|default"
  icon={LucideIcon}
  uppercase
>
  Label
</Badge>
```

Icon color is resolved automatically from the variant via `useThemeColors()`.

#### `Screen` and `ScreenSection`

```tsx
<Screen header={<AppHeader />} fab={<FabMenu />}>
  <ScreenSection
    title="Título"
    action={<Button variant="link">Ver todas</Button>}
    padded={false}
  >
    {/* padded=true (default): wraps children in px-5 */}
    {/* padded=false: no horizontal padding — use for full-bleed cards that have their own mx-5 */}
  </ScreenSection>
</Screen>
```

### `components/` — Complex app components

These components contain app-specific logic or composition.

- **`AppHeader`**: Page header with title + Bell icon. Uses `useThemeColors` for icon color.
- **`CustomTabBar`**: Custom bottom tab navigator. Uses platform-specific background opacity.

---

## Typography

Two font families loaded in `app/_layout.tsx`:

| Class                    | Font              |
| ------------------------ | ----------------- |
| `font-manrope`           | Manrope Regular   |
| `font-manrope-medium`    | Manrope Medium    |
| `font-manrope-semibold`  | Manrope SemiBold  |
| `font-manrope-bold`      | Manrope Bold      |
| `font-manrope-extrabold` | Manrope ExtraBold |
| `font-inter`             | Inter Regular     |
| `font-inter-medium`      | Inter Medium      |
| `font-inter-semibold`    | Inter SemiBold    |

**Convention**: Manrope for headings/titles/prominent text. Inter for body/labels/UI text.

---

## Feature Structure Pattern

Each feature in `src/features/` follows this structure:

```
src/features/[feature]/
├── screens/        # Full-page components (imported by app/ route files)
├── components/     # Feature-specific UI components
├── hooks/          # Feature-specific hooks
├── services/       # API calls / data access
└── types.ts        # Feature types
```

The `app/` route file should be minimal — it just imports and renders the screen:

```tsx
// app/(tabs)/index.tsx
import HomeScreen from "@/src/features/home/screens/home-screen";
export default HomeScreen;
```

The screen composes the layout using `Screen`, `AppHeader`, and feature components:

```tsx
// src/features/home/screens/home-screen.tsx
export default function HomeScreen() {
  return (
    <Screen header={<AppHeader title="..." />} fab={<FabMenu />}>
      <SectionA />
      <SectionB />
    </Screen>
  );
}
```

---

## Styling Rules

1. **Always use NativeWind `className`** for colors, spacing, typography. Avoid `StyleSheet.create` or inline `style` objects for anything expressible as a Tailwind class.

2. **Use `style` prop only** for values that cannot be expressed as Tailwind classes: shadows, dynamic values (e.g. `insets.bottom`), and platform-specific opacity hacks.

3. **Shadow colors must always be `'#000'`** (not a theme color). On iOS, using a light/colored shadow color in dark mode produces a "glowing" effect.

   ```tsx
   style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}
   ```

4. **Never hardcode hex colors** in components or demo data. Use `useThemeColors()` for JS values, CSS variable classes (`text-primary`, `bg-card`) for NativeWind, or `lightTokens`/`darkTokens` from `lib/theme-tokens.ts` for static references.

5. **No conflicting `bg-*` classes**: If `Card` or another component already sets a background, don't add a second `bg-*` in the same className string — NativeWind may not resolve the conflict correctly on native. Instead, set the background only once (in the outermost className).

---

## Routing

- `app/(tabs)/` — bottom tab group, always visible
- `app/auth/` — unauthenticated flows
- `app/incidencias/` — incidence detail/edit routes
- `app/propiedades/` — property detail routes
- Navigate programmatically with `useRouter` from `expo-router`:
  ```ts
  const router = useRouter();
  router.push("/(tabs)/propiedades");
  router.push("/incidencias/new");
  ```

---

## Authentication

### Architecture

Auth state lives in `AuthProvider` (`src/features/auth/context/auth-context.tsx`), mounted at the root in `app/_layout.tsx`. Never add auth logic outside this provider.

```
lib/supabase.ts              → Supabase client (implicit OAuth flow, localStorage storage)
src/features/auth/
  context/auth-context.tsx   → Session state + all auth methods
  schemas/auth-schemas.ts    → Zod schemas (loginSchema, registerSchema, forgotPasswordSchema)
  components/auth-screen.tsx → Base layout (SafeAreaView + KAV + ScrollView) for all auth screens
  components/auth-ui.tsx     → Shared UI (AuthLogo, AuthDivider, GoogleIcon, AuthTrustBadges)
  screens/                   → login-screen, register-screen, forgot-password-screen
app/auth/                    → Route wrappers (login, register, forgot-password, callback)
```

### Session protection (declarative pattern)

Each route group protects itself with a declarative `<Redirect>`. **Never use `useEffect` + `router.replace` for auth redirects.**

```tsx
// app/(tabs)/_layout.tsx — protects all tabs
const { session, loading } = useAuth();
if (loading) return null;
if (!session) return <Redirect href="/auth/login" />;

// app/auth/login.tsx — prevents authenticated users from seeing login
const { session, loading } = useAuth();
if (loading) return null;
if (session) return <Redirect href="/(tabs)" />;
```

### useAuth() hook

```ts
const { session, loading, signIn, signUp, signInWithGoogle, resetPassword, signOut } = useAuth();
```

All methods return `Promise<{ error: string | null }>` except `signOut`. Always check `error` and use `setError('root', { message: error })` with React Hook Form.

### Forms pattern

All auth forms use React Hook Form + Zod:

```tsx
const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});

async function onSubmit(data) {
  const { error } = await signIn(data.email, data.password);
  if (error) setError("root", { message: error });
  // On success: declarative Redirect in the layout handles navigation
}
```

- Use `isSubmitting` for the button `loading` prop — never manage a manual loading state
- Use `errors.root?.message` for server-side errors
- Use `Controller` (not `register`) — React Native requires `onChangeText`, not `onChange`

### Google OAuth flow

Uses `expo-web-browser` + Supabase implicit flow. The browser is opened inside the app, intercepts the redirect, and tokens are parsed from the URL fragment.

```
signInWithGoogle()
  → supabase.signInWithOAuth (skipBrowserRedirect: true)
  → WebBrowser.openAuthSessionAsync(oauthUrl, redirectTo)
  → browser closes when redirectTo URL is detected
  → parse #access_token + #refresh_token from result.url
  → supabase.auth.setSession(tokens)
  → onAuthStateChange fires → session updated → tabs redirect
```

**Supabase Dashboard setup required:**
- Authentication → URL Configuration → Redirect URLs: add `exp://**` (Expo Go) and `homevault://**` (production)
- Authentication → Providers → Google: configure Client ID + Secret from Google Cloud Console

**Why implicit flow (not PKCE):** `expo-sqlite/localStorage` does not reliably persist the PKCE code verifier between OAuth initiation and callback. `flowType: 'implicit'` is set in `lib/supabase.ts` to work around this.

### AuthScreen layout component

All auth screens use `AuthScreen` from `src/features/auth/components/auth-screen.tsx` instead of managing layout manually. It handles `SafeAreaView` + `KeyboardAvoidingView` + `ScrollView` with the correct `keyboardVerticalOffset` using `useSafeAreaInsets()`.

```tsx
// Screens with few fields — content centered vertically
<AuthScreen>...</AuthScreen>

// Screens with many fields (register) — free scroll, no centering
<AuthScreen centered={false}>...</AuthScreen>
```

**Never** add `SafeAreaView`, `KeyboardAvoidingView`, or `ScrollView` manually in auth screens — use `AuthScreen` instead.

### OAuth callback route

`app/auth/callback.tsx` exists solely as an Expo Router target for the OAuth deep link. With `WebBrowser.openAuthSessionAsync`, the session is set before this screen renders, so it immediately redirects to tabs via its own `<Redirect>`.

---

## Path Alias

`@/` maps to the project root. Always use it for imports:

```ts
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Button } from "@/components/ui/button";
import { lightTokens } from "@/lib/theme-tokens";
```

---

## Platform-specific Files

Use `.ios.tsx` / `.web.ts` suffixes for platform variants. Expo Router resolves automatically:

- `components/ui/icon-symbol.ios.tsx` — uses native SF Symbols
- `hooks/use-color-scheme.web.ts` — hydration-safe web variant

---

## Icons

**Always use `lucide-react-native`** for all icons across the entire app. Never use emoji, custom SVG components, raw `Text` characters, or any other icon library.

```tsx
import { Shield, Lock, Globe, HouseHeart } from "lucide-react-native";

// Always use useThemeColors() for icon color
const colors = useThemeColors();
<Shield size={20} color={colors.mutedForeground} />
```

- Icon size and color must always be passed explicitly — never rely on defaults
- Use `colors.*` from `useThemeColors()` for icon colors — never hardcode hex values
- **Exception**: `GoogleIcon` in `auth-ui.tsx` uses `react-native-svg` with Google brand colors — this is intentional and the only allowed SVG icon in the codebase

---

## What NOT to do

- Do not use `Colors` from `@/constants/theme` — use `useThemeColors()` instead
- Do not use `TouchableOpacity` directly — use `<Button unstyled>` instead
- Do not add `bg-card` inside the `Card` component itself — the caller passes the background
- Do not use `useColorScheme` + conditional color logic — use `useThemeColors()` which handles this
- Do not add colors to `tailwind.config.js` — add them to `lib/theme-tokens.ts` first, then the config references `var(--token-name)`
- Do not use emoji or non-Lucide icons — always use `lucide-react-native`
