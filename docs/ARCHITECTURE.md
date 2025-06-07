# Application Architecture

## Component Structure

### TaskList
- Main container component
- Manages task data and localStorage
- Handles drag and drop functionality

### TaskGroup
- Groups tasks by status
- Manages task filtering
- Handles task updates

### DateRibbon
- Displays date navigation
- Manages month/day selection
- Handles scrolling behavior

## Data Flow

1. Data stored in localStorage
2. Components read/write directly to localStorage
3. React state manages UI updates
4. CSS modules for component styling

## Key Design Decisions

1. Local storage for persistence
2. Direct component state management
3. Drag and drop using DnD Kit
4. TypeScript for type safety