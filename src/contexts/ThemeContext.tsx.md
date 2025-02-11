# Theme Context Documentation

## File Information
- **File**: ThemeContext.tsx
- **Description**: Global theme context provider for managing application theming
- **Location**: src/contexts/ThemeContext.tsx
- **Last Updated**: 2024-03-21

## Overview
The ThemeContext provides global theme management for the application, handling dark/light mode switching, custom color schemes, and dynamic theme updates. It syncs with system preferences and persists user choices.

## Dependencies
- React Context API
- Local Storage for persistence
- CSS Custom Properties
- System theme detection
- Color utility functions

## Features
- Dark/light mode switching
- System theme detection
- Theme persistence
- Custom color schemes
- Dynamic gradient generation
- Animated theme transitions
- CSS variable management

## Context Structure
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
  gradients: ThemeGradients;
}
```

## Theme Properties
- Base colors
- Text colors
- Background colors
- Accent colors
- Gradient definitions
- Animation properties
- Shadow definitions

## Usage Example
```tsx
const { theme, toggleTheme, isDark } = useTheme();

// Apply theme classes
<div className={`app ${isDark ? 'dark' : 'light'}`}>
  {/* Content */}
</div>
```

## Implementation Details
- Uses CSS variables for dynamic updates
- Implements smooth transitions
- Handles system preference changes
- Manages local storage persistence
- Provides theme utility functions

## Debug History

### 2024-03-21
- Initial documentation created
- Theme switching working smoothly
- Added gradient support

### Known Issues
- None currently reported

### Future Improvements
- Add custom theme creation
- Implement theme presets
- Add color palette generator
- Enhance transition animations
- Add theme export/import
- Implement theme scheduling 