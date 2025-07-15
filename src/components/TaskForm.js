import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import styles from "./TaskForm.module.css";
import { categories } from "../model/task";
import React from "react";
const EMPTY_TASK = {
    id: -1,
    sortedId: 1,
    title: "",
    description: "",
    category: undefined,
    createdAt: new Date(),
    dueDate: undefined,
    startDate: undefined,
};
export function TaskForm({ onCancel, onTaskAdd, onTaskDelete, onTaskUpdate, task, }) {
    const [currentTask, setCurrentTask] = useState({
        ...EMPTY_TASK,
        ...task,
    });
    const ref = useRef(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current?.focus();
        }
    }, [ref]);
    const handleTitleChange = (event) => {
        setCurrentTask((prev) => ({
            ...(prev || EMPTY_TASK),
            title: event.target.value,
        }));
    };
    const handleDescriptionChange = (event) => {
        setCurrentTask((prev) => ({
            ...(prev || EMPTY_TASK),
            description: event.target.value,
        }));
    };
    function handleAdd() {
        if (currentTask && onTaskAdd) {
            onTaskAdd(currentTask);
        }
    }
    function handleOnCancel() {
        setCurrentTask(EMPTY_TASK);
        if (onCancel) {
            onCancel();
        }
    }
    const handleDeleteClick = () => {
        if (task && onTaskDelete) {
            onTaskDelete(task);
        }
    };
    const handleUpdate = () => {
        if (currentTask && onTaskUpdate) {
            onTaskUpdate(currentTask);
        }
    };
    const handleCategoryChange = (event) => {
        setCurrentTask((prev) => ({
            ...(prev || EMPTY_TASK),
            category: event.target.value,
        }));
    };
    const dueDate = currentTask?.dueDate
        ? new Date(currentTask.dueDate)
        : undefined;
    const startDate = currentTask?.startDate
        ? new Date(currentTask.startDate)
        : undefined;
    return (_jsxs("div", { className: styles.taskForm, children: [_jsx("h2", { className: styles.title, children: "Title:" }), _jsx("div", { className: styles.inputWrapper, children: ref && (_jsx("input", { value: currentTask.title, onChange: handleTitleChange, ref: ref, type: "text", role: "textbox", "aria-label": "title" })) }), _jsx("h2", { className: styles.title, children: "Description:" }), _jsx("div", { className: styles.inputWrapper, children: _jsx("textarea", { value: currentTask.description, onChange: handleDescriptionChange, rows: 10, cols: 30, role: "textbox", "aria-label": "description" }) }), _jsx("h2", { className: styles.title, children: "Category:" }), _jsxs("select", { role: "combobox", onChange: handleCategoryChange, value: currentTask?.category, children: [_jsx("option", { value: "", children: "Select a category" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] }), _jsxs("div", { className: styles.dateHeader, children: [_jsx("h2", { className: styles.title, children: "Start Date:" }), _jsx("h2", { className: styles.title, children: "Due Date:" })] }), _jsxs("div", { className: styles.dates, children: [_jsx("input", { type: "date", value: startDate?.toISOString().split("T")[0], onChange: (e) => {
                            const date = new Date(e.target.value);
                            setCurrentTask((prev) => ({
                                ...(prev || EMPTY_TASK),
                                startDate: date,
                            }));
                        } }), _jsx("input", { type: "date", value: dueDate?.toISOString().split("T")[0], onChange: (e) => {
                            const date = new Date(e.target.value);
                            setCurrentTask((prev) => ({
                                ...(prev || EMPTY_TASK),
                                dueDate: date,
                            }));
                        } })] }), _jsxs("div", { className: styles.buttons, children: [_jsx("button", { onClick: handleOnCancel, children: "Cancel" }), _jsx("button", { onClick: task ? handleUpdate : handleAdd, children: task ? "Update" : "Add" }), task && _jsx("button", { onClick: handleDeleteClick, children: "Delete" })] })] }));
}
