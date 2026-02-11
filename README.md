# Scheme Details Screen — React Native (Expo) Machine Test

A single-screen React Native (Expo) app implementing a **Mutual Fund Scheme Details** screen with accordion sections, Skia-based NAV graph, return analysis, return calculator, riskometer, sector allocation, holdings, and more.

## Tech Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **@shopify/react-native-skia** — NAV line graph & riskometer rendering
- **i18next + react-i18next** — Internationalization (all labels externalized)
- **react-native-reanimated** — Required by Skia
- **react-native-safe-area-context** — Safe area handling
- **expo-dev-client** — Development build (required for Skia native modules)

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Generate native iOS project
npx expo prebuild --platform ios

# 3. Build & run on iOS simulator
npx expo run:ios

# 4. (Android) Generate & run
npx expo prebuild --platform android
npx expo run:android
```

> **Note:** This app uses `@shopify/react-native-skia` which requires a **development build** (not Expo Go). The `expo-dev-client` is included for this purpose.

## Architecture

```
/src
  /components       # Reusable UI components
    Accordion.tsx        — Collapsible section wrapper
    AnalyticsData.tsx    — Fund analytics metrics display
    AssetAllocation.tsx  — Equity/Cash allocation bar
    BottomActionBar.tsx  — Start SIP / Invest Now buttons
    FundDetails.tsx      — Key fund info rows
    FundManagers.tsx     — Fund manager cards
    Holdings.tsx         — Top holdings list with expand
    InfoRow.tsx          — Label-value row component
    NavGraph.tsx         — Skia-based NAV line chart with gradient
    ReturnAnalysis.tsx   — SIP/Lumpsum return toggle + bar chart
    ReturnCalculator.tsx — SIP/One-time calculator with projections
    Riskometer.tsx       — Skia-based risk meter gauge
    SchemeHeader.tsx     — Scheme name, AMC logo, NAV, tags
    SectorAllocation.tsx — Donut chart + sector list
    ToggleSwitch.tsx     — Reusable toggle between two options
  /screens           # Screen-level components
    SchemeDetailsScreen.tsx
  /hooks             # Custom hooks
    useSchemeData.ts     — Extracts scheme data from JSON
  /utils             # Utility functions
    formatters.ts        — Currency, date, percentage formatters
  /constants         # Design tokens
    colors.ts            — Color palette
    typography.ts        — Text styles
  /locales           # i18n translations
    en.json              — English labels (all UI text)
    i18n.ts              — i18next configuration
  /data              # Local JSON data
    schemeData.ts        — Scheme API response (typed)
```

## Key Features

| Feature | Implementation |
|---|---|
| **Accordion Sections** | All sections collapsed by default, smooth expand/collapse via `LayoutAnimation` |
| **NAV Graph (Skia)** | Cubic bezier smooth curve, gradient fill, period filter (1M–MAX) |
| **i18n** | All labels in `/locales/en.json`, zero hardcoded strings in components |
| **Return Analysis** | Toggle between SIP & Lumpsum returns with animated bars |
| **Return Calculator** | Monthly SIP / One-time toggle, live projection at 12% assumed return |
| **Riskometer (Skia)** | Arc gauge with needle, dynamic risk level highlighting |
| **Sector Allocation** | Skia donut chart + full sector list |
| **Holdings** | Sorted by %, expandable list (top 10 → view all) |
| **Asset Allocation** | Stacked bar with legend |
| **Fund Managers** | Avatar initials, name, type, managing-since date |
| **JSON Mapping** | All fields dynamically mapped, missing values handled gracefully |

## Assumptions

- Assumed **12% annual return** for the return calculator projections (fixed rate).
- NAV data is sampled at key dates for efficient rendering (~100 data points).
- The app targets a **single screen** as per the test requirements.
- Development build is required due to Skia native module dependency.
- Multiple accordion sections can be open simultaneously.