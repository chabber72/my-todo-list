import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePanel } from "./DatePanel";
import { Month } from "../dates";
import "@testing-library/jest-dom";

describe("DatePanel", () => {
  const mockProps = {
    refMonth: { current: new Map() },
    refDay: { current: new Map() },
    selectedMonth: "June" as Month,
    selectedDay: 5,
    onMonthClick: jest.fn().mockReturnValue(jest.fn()),
    onDayClick: jest.fn().mockReturnValue(jest.fn()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with correct month and day selection", () => {
    render(<DatePanel {...mockProps} />);

    // Check if month is rendered and selected
    const selectedMonth = screen.getByText("June");
    expect(selectedMonth).toHaveAttribute("aria-selected", "true");

    // Check if day is rendered and selected
    const selectedDay = screen.getByText("5");
    expect(selectedDay).toHaveAttribute("aria-selected", "true");
  });

  it("calls onMonthClick when a month is clicked", () => {
    render(<DatePanel {...mockProps} />);

    const januaryButton = screen.getByText("January");
    fireEvent.click(januaryButton);

    expect(mockProps.onMonthClick).toHaveBeenCalledWith("January");
    expect(mockProps.onMonthClick).toHaveBeenCalledTimes(1);
  });

  it("calls onDayClick when a day is clicked", () => {
    render(<DatePanel {...mockProps} />);

    const dayButton = screen.getByText("15");
    fireEvent.click(dayButton);

    expect(mockProps.onDayClick).toHaveBeenCalledWith(15);
    expect(mockProps.onDayClick).toHaveBeenCalledTimes(1);
  });

  it("shows correct number of days for selected month", () => {
    render(<DatePanel {...mockProps} />);

    // June has 30 days
    const days = screen.getAllByRole("gridcell");
    expect(days).toHaveLength(30);
  });

  it("displays correct day names", () => {
    render(<DatePanel {...mockProps} />);

    // Check if first day of June 2025 shows correct day name
    const firstDay = screen.getByLabelText("Sun 1");
    expect(firstDay).toBeInTheDocument();
  });
});
