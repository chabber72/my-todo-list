import { fireEvent, render, screen, within } from "@testing-library/react";
import { TaskGroup } from "./TaskGroup";
import { Task } from "../model/task";
import { describe, it, expect, jest } from "@jest/globals";
import { MouseSensor, TouchSensor, SensorDescriptor } from "@dnd-kit/core";

/* Notes
    1. When testing components with drag-and-drop (DnD-kit):
      * Mock the DnD dependencies
      * Provide proper sensor descriptors in props
    
    2. When testing checkbox interactions:
      * Click the label instead of the input for proper event handling
      * Use nextElementSibling to find the label after the checkbox
      * Use proper event simulation with fireEvent
    
    3. For React Testing Library best practices:
      * Use within() to scope queries to specific elements
      * Use role-based queries where possible
      * Handle type assertions properly for TypeScript
*/

// Mock the DnD kit dependencies
jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
}));

jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

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

describe("TaskGroup", () => {
  const mockProps = {
    filteredData: mockTasks,
    groupDescription: "Test Group",
    mouseSensor: {
      sensor: MouseSensor,
      options: { activationConstraint: { distance: 10 } },
    } as SensorDescriptor<{ activationConstraint: { distance: number } }>,
    touchSensor: {
      sensor: TouchSensor,
      options: { activationConstraint: { delay: 250, tolerance: 5 } },
    } as SensorDescriptor<{
      activationConstraint: { delay: number; tolerance: number };
    }>,
    handleDragEnd: jest.fn(),
    handleTaskClick: jest.fn(),
    handleTaskUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when filtered data is empty", () => {
    render(<TaskGroup {...mockProps} filteredData={[]} />);
    expect(screen.queryByText("Test Group")).not.toBeInTheDocument();
  });

  it("renders group description when provided", () => {
    render(<TaskGroup {...mockProps} />);
    expect(screen.getByText("Test Group")).toBeInTheDocument();
  });

  it("renders all tasks in the filtered data", () => {
    render(<TaskGroup {...mockProps} />);

    mockTasks.forEach((task) => {
      // Find the task card by its title and assert it's an HTMLElement
      const taskCard = screen
        .getByText(task.title)
        .closest(".taskCard") as HTMLElement;
      expect(taskCard).toBeInTheDocument();

      // Use querySelector instead of getByClassName
      const taskInfo = taskCard.querySelector(".taskInfo") as HTMLElement;
      expect(taskInfo).toHaveTextContent(task.title);
      if (task.description)
        expect(taskInfo).toHaveTextContent(task.description);
      expect(taskInfo).toHaveTextContent(task.category!);
    });
  });

  it("handles task clicks", () => {
    render(<TaskGroup {...mockProps} />);

    const firstTaskCard = screen
      .getByText("Task 1")
      .closest(".taskCard") as HTMLElement;
    fireEvent.click(firstTaskCard);

    expect(mockProps.handleTaskClick).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("handles task updates", () => {
    render(<TaskGroup {...mockProps} />);

    // Find the first task card
    const firstTaskCard = screen
      .getByText("Task 1")
      .closest(".taskCard") as HTMLElement;

    // Find the checkbox container and then the label element
    const checkboxContainer =
      within(firstTaskCard).getByRole("checkbox").nextElementSibling;
    fireEvent.click(checkboxContainer!);

    // Verify the update was called with the correct task data
    expect(mockProps.handleTaskUpdate).toHaveBeenCalledWith({
      ...mockTasks[0],
      status: "done",
    });
  });

  it("handles drag end events", () => {
    render(<TaskGroup {...mockProps} />);

    const dragEvent = {
      active: { id: 1 },
      over: { id: 2 },
    };

    mockProps.handleDragEnd(dragEvent as any);

    expect(mockProps.handleDragEnd).toHaveBeenCalledWith(dragEvent);
  });
});
