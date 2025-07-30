# Changelog

All notable changes to the KanDo app will be documented in this file.

## [0.1.0] - 2023-11-30

### Added
- Initial app setup with Expo and React Native
- Core Kanban board functionality
  - Board creation and management
  - Column creation and customization
  - Task creation with title, description, due date, and priority
  - Drag and drop functionality for tasks between columns
- Responsive design that adapts to different screen sizes
  - Horizontal layout for tablets and desktops
  - Vertical layout for mobile devices
- UI component library
  - Custom Button component with various styles
  - Card component for tasks with dynamic styling
  - TextField component for input
  - DatePicker component for selecting due dates
- Enhanced color system with light and dark mode support
- Task management features
  - Task completion tracking
  - Due date visualization with color coding
  - Priority levels (Low, Normal, High)
  - Intelligent date handling (Today, Tomorrow display)
- Data persistence using AsyncStorage
- About screen with app information and version details

### Changed
- Updated app name to "KanDo" from initial project name
- Improved task card UI with dynamic colors based on due date status
- Enhanced board navigation with sidebar for larger screens

### Fixed
- Task card layout issues on smaller screens
- Date formatting and timezone handling
- Various UI consistency improvements across the app