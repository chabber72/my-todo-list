import classNames from "classnames";
import { days, Month, Months } from "../dates";
import styles from "./DatePanel.module.css";
import { useCallback, useMemo } from "react";

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

export function DatePanel({
  onDayClick,
  onMonthClick,
  refMonth,
  refDay,
  selectedDay,
  selectedMonth,
}: DatePanelProps) {
  const today = new Date();

  const daysInMonth = useMemo(
    () => (month: Month) => {
      const index = Months.indexOf(month) + 1;
      return new Date(today.getFullYear(), index, 0).getDate();
    },
    [today],
  );

  const getDayName = (indexMonth: number, indexDay: number) => {
    const day = new Date(today.getFullYear(), indexMonth, indexDay);
    return days[day.getDay()];
  };

  const handleMonthClick = useCallback(
    (value: Month) => () => {
      onMonthClick(value)();
    },
    [onMonthClick],
  );

  const handleDayClick = useCallback(
    (index: number) => () => {
      onDayClick(index)();
    },
    [onDayClick],
  );

  return (
    <>
      <label className={styles.dateRibbonLabel}>TaskList</label>
      <div className={styles.months}>
        {Months.map((month) => (
          <div
            className={classNames(styles.month, {
              [styles.selectedMonth]: selectedMonth === month,
            })}
            key={month}
            onClick={handleMonthClick(month)}
            ref={(el) => {
              if (el) {
                refMonth.current.set(month, el);
              }
            }}
            aria-label={`Select ${month}`}
            aria-selected={selectedMonth === month}
            tabIndex={0}
          >
            {month}
          </div>
        ))}
      </div>
      <div className={styles.days} aria-label="Calendar">
        {Array.from({ length: daysInMonth(selectedMonth) }).map((_, i) => {
          const index = i + 1;
          return (
            <div
              key={index}
              tabIndex={0}
              aria-selected={selectedDay === index}
              aria-label={`${getDayName(Months.indexOf(selectedMonth), index)} ${index}`}
              className={classNames(styles.day, {
                [styles.selectedDay]: selectedDay === index,
              })}
              onClick={handleDayClick(index)}
              ref={(el) => {
                if (el) {
                  refDay.current.set(index, el);
                }
              }}
              role="gridcell"
            >
              {index}
              <div>{getDayName(Months.indexOf(selectedMonth), index)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
