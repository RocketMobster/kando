# KanDo - Your day, done your way

KanDo is the no-fuss Kanban app that helps you crush your to-do list with clarity and confidence. 
Built for creators, freelancers, and everyday doers, KanDo blends visual task boards with a simple, mobile-first experience. Drag, drop, and dominate your day with a tool that's as flexible as you are. From quick wins to long-haul projects, KanDo keeps you focused, motivated, and moving forward—because you can do it.

## Features

- **Intuitive Kanban Boards**: Create and manage multiple boards with customizable columns
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices
- **Task Management**: Create, edit, and organize tasks with priorities and due dates
- **Drag and Drop**: Easily move tasks between columns
- **Dark/Light Mode**: Choose your preferred theme

## Development

### Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

3. Open the app in your preferred environment:
   - iOS simulator
   - Android emulator
   - Expo Go on your physical device
   - Web browser

### Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with responsive design

### Project Structure

- `/app`: Main application screens using file-based routing
- `/components`: Reusable UI components
  - `/kanban`: Kanban-specific components (BoardList, KanbanBoard, TaskCard, etc.)
  - `/ui`: Generic UI components (Button, Card, TextField, DatePicker, etc.)
- `/context`: Application state management
- `/hooks`: Custom React hooks
- `/constants`: App-wide constants and theme configuration

## Changelog

### Version 0.1.1 (Latest)

- **Bug Fixes**:
  - Fixed save button text visibility in task creation modal
  - Resolved task completion icons displaying as question marks
  - Improved button styling with proper contrast and readability
  - Enhanced IconSymbol component reliability
- **UI Improvements**:
  - Replaced Material Icons with reliable Unicode symbols for task completion
  - Simplified save button design for better user experience
  - Enhanced overall UI consistency and accessibility

### Version 0.1.0

- Initial app structure and setup
- Implemented BoardContext for state management
- Created core Kanban components:
  - BoardList with add/edit/delete functionality
  - KanbanBoard with column management
  - TaskCard with priority indicators and completion status
  - TaskForm for creating and editing tasks
- Added responsive design with useResponsiveLayout hook
- Implemented UI component library:
  - Button component with multiple variants
  - Card component for consistent styling
  - TextField component for input fields
  - DatePicker component for due date selection
  - IconSymbol component for consistent icon usage
- Enhanced Colors system with light/dark mode support
- Added drag-and-drop functionality for tasks
- Implemented data persistence with AsyncStorage

## License

MIT
