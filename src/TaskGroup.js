import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import styles from "./TaskGroup.module.css";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { TaskCard } from "./TaskCard";
export function TaskGroup({ filteredData, groupDescription, handleDeleteTask, handleDragEnd, handleTaskClick, handleTaskUpdate, mouseSensor, touchSensor, }) {
    return (filteredData.length > 0 && (_jsxs("div", { className: styles.taskList, children: [_jsx("div", { className: styles.title, children: groupDescription }), _jsx("ul", { children: _jsx(DndContext, { onDragEnd: handleDragEnd, sensors: [mouseSensor, touchSensor], modifiers: [restrictToVerticalAxis], children: _jsx(SortableContext, { items: filteredData, strategy: verticalListSortingStrategy, children: filteredData.map((task) => (_jsx(TaskCard, { id: task.id, task: task, onDeleteTask: handleDeleteTask, onClick: handleTaskClick, onUpdateTask: handleTaskUpdate }, task.id))) }) }) })] })));
}
