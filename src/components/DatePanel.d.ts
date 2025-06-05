import { Month } from "../dates";
type DayRef = React.RefObject<Map<number, HTMLDivElement>>;
type MonthRef = React.RefObject<Map<string, HTMLDivElement>>;
type DatePanelProps = {
    refMonth: MonthRef;
    refDay: DayRef;
    selectedMonth: Month;
    selectedDay: number;
    onMonthClick: (value: Month) => () => void;
    onDayClick: (value: number) => () => void;
};
export declare function DatePanel({ onDayClick, onMonthClick, refMonth, refDay, selectedDay, selectedMonth, }: DatePanelProps): import("react/jsx-runtime").JSX.Element;
export {};
