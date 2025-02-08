# Theme System Documentation

## Overview

The theme system in ReachMix provides a seamless dark mode experience with elegant transitions and animations. It uses Tailwind CSS's dark mode feature along with a custom ThemeProvider for state management.

## Features

- Automatic theme detection based on system preferences
- Manual theme toggle with persistent storage
- Smooth transitions between themes
- Elegant gradient effects and animations
- Consistent styling across all components

## Implementation Details

### Theme Provider

The `ThemeProvider` (`src/contexts/ThemeContext.tsx`) manages the theme state and provides:
- Theme detection from system preferences
- Theme persistence in localStorage
- Theme toggle functionality
- Automatic Tailwind dark mode class management

### Core Components

All core components have been updated to support dark mode:

1. **Button Component**
   - Multiple variants with dark mode styles
   - Gradient backgrounds and hover effects
   - Elegant shadows and transitions

2. **Card Component**
   - Dark mode background colors
   - Gradient variants
   - Shadow effects that adapt to theme

3. **Input Component**
   - Dark mode form styles
   - Focus states with gradient accents
   - Error states that adapt to theme

4. **AuthLayout Component**
   - Dark mode gradients
   - Animated background effects
   - Elegant card containers

5. **Header & Navigation**
   - Theme-aware gradients
   - Adaptive text colors
   - Hover effects that match the theme

## Usage

### Theme Toggle

The theme toggle button is included in the header and provides:
- Animated icon transition
- Smooth color changes
- Hover effects with gradients

### Dark Mode Classes

Use Tailwind's dark mode modifier to style components:

```jsx
className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
```

### Gradients

The system uses beautiful gradients that adapt to the theme:

```jsx
className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800"
```

### Animations

Smooth transitions between themes:

```jsx
className="transition-colors duration-300"
```

## Best Practices

1. Always provide dark mode alternatives for:
   - Background colors
   - Text colors
   - Border colors
   - Shadow effects

2. Use gradients instead of solid colors
3. Include smooth transitions
4. Test both themes thoroughly
5. Consider contrast ratios in both modes

## Future Improvements

1. Add more theme variants (e.g., high contrast, system theme)
2. Implement theme-specific animations
3. Add more customization options
4. Enhance accessibility features 