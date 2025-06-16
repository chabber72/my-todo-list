import { render, screen } from "@testing-library/react";
import { TaskFilter } from "./TaskFilter";
import { categories } from "../model/task";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, jest } from "@jest/globals";
import { ChangeEvent } from "react";

describe("TaskFilter", () => {
  const mockOnFilterChange = jest.fn((e: ChangeEvent<HTMLSelectElement>) => {
    console.log("Event value:", e.target.value);
  });

  beforeAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test all possible filter values
  categories.forEach((category) => {
    it(`renders correctly with ${category} filter selected`, () => {
      render(
        <TaskFilter
          selectedFilter={category}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const select = screen.getByLabelText(
        "Filter by category",
      ) as HTMLSelectElement;
      expect(select.value).toBe(category);
    });
  });

  it("renders with 'All' option first", () => {
    render(
      <TaskFilter selectedFilter="All" onFilterChange={mockOnFilterChange} />,
    );

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveValue("All");
  });

  it("renders with all categories", () => {
    render(
      <TaskFilter selectedFilter="All" onFilterChange={mockOnFilterChange} />,
    );

    // Check if "All" option is present
    expect(screen.getByText("All")).toBeInTheDocument();

    // Check if all categories from task.ts are present
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("shows correct selected option", () => {
    render(
      <TaskFilter selectedFilter="Bug" onFilterChange={mockOnFilterChange} />,
    );

    const select = screen.getByLabelText(
      "Filter by category",
    ) as HTMLSelectElement;
    expect(select.value).toBe("Bug");
  });

  it("calls onFilterChange when selection changes", async () => {
    const user = userEvent.setup();
    const handleFilterChange =
      jest.fn<(e: ChangeEvent<HTMLSelectElement>) => void>();

    render(
      <TaskFilter selectedFilter="Bug" onFilterChange={handleFilterChange} />,
    );

    const select = screen.getByLabelText("Filter by category");

    await user.selectOptions(select, "Feature");

    expect(handleFilterChange).toHaveBeenCalledTimes(1);
    expect(handleFilterChange.mock.calls[0][0].target).toBe(select);
  });
});
