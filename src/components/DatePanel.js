import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import classNames from "classnames";
import { days, Months } from "../dates";
import styles from "./DatePanel.module.css";
import { useCallback, useMemo } from "react";
export function DatePanel({ onDayClick, onMonthClick, refMonth, refDay, selectedDay, selectedMonth, }) {
    const today = new Date();
    const daysInMonth = useMemo(() => (month) => {
        const index = Months.indexOf(month) + 1;
        return new Date(today.getFullYear(), index, 0).getDate();
    }, [today]);
    const getDayName = (indexMonth, indexDay) => {
        const day = new Date(today.getFullYear(), indexMonth, indexDay);
        return days[day.getDay()];
    };
    const handleMonthClick = useCallback((value) => () => {
        onMonthClick(value)();
    }, [onMonthClick]);
    const handleDayClick = useCallback((index) => () => {
        onDayClick(index)();
    }, [onDayClick]);
    return (_jsxs(_Fragment, { children: [_jsx("label", { className: styles.dateRibbonLabel, children: "TaskList" }), _jsx("div", { className: styles.months, children: Months.map((month) => (_jsx("div", { className: classNames(styles.month, {
                        [styles.selectedMonth]: selectedMonth === month,
                    }), onClick: handleMonthClick(month), ref: (el) => {
                        if (el) {
                            refMonth.current.set(month, el);
                        }
                    }, "aria-label": `Select ${month}`, "aria-selected": selectedMonth === month, tabIndex: 0, children: month }, month))) }), _jsx("div", { className: styles.days, "aria-label": "Calendar", children: Array.from({ length: daysInMonth(selectedMonth) }).map((_, i) => {
                    const index = i + 1;
                    return (_jsxs("div", { tabIndex: 0, "aria-selected": selectedDay === index, "aria-label": `${getDayName(Months.indexOf(selectedMonth), index)} ${index}`, className: classNames(styles.day, {
                            [styles.selectedDay]: selectedDay === index,
                        }), onClick: handleDayClick(index), ref: (el) => {
                            if (el) {
                                refDay.current.set(index, el);
                            }
                        }, role: "gridcell", children: [index, _jsx("div", { children: getDayName(Months.indexOf(selectedMonth), index) })] }, index));
                }) })] }));
}
