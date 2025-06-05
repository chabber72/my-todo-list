import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskForm } from "./TaskForm";
import { Task } from "../task";
import userEvent from "@testing-library/user-event";

describe("TaskForm", () => {
  const mockTask: Task = {
    id: 1,
    sortedId: 1,
    title: "Test Task",
    description: "Test Description",
    category: "Bug",
    createdAt: new Date(),
    dueDate: new Date("2025-06-05"),
    startDate: new Date("2025-06-01"),
  };

  const mockHandlers = {
    onTaskAdd: jest.fn(),
    onTaskDelete: jest.fn(),
    onTaskUpdate: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty form when no task provided", () => {
    render(<TaskForm />);

    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      "",
    );
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("renders form with task data when task provided", () => {
    render(<TaskForm task={mockTask} />);

    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      mockTask.title,
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      mockTask.description,
    );
    expect(screen.getByRole("combobox")).toHaveValue(mockTask.category);
  });

  it("calls onTaskAdd with new task when Add button clicked", async () => {
    render(<TaskForm onTaskAdd={mockHandlers.onTaskAdd} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /title/i }),
      "New Task",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "New Description",
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "Bug");

    fireEvent.click(screen.getByText("Add"));

    expect(mockHandlers.onTaskAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Task",
        description: "New Description",
        category: "Bug",
      }),
    );
  });

  it("calls onTaskUpdate when Update button clicked", async () => {
    render(
      <TaskForm task={mockTask} onTaskUpdate={mockHandlers.onTaskUpdate} />,
    );

    await userEvent.clear(screen.getByRole("textbox", { name: /title/i }));
    await userEvent.type(
      screen.getByRole("textbox", { name: /title/i }),
      "Updated Task",
    );

    fireEvent.click(screen.getByText("Update"));

    expect(mockHandlers.onTaskUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockTask,
        title: "Updated Task",
      }),
    );
  });

  it("calls onTaskDelete when Delete button clicked", () => {
    render(
      <TaskForm task={mockTask} onTaskDelete={mockHandlers.onTaskDelete} />,
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockHandlers.onTaskDelete).toHaveBeenCalledWith(mockTask);
  });

  it("calls onCancel when Cancel button clicked", () => {
    render(<TaskForm onCancel={mockHandlers.onCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockHandlers.onCancel).toHaveBeenCalled();
  });
});
