import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "./TaskCard";
import { Task } from "../model/task";

// Mock the DnD kit hooks
jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
  }),
}));

describe("TaskCard", () => {
  const mockTask: Task = {
    id: 1,
    sortedId: 1,
    title: "Test Task",
    description: "Test Description",
    category: "Bug",
    status: "to-do",
    createdAt: new Date("2025-06-05"),
    parentId: undefined,
  };

  const mockHandlers = {
    onClick: jest.fn(),
    onUpdateTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task information correctly", () => {
    render(<TaskCard id={1} task={mockTask} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
    expect(screen.getByText(mockTask.category!)).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    render(<TaskCard id={1} task={mockTask} onClick={mockHandlers.onClick} />);

    fireEvent.click(screen.getByText(mockTask.title));

    expect(mockHandlers.onClick).toHaveBeenCalledWith(mockTask);
  });

  it("updates task status when checkbox is clicked", () => {
    render(
      <TaskCard
        id={1}
        task={mockTask}
        onUpdateTask={mockHandlers.onUpdateTask}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    const checkboxLabel = checkbox.nextElementSibling as HTMLElement;

    fireEvent.click(checkboxLabel);

    expect(mockHandlers.onUpdateTask).toHaveBeenCalledWith({
      ...mockTask,
      status: "done",
      completedDate: expect.any(Date),
    });
  });

  it("shows completed styling when task is done", () => {
    const completedTask: Task = {
      ...mockTask,
      status: "done",
    };

    render(<TaskCard id={1} task={completedTask} />);

    const taskName = screen.getByText(completedTask.title);
    expect(taskName).toHaveClass("taskNameCompleted");
  });

  it("shows parent task in navigation when parentId exists", () => {
    const taskWithParent: Task = {
      ...mockTask,
      parentId: 123,
    };

    render(<TaskCard id={1} task={taskWithParent} />);

    expect(screen.getByText("Downsize Apartment")).toBeInTheDocument();
  });

  it("renders drag handle with correct attributes", () => {
    render(<TaskCard id={1} task={mockTask} />);

    const dragHandle = screen.getByText("::");
    expect(dragHandle).toBeInTheDocument();
    expect(dragHandle.parentElement).toHaveClass("dragHandle");
  });
});
