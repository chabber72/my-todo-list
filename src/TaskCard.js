import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import styles from "./TaskCard.module.css";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export function TaskCard({ id, task, onDeleteTask, onClick, onUpdateTask, }) {
    const [isChecked, setIsChecked] = React.useState(task?.status === "done");
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const handleLabelClick = (e) => {
        e.stopPropagation();
        if (task && onUpdateTask) {
            const isSelected = !isChecked;
            const updatedTask = {
                ...task,
                status: isSelected ? "done" : "to-do",
            };
            onUpdateTask(updatedTask);
            setIsChecked(isSelected);
        }
    };
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (task && onDeleteTask) {
            onDeleteTask(task);
        }
    };
    const handleTaskClick = (task) => (e) => {
        e.stopPropagation();
        onClick && onClick(task);
    };
    return (task && (_jsx("li", { children: _jsxs("div", { className: styles.taskCard, onClick: handleTaskClick(task), ref: setNodeRef, ...attributes, ...listeners, style: {
                transform: CSS.Transform.toString(transform),
                transition,
            }, "data-no-dnd": "true", children: [_jsxs("div", { className: styles.taskInfo, children: [_jsx("label", { className: classNames(styles.taskName, {
                                [styles.taskNameCompleted]: task.status === "done",
                            }), children: task.title }), _jsx("label", { className: styles.description, children: task.description }), task.category && (_jsx("label", { className: styles.category, children: task.category }))] }), _jsxs("div", { className: styles.buttons, children: [_jsxs("div", { className: styles.tooltipContainer, children: [_jsx("div", { className: styles.deleteButton, onClick: handleDeleteClick, children: "X" }), _jsx("span", { className: styles.tooltip, children: "Delete Task" })] }), _jsxs("div", { className: styles.checkbox, children: [_jsx("input", { type: "checkbox", checked: isChecked, onChange: () => { } }), _jsx("label", { onClick: handleLabelClick, htmlFor: "checkbox" })] }), _jsx("div", { className: styles.dragHandle, ...attributes, ...listeners, children: _jsx("span", { className: styles.dragIcon, children: "::" }) })] })] }) }, task.id)));
}
