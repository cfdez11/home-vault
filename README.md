# Home Vault

App para gestionar propiedades, documentos e incidencias del hogar. Funciona en iOS, Android y Web desde una única base de código usando Expo Router + NativeWind.

---

## Índice

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Theming](#theming)
- [Autenticación](#autenticación)
- [Desarrollo local](#desarrollo-local)
- [Deploy y CI/CD](#deploy-y-cicd)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React Native 0.81.5 + Expo ~54 |
| Routing | Expo Router ~6 (file-based) |
| Estilos | NativeWind 4 + Tailwind CSS 3 |
| Iconos | lucide-react-native |
| Formularios | React Hook Form + Zod |
| Animaciones | Reanimated 4 + Gesture Handler |
| Backend | Supabase (PostgreSQL + Auth) |
| Fuentes | Manrope (títulos) · Inter (cuerpo) |
| Build | EAS Build (nativo) + EAS Update (OTA) |

---

## Funcionalidades

### Tabs principales

| Tab | Pantallas | Descripción |
|---|---|---|
| **Inicio** | Dashboard | Resumen de incidencias abiertas y propiedades recientes |
| **Propiedades** | PropertiesScreen | Listado con búsqueda y filtros |
| | PropertyDetailScreen | Detalle con pestañas: info, documentos, incidencias |
| | PropertyFormScreen | Crear / editar propiedad |
| **Empresas** | CompaniesScreen | Directorio de empresas de servicios con filtros por categoría |
| | CompanyFormScreen | Crear / editar empresa |
| **Incidencias** | IncidentsScreen | Listado agrupado en Abiertas / Resueltas |
| | IncidentFormScreen | Crear / editar incidencia con empresa asignada |
| **Perfil** | ProfileScreen | Datos del usuario + selector de tema claro/oscuro/sistema |

### Autenticación

- Email y contraseña
- Google OAuth (flujo implícito via `expo-web-browser`)
- Recuperación de contraseña por email

---

## Estructura del proyecto

```
app/                        # Rutas Expo Router (file-based)
├── (tabs)/                 # Grupo de tabs (protegido con Redirect)
│   ├── _layout.tsx         # Tab navigator + auth guard
│   ├── index.tsx           # Dashboard
│   ├── properties/         # Rutas anidadas de propiedades
│   ├── companies.tsx
│   ├── incidents.tsx
│   └── profile.tsx
├── auth/                   # Flujos no autenticados
├── incidents/              # new · [id]/edit
├── companies/              # new · [id]/edit
└── _layout.tsx             # Root layout (providers, fuentes, stack)

features/                   # Una carpeta por feature
├── home/
├── auth/
├── properties/
├── companies/
├── incidents/
└── profile/

components/
├── app-header.tsx          # Cabecera con título + botón ajustes
├── custom-tab-bar.tsx      # Tab bar personalizado
├── fab-menu.tsx            # FAB expandible con acciones de creación
└── ui/                     # Primitivos del design system
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    ├── select.tsx
    ├── bottom-sheet.tsx
    ├── screen.tsx
    ├── separator.tsx
    ├── tab-bar.tsx
    └── segmented-control.tsx

lib/
├── supabase.ts                   # Cliente Supabase
├── theme-tokens.ts               # ⚠️ Fuente única de colores
├── theme-preference-context.tsx  # Preferencia de tema del usuario
└── utils.ts

hooks/
├── use-theme-colors.ts     # Colores como valores JS (iconos, sombras)
└── use-color-scheme.ts     # Esquema de color del sistema

globals.css                 # Variables CSS para web + base Tailwind
tailwind.config.js
```

Cada feature sigue la misma estructura interna:

```
features/[feature]/
├── screens/        # Pantallas completas (importadas por app/)
├── components/     # Componentes específicos de la feature
├── schemas/        # Schemas Zod
└── types.ts
```

El fichero de ruta es mínimo — solo importa y renderiza la screen:

```tsx
// app/(tabs)/incidents.tsx
import IncidentsScreen from "@/features/incidents/screens/incidents-screen";
export default IncidentsScreen;
```

---

## Theming

El sistema de temas tiene **tres capas** que deben mantenerse sincronizadas:

### 1. `lib/theme-tokens.ts` — Fuente única

Define `lightTokens` y `darkTokens` como objetos JS con valores hex. **Todos los cambios de color van aquí, nunca hardcodear colores en componentes.**

### 2. `components/ui/nativewind-theme-provider.tsx` — Variables nativas

Inyecta CSS custom properties en nativo via NativeWind `vars()`. Se sincroniza automáticamente con `theme-tokens.ts`. Habilita clases como `bg-primary`, `text-foreground`, `border-border`.

### 3. `globals.css` — Variables web

Espeja los mismos valores para la plataforma web. **Actualizar manualmente** cuando cambien los tokens.

### Preferencia de tema

El usuario elige Claro / Oscuro / Sistema en la pantalla de Perfil. La preferencia se persiste en `localStorage` (via `expo-sqlite`).

```ts
const { preference, setPreference, effectiveScheme } = useThemePreference();
// preference: 'light' | 'dark' | 'system'
// effectiveScheme: 'light' | 'dark'
```

### `useThemeColors()` — colores en JS

Para iconos y sombras donde no se puede usar className:

```tsx
const colors = useThemeColors();
<Shield size={20} color={colors.mutedForeground} />
```

### Tokens principales (nomenclatura shadcn)

| Token | Uso |
|---|---|
| `background` / `foreground` | Fondo de pantalla y texto principal |
| `card` / `cardForeground` | Superficies de tarjeta |
| `primary` / `primaryForeground` / `primarySubtle` | Azul de marca |
| `muted` / `mutedForeground` | Fondos sutiles y texto secundario |
| `destructive` · `success` · `warning` · `caution` | Estados semánticos |
| `border` / `input` / `ring` | Bordes e inputs |

---

## Autenticación

La sesión vive en `AuthProvider` (`features/auth/context/auth-context.tsx`), montado en el root layout. **Nunca añadir lógica de auth fuera de este provider.**

### Protección de rutas (patrón declarativo)

```tsx
// app/(tabs)/_layout.tsx — protege todos los tabs
const { session, loading } = useAuth();
if (loading) return null;
if (!session) return <Redirect href="/auth/login" />;
```

### Hook `useAuth()`

```ts
const { session, loading, signIn, signUp, signInWithGoogle, resetPassword, signOut } = useAuth();
// Todos los métodos devuelven Promise<{ error: string | null }> excepto signOut
```

### Google OAuth — configuración requerida en Supabase

Dashboard de Supabase → Authentication → URL Configuration → Redirect URLs:
- `exp://**` — Expo Go
- `homevault://**` — builds de producción

Dashboard → Authentication → Providers → Google → Client ID + Secret (Google Cloud Console).

---

## Desarrollo local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena los valores de tu proyecto en [supabase.com](https://supabase.com) → Project Settings → API:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Arrancar

```bash
npm start          # Expo dev server  →  pulsa i / a / w
npm run ios        # Simulador iOS
npm run android    # Emulador Android
npm run web        # Navegador
```

### 4. Lint y types

```bash
npm run lint
npx tsc --noEmit
```

### 5. Generar tipos de Supabase (opcional)

```bash
npm run gen-types
```

---

## Deploy y CI/CD

El pipeline usa **EAS** (Expo Application Services) con tres workflows de **GitHub Actions**.

### Flujo automático

```
PR → main
  └─ ci.yml ──────────────────── lint + tsc

Push → main
  └─ eas-update.yml ──────────── OTA update al canal "production"
                                  Los dispositivos con build de producción
                                  reciben la actualización en segundo plano

Tag v1.2.3
  └─ eas-build.yml ───────────── EAS Build production (iOS + Android)
```

### Trigger manual

Desde GitHub → Actions → **EAS Build** → _Run workflow_:

| Input | Opciones |
|---|---|
| Platform | `all` · `ios` · `android` |
| Profile | `preview` · `production` |

### Perfiles de build

| Perfil | Canal OTA | Distribución | Cuándo usarlo |
|---|---|---|---|
| `development` | `development` | Internal | Dev client local |
| `preview` | `preview` | Internal | QA (TestFlight interno / APK directo) |
| `production` | `production` | App Store / Play Store | Release público |

### Secrets de GitHub

Configúralos en **Settings → Secrets and variables → Actions**:

| Secret | Dónde obtenerlo |
|---|---|
| `EXPO_TOKEN` | [expo.dev](https://expo.dev) → Account Settings → Access Tokens |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_KEY` | Supabase → Project Settings → API |

### Requisito previo para OTA updates

`expo-updates` debe estar instalado en el proyecto para que los builds nativos puedan recibir actualizaciones OTA. Instálalo una vez y genera un nuevo build:

```bash
npx expo install expo-updates
eas build --platform all --profile production
```

### Comandos EAS útiles

```bash
# OTA update manual al canal production
eas update --channel production --message "fix: descripción"

# Build preview para QA
eas build --platform all --profile preview

# Build production manual
eas build --platform all --profile production

# Ver estado de builds
eas build:list
```
