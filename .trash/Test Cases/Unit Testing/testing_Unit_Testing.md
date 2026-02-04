
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
| UT-12 | `generatePalette` | `#10b981` | Returns object with keys 50-950 containing correct hex shades |

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
| UT-19 | `PlaceholderPage` | `<PlaceholderPage title="T" description="D" />` | Renders Title "T", Description "D", and "Status: Development Placeholder" badge. |

## 4. User Profile Hook (`hooks/useUserProfile.ts`)

| ID | Test Case | Function | Expected Result |
|----|-----------|----------|-----------------|
| UT-13 | Initial Load | `useUserProfile()` | Returns default data if LocalStorage is empty. |
| UT-14 | Save Profile | `saveProfile({firstName: "New"})` | Updates internal state and calls `localStorage.setItem`. |

## 5. Calendar Utilities (`pages/MyAccount/CalendarSettings.tsx`)

| ID | Test Case | Function | Input | Expected Result |
|----|-----------|----------|-------|-----------------|
| UT-15 | Format Time 12h | `formatTimeDisplay` | "13:30", "12h" | Returns "1:30 PM" |
| UT-16 | Format Time 24h | `formatTimeDisplay` | "13:30", "24h" | Returns "13:30" |
| UT-17 | Parse Time PM | `parseTimeString` | "02:30 PM", "12h" | Returns "14:30" |
| UT-18 | Date Display | `formatDateDisplay` | "2025-12-25", "MM/DD/YYYY" | Returns "12/25/2025" |

## 6. Module Navigation State

| ID | Test Case | Component | Action | Expected Result |
|----|-----------|-----------|--------|-----------------|
| UT-20 | `CalendarModule` Tab Switch | `<CalendarModule />` | Click "Upcoming" button | State `activeTab` becomes `'UPCOMING'`. `UpcomingEvents` component renders. |
| UT-21 | `RemindersWrapper` Toggle | `<RemindersWrapper />` | Click "Past" button | State `view` becomes `'PAST'`. `PastReminder` component renders. |
| UT-22 | `CreateModule` Tab Switch | `<CreateModule />` | Click "Tags" button | State `activeTab` becomes `'TAGS'`. `TagsWrapper` component renders. |
| UT-23 | `NotesModule` Tab Switch | `<NotesModule />` | Click "Campaign" button | State `activeTab` becomes `'CAMPAIGN'`. `CampaignNotes` component renders. |
