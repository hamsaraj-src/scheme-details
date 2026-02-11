# Scheme Details Screen — React Native (Expo) Machine Test

A single-screen React Native (Expo) app implementing a **Mutual Fund Scheme Details** screen with accordion sections, Skia-based NAV graph, return analysis, return calculator, riskometer, sector allocation, holdings, and more.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React Native 0.81** + **Expo SDK 54** | Cross-platform mobile framework |
| **TypeScript 5.9** (strict mode) | Type safety across the codebase |
| **@shopify/react-native-skia** | NAV line graph, donut chart, gradient rendering |
| **react-native-reanimated 4.1** | Smooth animations (bar charts, accordion expand/collapse) |
| **react-native-gesture-handler** | Touch gestures for NAV graph tooltip |
| **i18next + react-i18next** | Internationalization (English + Chinese, all UI labels externalized) |
| **expo-linear-gradient** | Gradient backgrounds (scheme header) |
| **@react-native-community/slider** | Amount slider in return calculator |
| **react-native-safe-area-context** | Safe area handling |
| **expo-dev-client** | Development build (required for Skia native modules) |

---

## Setup & Run

### Prerequisites

- **Node.js** >= 18
- **Xcode** (for iOS) or **Android Studio** (for Android)
- **CocoaPods** (iOS only): `sudo gem install cocoapods`

### Steps

```bash
# 1. Clone and install dependencies
git clone <repo-url>
cd scheme-details
npm install

# 2. Generate native iOS project and run
npx expo prebuild --platform ios
npx expo run:ios

# 3. (Android) Generate native project and run
npx expo prebuild --platform android
npx expo run:android
```

### TypeScript Verification

```bash
npx tsc --noEmit
```

> **Note:** This app uses `@shopify/react-native-skia` which requires a **development build** (not Expo Go). The `expo-dev-client` is included for this purpose.

---

## Architecture

The project follows a **feature-based architecture** with a clear 3-layer separation of concerns:

```
Context (state)  →  Hook (derivation)  →  Component (UI)
```

- **Contexts** own all mutable state (`useState`, animation state, setters)
- **Hooks** are pure derivation only (`useMemo`, `useCallback`) — consume state from their context, return computed values
- **Components** are purely presentational — consume hook return values, render JSX only

### Folder Structure

```
src/
├── features/
│   └── scheme-details/
│       ├── components/                  # Feature-specific UI components
│       │   ├── NavGraph.tsx                 — Skia-based NAV line chart with gradient + touch tooltip
│       │   ├── ReturnAnalysis.tsx           — SIP/Lumpsum return toggle + animated bar chart
│       │   ├── ReturnCalculator.tsx         — SIP/One-time calculator with live projections
│       │   ├── Riskometer.tsx               — Risk level color bar with badge
│       │   ├── SectorAllocation.tsx         — Animated donut chart + sector/asset list
│       │   ├── SchemeHeader.tsx             — Scheme name, AMC logo, NAV, tags, star rating
│       │   ├── Holdings.tsx                 — Top holdings table with expand/collapse
│       │   ├── FundManagers.tsx             — Fund manager cards with avatar initials
│       │   ├── FundDetails.tsx              — Key fund info detail cards
│       │   ├── AnalyticsData.tsx            — Fund analytics metrics (alpha, beta, sharpe, etc.)
│       │   ├── AssetAllocation.tsx          — Stacked bar with color legend
│       │   └── InfoRow.tsx                  — Reusable label-value row
│       │
│       ├── hooks/                       # Pure derivation hooks (no local state)
│       │   ├── useNavGraph.ts               — Data filtering, path computation, gesture handling
│       │   ├── useReturnCalculator.ts       — SIP/lump-sum return calculations
│       │   ├── useReturnAnalysis.ts         — Bar chart data parsing, y-axis computation
│       │   ├── useSectorAllocation.ts       — Donut segment computation
│       │   └── useRiskometer.ts             — Risk level index + badge color derivation
│       │
│       ├── context/                     # Per-component state contexts
│       │   ├── SchemeContext.tsx             — Global scheme data + loading state
│       │   ├── NavGraphContext.tsx           — selectedPeriod, touchX, handlePeriodSelect
│       │   ├── ReturnCalculatorContext.tsx   — activeToggle, amount, selectedDurationKey
│       │   ├── ReturnAnalysisContext.tsx     — activeTab (ptp | sip)
│       │   └── SectorAllocationContext.tsx   — activeTab (asset | sector), animation progress
│       │
│       ├── SchemeDetailsScreen.tsx       # Screen orchestrator
│       └── index.ts                     # Barrel export (public API)
│
├── shared/                              # Cross-feature reusable modules
│   ├── components/
│   │   ├── AppBar.tsx                       — Header bar with back button + action icons
│   │   ├── Accordion.tsx                    — Animated collapsible section wrapper
│   │   ├── ToggleButtonGroup.tsx            — Multi-option toggle button
│   │   ├── ChipSelector.tsx                 — Pill/chip row selector
│   │   ├── IconAvatar.tsx                   — Circular icon/initials container
│   │   ├── DetailCard.tsx                   — Icon + label + value card
│   │   ├── LanguageToggle.tsx               — Animated EN ↔ 中文 pill toggle
│   │   └── index.ts                         — Barrel export
│   ├── constants/
│   │   ├── colors.ts                        — Centralized color tokens (60+ semantic tokens)
│   │   └── typography.ts                    — Centralized text styles (20+ typography tokens)
│   └── utils/
│       └── formatters.ts                    — Currency, date, percentage, lock-in period formatters
│
├── data/
│   └── schemeData.ts                    # Typed mock API response
│
└── locales/
    ├── en.json                          # English translations (220+ keys)
    ├── zh.json                          # Chinese translations (220+ keys)
    └── i18n.ts                          # i18next config + LANGUAGES registry
```

### Provider Hierarchy

```tsx
// App.tsx
<GestureHandlerRootView>
  <SafeAreaProvider>
    <SchemeProvider>              {/* Global scheme data */}
      <SchemeDetailsScreen />
    </SchemeProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>

// Inside SchemeDetailsScreen — each provider wraps only its component (scoped re-renders)
<NavGraphProvider>
  <NavGraph />
</NavGraphProvider>

<ReturnAnalysisProvider>
  <ReturnAnalysis />
</ReturnAnalysisProvider>

<ReturnCalculatorProvider minInvestment={...}>
  <ReturnCalculator />
</ReturnCalculatorProvider>

<SectorAllocationProvider>
  <SectorAllocation />
</SectorAllocationProvider>
```

### Why This Architecture?

- **Feature isolation** — adding a new screen means adding a new folder under `features/`, no cross-contamination
- **Scoped re-renders** — per-component contexts prevent state changes in one section from re-rendering others
- **Testability** — hooks are pure derivation (easy to unit test), components are pure UI (easy to snapshot test)
- **Scalability** — shared components, constants, and utils are reusable across any future feature

---

## Key Features

| Feature | Implementation |
|---|---|
| **Accordion Sections** | Animated expand/collapse via `react-native-reanimated`, multiple sections can be open simultaneously |
| **NAV Graph (Skia)** | Cubic bezier smooth curve, gradient fill, period filter (1M–MAX), long-press touch tooltip with NAV value + date |
| **i18n** | All labels externalized in `locales/en.json` + `zh.json`, zero hardcoded strings in components, animated language toggle |
| **Return Analysis** | Toggle between Point-to-Point & SIP returns with staggered animated bars |
| **Return Calculator** | Monthly SIP / One-time toggle, slider for amount, duration chips, live projection with annualized returns |
| **Riskometer** | Color-segmented risk bar with dynamic highlighting and risk level badge |
| **Sector Allocation** | Animated Skia donut chart with asset/sector tab toggle + color-coded legend |
| **Holdings** | Sorted by %, expandable list (top 10 → view all) |
| **Asset Allocation** | Proportional stacked bar with color legend |
| **Fund Managers** | Avatar initials, name, type, managing-since date |
| **Design Tokens** | All colors (60+ tokens) and typography (20+ styles) centralized — zero hardcoded values in components |
| **JSON Mapping** | All fields dynamically mapped from typed mock data, missing values handled gracefully with fallbacks |

---

## Assumptions

- **Return calculations** use the actual scheme return rates (1M, 3M, 6M, 1Y, 3Y, 5Y) from the data, not a fixed assumed rate. The calculator picks the appropriate rate based on the selected duration.
- **NAV data** is rendered from the full `nav_json` array provided in the scheme data, filtered by selected period.
- The app targets a **single screen** as per the test requirements, but the feature-based architecture is designed to scale to multiple screens.
- **Development build** is required due to `@shopify/react-native-skia` native module dependency (Expo Go is not supported).
- Multiple accordion sections can be open simultaneously.
- All UI text is externalized via i18n — adding a new language requires only a new JSON translation file.
- Color and typography tokens are centralized — no hardcoded hex values or font sizes exist in component files.
- The mock data structure matches the expected API response shape; the `SchemeData` type is derived directly from the data.

---

## i18n — Internationalization

The app ships with **English** (`en.json`) and **Chinese** (`zh.json`), with 220+ translation keys covering every visible label, section header, button, graph title, description, and formatted value.

### Language Toggle

A ready-to-use `<LanguageToggle />` component is included. It renders an animated pill-style switcher (🇬🇧 EN ↔ 🇨🇳 中文) with smooth sliding animation.

**To enable it**, uncomment the following line in `src/features/scheme-details/SchemeDetailsScreen.tsx`:

```tsx
// Line ~52 — change this:
{/* <LanguageToggle /> */}

// To this:
<LanguageToggle />
```

The toggle appears right-aligned below the AppBar title. Tapping a language instantly switches all UI text.

### How to Add a New Language

1. **Create a translation file** — copy `src/locales/en.json` to `src/locales/<code>.json` (e.g. `hi.json` for Hindi) and translate all values:

   ```bash
   cp src/locales/en.json src/locales/hi.json
   ```

2. **Register it in `src/locales/i18n.ts`**:

   ```ts
   import hi from './hi.json';

   // Add to LANGUAGES array:
   export const LANGUAGES = [
     { code: 'en', label: 'EN', nativeLabel: 'English', flag: '🇬🇧' },
     { code: 'zh', label: '中文', nativeLabel: '中文', flag: '🇨🇳' },
     { code: 'hi', label: 'हिं', nativeLabel: 'हिन्दी', flag: '🇮🇳' },  // ← new
   ] as const;

   // Add to resources:
   resources: {
     en: { translation: en },
     zh: { translation: zh },
     hi: { translation: hi },  // ← new
   },
   ```

3. **Done** — the `<LanguageToggle />` component automatically picks up the new language from the `LANGUAGES` array. No other changes needed.

### i18n Architecture

- **Zero hardcoded strings** — all visible text uses `t('key')` or `t('key', { param })` interpolation
- **Formatter functions** (`formatters.ts`) accept a `t` function parameter so even utility-generated text (currency symbols, units, fallbacks) is localized
- **Format templates** (`format.*` keys) externalize structural patterns like `"NAV : 01 Jan 2025"` so word order can change per language
- **Scalable** — adding a language is a 2-step process (JSON file + registration), no component changes required