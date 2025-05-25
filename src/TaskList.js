import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { TaskForm } from "./TaskForm";
import { categories } from "./task";
import { PointerSensor, TouchSensor, useSensor, } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import classNames from "classnames";
import { TaskGroup } from "./TaskGroup";
import styles from "./TaskList.module.css";
const today = new Date();
const currentMonth = today.toLocaleString("default", {
    month: "long",
});
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const daysInMonth = (month) => {
    const index = months.indexOf(month) + 1;
    return new Date(today.getFullYear(), index, 0).getDate();
};
const getDayNumber = (date) => {
    return new Date(new Date(date).toLocaleString("en-US", {
        timeZone: "UTC",
    })).getDate();
};
const isVisibleInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
};
export function TaskList() {
    const [showForm, setShowForm] = useState(false);
    const [showDatePanel, setShowDatePanel] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [currentTask, setCurrentTask] = useState();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const storedArrayString = localStorage.getItem("myData");
    const [data, setData] = useState(storedArrayString ? JSON.parse(storedArrayString) : []);
    const refDay = useRef(new Map());
    const refMonth = useRef(new Map());
    useEffect(() => {
        localStorage.setItem("myData", JSON.stringify(data));
    }, [data]);
    useEffect(() => {
        const div = refDay.current.get(selectedDay);
        if (div !== undefined && !isVisibleInViewport(div)) {
            div.scrollIntoView({
                behavior: "instant",
                inline: "center",
                block: "center",
            });
        }
    }, [selectedDay, showDatePanel, showForm]);
    useEffect(() => {
        const div = refMonth.current.get(selectedMonth);
        if (div !== undefined && !isVisibleInViewport(div)) {
            div.scrollIntoView({
                behavior: "instant",
                inline: "center",
                block: "center",
            });
        }
    }, [selectedMonth, showDatePanel, showForm]);
    useEffect(() => { }, [showDatePanel]);
    const mouseSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const handleOnTaskAdd = (task) => {
        const maxId = data.length > 0 ? Math.max(...data.map((t) => t.id)) : 0;
        const maxSortedId = data.length > 0 ? Math.max(...data.map((t) => t.sortedId)) : 0;
        setData((prev) => [
            ...prev,
            { ...task, id: maxId + 1, sortedId: maxSortedId + 1 },
        ]);
        setShowForm(false);
    };
    const handleAddTaskClick = () => {
        setCurrentTask(undefined);
        setShowForm(true);
    };
    const handleDeleteTask = (task) => {
        setCurrentTask(undefined);
        setData((prev) => prev.filter((t) => t !== task));
    };
    const handleTaskClick = (task) => {
        setCurrentTask(task);
        setShowForm(true);
    };
    const handleOnCancel = () => {
        setCurrentTask(undefined);
        setShowForm(false);
    };
    const handleTaskUpdate = (task) => {
        setData((prev) => prev.map((t) => (t.id === task.id ? task : t)));
        setShowForm(false);
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setData((newData) => {
                const oldIndex = data.findIndex((task) => task.id === active.id);
                const newIndex = data.findIndex((task) => task.id === over?.id);
                return arrayMove(newData, oldIndex, newIndex);
            });
        }
    };
    const handleDateRibbonClick = () => {
        setShowDatePanel((prev) => !prev);
    };
    const handleMonthClick = (value) => () => {
        setSelectedMonth(value);
    };
    const handleDayClick = (value) => () => {
        setSelectedDay(value);
    };
    const getDayName = (indexMonth, indexDay) => {
        const day = new Date(today.getFullYear(), indexMonth, indexDay);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[day.getDay()];
    };
    const selectedDate = selectedMonth !== null && selectedDay !== null
        ? new Date(today.getFullYear(), months.indexOf(selectedMonth), selectedDay, 0)
        : null;
    const selectedDateIndex = selectedDate && selectedDate.getDate();
    const handleSelectedFilterClick = (event) => {
        setSelectedFilter(event.currentTarget.value);
    };
    const filterOnDueDate = (dueDate) => {
        return selectedDateIndex && dueDate !== undefined
            ? getDayNumber(dueDate) >= selectedDateIndex
            : true;
    };
    const filterOnStartDate = (startDate) => {
        return selectedDateIndex && startDate !== undefined
            ? getDayNumber(startDate) <= selectedDateIndex
            : true;
    };
    const filteredData = data.filter((t) => (t.category === selectedFilter || selectedFilter === "All") &&
        t.status !== "done" &&
        ((t.dueDate === undefined && t.startDate === undefined) ||
            filterOnDueDate(t.dueDate) ||
            filterOnStartDate(t.startDate)));
    const overdueTasks = filteredData.filter((t) => selectedDateIndex && t.dueDate !== undefined
        ? getDayNumber(t.dueDate) < selectedDateIndex
        : false);
    const dueTasks = filteredData.filter((t) => selectedDateIndex && t.dueDate !== undefined
        ? getDayNumber(t.dueDate) === selectedDateIndex
        : false);
    const getNextMonday = (date) => {
        const mondayDate = new Date(date);
        const dateFrom = mondayDate.setDate(mondayDate.getDate() + (((7 - mondayDate.getDay()) % 7) + 1));
        return new Date(dateFrom);
    };
    const getNextSunday = (date) => {
        const nextMonday = getNextMonday(date);
        return new Date(nextMonday.setDate(nextMonday.getDate() + (nextMonday.getDay() + 5)));
    };
    const dueNextWeekTasks = filteredData.filter((t) => t.dueDate !== undefined && selectedDate
        ? new Date(t.dueDate) >= getNextMonday(selectedDate) &&
            new Date(t.dueDate) <= getNextSunday(selectedDate)
        : false);
    const currentTasks = filteredData.filter((t) => !dueTasks.includes(t) &&
        !overdueTasks.includes(t) &&
        !dueNextWeekTasks.includes(t));
    return showForm ? (_jsx(TaskForm, { onTaskAdd: handleOnTaskAdd, task: currentTask, onCancel: handleOnCancel, onTaskUpdate: handleTaskUpdate })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: classNames(styles.dateRibbon, {
                    [styles.hideDateRibbon]: !showDatePanel,
                    [styles.showDateRibbon]: showDatePanel,
                }), children: [showDatePanel && (_jsxs(_Fragment, { children: [_jsx("label", { className: styles.dateRibbonLabel, children: "TaskList" }), _jsx("div", { className: styles.months, children: months.map((month) => (_jsx("div", { className: classNames(styles.month, {
                                        [styles.selectedMonth]: selectedMonth === month,
                                    }), onClick: handleMonthClick(month), ref: (el) => {
                                        if (el) {
                                            refMonth.current.set(month, el);
                                        }
                                    }, children: month }, month))) }), _jsx("div", { className: styles.days, children: Array.from({ length: daysInMonth(selectedMonth) }, (_x, i) => i).map((i) => {
                                    const index = i + 1;
                                    return (_jsxs("div", { className: classNames(styles.day, {
                                            [styles.selectedDay]: selectedDay === index,
                                        }), onClick: handleDayClick(index), ref: (el) => {
                                            if (el) {
                                                refDay.current.set(index, el);
                                            }
                                        }, children: [index, _jsx("div", { children: getDayName(months.indexOf(selectedMonth), index) })] }, index));
                                }) })] })), _jsx("div", { className: styles.grabberParent, children: _jsx("div", { className: styles.dateRibbonGrabberBar, onClick: handleDateRibbonClick }) })] }), _jsxs("div", { className: styles.taskList, children: [_jsx("div", { className: styles.titleHeader, children: _jsxs("select", { className: styles.select, value: selectedFilter, onChange: handleSelectedFilterClick, children: [_jsx("option", { value: "All", children: "All" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] }) }), _jsx(TaskGroup, { filteredData: overdueTasks, groupDescription: "Overdue", mouseSensor: mouseSensor, touchSensor: touchSensor, handleDeleteTask: handleDeleteTask, handleDragEnd: handleDragEnd, handleTaskClick: handleTaskClick, handleTaskUpdate: handleTaskUpdate }), _jsx(TaskGroup, { filteredData: dueTasks, groupDescription: "Due Today", mouseSensor: mouseSensor, touchSensor: touchSensor, handleDeleteTask: handleDeleteTask, handleDragEnd: handleDragEnd, handleTaskClick: handleTaskClick, handleTaskUpdate: handleTaskUpdate }), _jsx(TaskGroup, { filteredData: dueNextWeekTasks, groupDescription: "Due Next Week", mouseSensor: mouseSensor, touchSensor: touchSensor, handleDeleteTask: handleDeleteTask, handleDragEnd: handleDragEnd, handleTaskClick: handleTaskClick, handleTaskUpdate: handleTaskUpdate }), _jsx(TaskGroup, { filteredData: currentTasks, groupDescription: "Current", mouseSensor: mouseSensor, touchSensor: touchSensor, handleDeleteTask: handleDeleteTask, handleDragEnd: handleDragEnd, handleTaskClick: handleTaskClick, handleTaskUpdate: handleTaskUpdate })] }), _jsx("div", { className: styles.addTaskButtonContainer, children: _jsx("button", { className: styles.addTaskButton, onClick: handleAddTaskClick, children: "+" }) })] }));
}
