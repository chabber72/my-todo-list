import classNames from "classnames";
import { Month, Months } from "../dates";
import styles from "./DatePanel.module.css";

type DatePanelProps = {
  refMonth: React.RefObject<Map<string, HTMLDivElement>>;
  refDay: React.RefObject<Map<number, HTMLDivElement>>;
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
  const daysInMonth = (month: Month) => {
    const index = Months.indexOf(month) + 1;
    return new Date(today.getFullYear(), index, 0).getDate();
  };
  const getDayName = (indexMonth: number, indexDay: number) => {
    const day = new Date(today.getFullYear(), indexMonth, indexDay);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day.getDay()];
  };

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
            onClick={onMonthClick(month)}
            ref={(el) => {
              if (el) {
                refMonth.current.set(month, el);
              }
            }}
          >
            {month}
          </div>
        ))}
      </div>
      <div className={styles.days}>
        {Array.from({ length: daysInMonth(selectedMonth) }, (_x, i) => i).map(
          (i) => {
            const index = i + 1;
            return (
              <div
                key={index}
                className={classNames(styles.day, {
                  [styles.selectedDay]: selectedDay === index,
                })}
                onClick={onDayClick(index)}
                ref={(el) => {
                  if (el) {
                    refDay.current.set(index, el);
                  }
                }}
              >
                {index}
                <div>{getDayName(Months.indexOf(selectedMonth), index)}</div>
              </div>
            );
          },
        )}
      </div>
    </>
  );
}
