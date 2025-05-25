import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import styles from "./TaskForm.module.css";
import { categories } from "./task";
import React from "react";
export function TaskForm({ onCancel, onTaskAdd, onTaskUpdate, task, }) {
    const [currentTask, setCurrentTask] = useState(task);
    const ref = useRef(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current?.focus();
        }
    }, [ref]);
    const handleTitleChange = (event) => {
        setCurrentTask((prev) => prev
            ? { ...prev, title: event.target.value }
            : {
                id: -1,
                sortedId: 1,
                title: event.target.value,
                createdAt: new Date(),
            });
    };
    const handleDescriptionChange = (event) => {
        setCurrentTask((prev) => prev
            ? { ...prev, description: event.target.value }
            : {
                id: -1,
                sortedId: 1,
                description: event.target.value,
                createdAt: new Date(),
            });
    };
    function handleAdd() {
        if (currentTask && onTaskAdd) {
            onTaskAdd(currentTask);
        }
    }
    function handleOnCancel() {
        setCurrentTask(undefined);
        if (onCancel) {
            onCancel();
        }
    }
    const handleUpdate = () => {
        if (currentTask && onTaskUpdate) {
            onTaskUpdate(currentTask);
        }
    };
    const handleCategoryChange = (event) => {
        const newTask = {
            id: -1,
            sortedId: 1,
            title: "",
            createdAt: new Date(),
            category: event.target.value,
        };
        setCurrentTask((prev) => prev
            ? { ...prev, category: event.target.value }
            : newTask);
    };
    const dueDate = currentTask?.dueDate
        ? new Date(currentTask.dueDate)
        : undefined;
    const startDate = currentTask?.startDate
        ? new Date(currentTask.startDate)
        : undefined;
    return (_jsxs("div", { className: styles.taskForm, children: [_jsx("h2", { className: styles.title, children: "Title:" }), _jsx("div", { className: styles.inputWrapper, children: ref && (_jsx("input", { value: currentTask?.title, onChange: handleTitleChange, ref: ref, type: "text" })) }), _jsx("h2", { className: styles.title, children: "Description:" }), _jsx("div", { className: styles.inputWrapper, children: _jsx("textarea", { value: currentTask?.description, onChange: handleDescriptionChange, rows: 10, cols: 30 }) }), _jsx("h2", { className: styles.title, children: "Details:" }), _jsxs("select", { onChange: handleCategoryChange, value: currentTask?.category, children: [_jsx("option", { value: "", children: "Select a category" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] }), _jsxs("div", { className: styles.dateHeader, children: [_jsx("h2", { className: styles.title, children: "Start Date:" }), _jsx("h2", { className: styles.title, children: "Due Date:" })] }), _jsxs("div", { className: styles.dates, children: [_jsx("input", { type: "date", value: startDate?.toISOString().split("T")[0], onChange: (e) => {
                            const date = new Date(e.target.value);
                            setCurrentTask((prev) => prev
                                ? { ...prev, startDate: date }
                                : {
                                    id: -1,
                                    sortedId: 1,
                                    startDate: date,
                                    createdAt: new Date(),
                                    title: "",
                                });
                        } }), _jsx("input", { type: "date", value: dueDate?.toISOString().split("T")[0], onChange: (e) => {
                            const date = new Date(e.target.value);
                            setCurrentTask((prev) => prev
                                ? { ...prev, dueDate: date }
                                : {
                                    id: -1,
                                    sortedId: 1,
                                    dueDate: date,
                                    createdAt: new Date(),
                                    title: "",
                                });
                        } })] }), _jsxs("div", { className: styles.buttons, children: [_jsx("button", { onClick: handleOnCancel, children: "Cancel" }), _jsx("button", { onClick: task ? handleUpdate : handleAdd, children: task ? "Update" : "Add" })] })] }));
}
