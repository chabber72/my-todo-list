# My Todo List App

A modern React todo application built with TypeScript, featuring drag-and-drop task management, filtering, and local storage persistence.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-todo-list.git
cd my-todo-list
```

2. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will launch the application at `http://localhost:5173`

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Building

Create a production build:

```bash
npm run build
```

## Project Structure

```
my-todo-list/
├── src/
│   ├── components/
│   │   ├── AddTaskButton.tsx
│   │   ├── DateRibbon.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskGroup.tsx
│   │   └── TaskList.tsx
│   ├── __tests__/
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskForm.test.tsx
│   │   ├── TaskGroup.test.tsx
│   │   └── TaskList.test.tsx
│   ├── App.tsx
├── package.json
├── tsconfig.json
```

## Features

- ✅ Drag and drop task reordering
- 📅 Date-based task organization
- 🏷️ Category filtering
- 💾 Local storage persistence
- ✨ Modern React patterns
- 🧪 Comprehensive test coverage

## Technologies

- React
- TypeScript
- Vite
- Jest
- React Testing Library
- DnD Kit

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT

## Configuration

The project uses TypeScript with the following key configurations (from tsconfig.json):

- Target: ESNext
- Module: ESNext
- JSX: React-JSX
- Strict type checking enabled

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm test`: Run test suite
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## Troubleshooting

1. **Tests not running:**

   ```bash
   npm run test -- --clearCache
   ```

2. **TypeScript errors:**
   ```bash
   npm run build -- --force
   ```

## Additional Notes

- Uses local storage for data persistence
- Responsive design
- Keyboard accessible
- Screen reader friendly
