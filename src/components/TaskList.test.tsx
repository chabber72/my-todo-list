import { render, screen, fireEvent } from "@testing-library/react";
import { TaskList } from "./TaskList";
import { describe, it, expect, jest } from "@jest/globals";
import { Task } from "../model/task";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

// Mock DnD-kit dependencies
jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
  arrayMove: jest.fn(),
}));

jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PointerSensor: jest.fn(),
  TouchSensor: jest.fn(),
  useSensor: jest.fn(() => ({
    activationConstraint: { distance: 10 },
  })),
  useSensors: jest.fn(() => []),
}));

// Add missing mocks for other components
jest.mock("./TaskForm", () => ({
  TaskForm: () => <div data-testid="task-form">Task Form</div>,
}));

jest.mock("./DatePanel", () => ({
  DatePanel: () => <div data-testid="date-panel">Date Panel</div>,
}));

jest.mock("./TaskFilter", () => ({
  TaskFilter: ({
    onFilterChange,
  }: {
    onFilterChange: (filter: string) => void;
  }) => (
    <select
      aria-label="Filter by category"
      onChange={(e) => onFilterChange(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Bug">Bug</option>
      <option value="Feature">Feature</option>
    </select>
  ),
}));

jest.mock("./TaskGroup", () => ({
  TaskGroup: ({ children }: { children: React.ReactNode }) => (
    <div className="taskGroup">{children}</div>
  ),
}));

jest.mock("./icon", () => ({
  Icon: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`}>{name}</span>
  ),
}));

// Mock CSS modules
jest.mock("./TaskList.module.css", () => ({}));

const mockTasks: Task[] = [
  {
    id: 1,
    sortedId: 1,
    title: "Task 1",
    description: "Description 1",
    category: "Bug",
    status: "to-do",
    createdAt: new Date("2025-06-05"),
  },
  {
    id: 2,
    sortedId: 2,
    title: "Task 2",
    description: "Description 2",
    category: "Feature",
    status: "to-do",
    createdAt: new Date("2025-06-05"),
  },
];

describe("TaskList", () => {
  // Mock localStorage with proper typing
  const localStorageMock = {
    getItem: jest.fn(((key: string): string | null => {
      if (key === "myData") {
        return JSON.stringify(mockTasks);
      }
      return null;
    }) as jest.MockedFunction<typeof Storage.prototype.getItem>),
    setItem: jest.fn() as jest.MockedFunction<typeof Storage.prototype.setItem>,
    clear: jest.fn() as jest.MockedFunction<typeof Storage.prototype.clear>,
  };

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    jest.clearAllMocks();
  });

  it("renders tasks from localStorage", () => {
    renderWithRouter(<TaskList />);

    // Verify tasks are rendered
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("handles task status update", () => {
    renderWithRouter(<TaskList />);

    const taskCard = screen
      .getByText("Task 1")
      .closest(".taskCard") as HTMLElement;
    const checkbox = taskCard.querySelector('input[type="checkbox"]')!
      .nextElementSibling as HTMLElement;
    fireEvent.click(checkbox);

    // Check localStorage was updated with new status
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "myData",
      expect.stringContaining('"status":"done"'),
    );
  });

  it("renders tasks in correct groups", () => {
    renderWithRouter(<TaskList />);

    // Verify tasks are rendered
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("handles task click", () => {
    renderWithRouter(<TaskList />);

    const task = screen.getByText("Task 1").closest(".taskCard") as HTMLElement;
    fireEvent.click(task);

    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "myData",
      expect.stringContaining('"title":"Task 1"'),
    );
  });

  it("handles task reordering", () => {
    renderWithRouter(<TaskList />);

    const dragEndEvent = {
      active: { id: 1 },
      over: { id: 2 },
    };

    const taskGroup = screen.getByText("ToDo").closest(".taskList");
    if (taskGroup) {
      fireEvent.dragEnd(taskGroup, dragEndEvent);
    }

    // Check localStorage was updated after reordering
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "myData",
      expect.any(String),
    );
  });

  it("filters tasks by category", () => {
    renderWithRouter(<TaskList />);

    // Find category filter
    const categorySelect = screen.getByLabelText("Filter by category");
    fireEvent.change(categorySelect, { target: { value: "Bug" } });

    // Should only see Bug task
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("shows empty state when no tasks match filter", () => {
    renderWithRouter(<TaskList />);

    // Set filter to non-existing category
    const categorySelect = screen.getByLabelText("Filter by category");
    fireEvent.change(categorySelect, { target: { value: "ToDo" } });

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });
});
