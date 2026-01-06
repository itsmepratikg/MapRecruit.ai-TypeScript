# Unit Test Cases
**Module:** Core Utils & Components
**Date:** 2025-05-20

## 1. Theme Utilities (`utils/themeUtils.ts`)

| ID | Test Case | Input Data | Expected Result |
|----|-----------|------------|-----------------|
| UT-01 | `hexToRgb` valid hex | `#10b981` | Returns `{r: 16, g: 185, b: 129}` |
| UT-02 | `hexToRgb` invalid hex | `ZZZZZZ` | Returns `{r: 0, g: 0, b: 0}` |
| UT-03 | `rgbToHex` valid rgb | `16, 185, 129` | Returns `#10B981` |
| UT-04 | `mixColors` 50% mix | Color1, Color2, 50 | Returns average RGB values |

## 2. Search Logic (`components/TalentSearchEngine.tsx`)

| ID | Test Case | Input Data | Expected Result |
|----|-----------|------------|-----------------|
| UT-05 | `getCategoryForFilter` | "Atlanta, GA" | Returns `'location'` |
| UT-06 | `getCategoryForFilter` | "High Match (>90%)" | Returns `'match'` |
| UT-07 | `filterProfilesEngine` Keyword | Profiles list, keywords=["Forklift"] | Returns only profiles with "Forklift" in stringified data |
| UT-08 | `filterProfilesEngine` Advanced | Profiles list, advancedParams={location: "Atlanta"} | Returns profiles matching Location: Atlanta |

## 3. Component Rendering

| ID | Test Case | Component | Expected Result |
|----|-----------|-----------|-----------------|
| UT-09 | `StatusBadge` Active | `<StatusBadge status="Active" />` | Renders with green background/text classes |
| UT-10 | `StatusBadge` Closed | `<StatusBadge status="Closed" />` | Renders with red background/text classes |
| UT-11 | `MetricCard` props | `<MetricCard title="Test" value="10" />` | Renders Title "Test" and Value "10" correctly |
