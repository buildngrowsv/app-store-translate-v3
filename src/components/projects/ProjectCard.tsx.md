# ProjectCard Component Documentation

## File Information
- **File**: ProjectCard.tsx
- **Description**: A card component for displaying project information and status
- **Location**: src/components/projects/ProjectCard.tsx
- **Last Updated**: 2024-03-21

## Component Overview
The ProjectCard component is responsible for displaying individual project information in a card format. It shows project details, translation status, and provides actions for managing the project.

## Dependencies
- React
- Tailwind CSS for styling
- Custom theme context for dark/light mode support
- Project service for data management
- Motion components for animations

## Features
- Displays project name and description
- Shows translation progress
- Supports multiple language indicators
- Interactive hover states
- Progress visualization
- Action buttons for project management
- Loading states and animations

## Usage Example
```tsx
<ProjectCard
  project={projectData}
  onSelect={handleProjectSelect}
  onDelete={handleProjectDelete}
/>
```

## Props
- `project`: Project data object
- `onSelect`: Callback for project selection
- `onDelete`: Callback for project deletion
- `className`: Optional additional CSS classes

## Technical Implementation
- Uses skeleton loading states
- Implements optimistic updates
- Handles error states gracefully
- Includes confirmation dialogs for destructive actions

## Styling
- Gradient borders
- Hover animations
- Progress bar animations
- Theme-aware color schemes
- Responsive layout
- Loading state animations

## Interactions
- Click to view project details
- Hover effects for interactive elements
- Confirmation dialogs for deletion
- Loading states during actions
- Error handling and feedback

## Debug History

### 2024-03-21
- Initial documentation created
- Component working as expected
- Added loading states for better UX

### Future Improvements
- Add drag and drop support
- Implement batch actions
- Add more detailed progress information
- Enhance animation transitions
- Add project statistics visualization 