import classNames from "classnames";
import { Task } from "./task";
import styles from "./TaskCard.module.css";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
  id: number;
  task?: Task;
  onClick?: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
};

export function TaskCard({ id, task, onClick, onUpdateTask }: TaskCardProps) {
  const [isChecked, setIsChecked] = React.useState(task?.status === "done");
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const parents: string[] = ["Downsize Apartment"];

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    if (task && onUpdateTask) {
      const isSelected = !isChecked;
      const updatedTask: Task = {
        ...task,
        status: isSelected ? "done" : "to-do",
      };

      onUpdateTask(updatedTask);
      setIsChecked(isSelected);
    }
  };

  const handleTaskClick =
    (task: Task) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick && onClick(task);
    };

  return (
    task && (
      <li key={task.id}>
        <div
          className={styles.taskCard}
          onClick={handleTaskClick(task)}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
          }}
          data-no-dnd="true"
        >
          <div className={styles.taskInfo}>
            <label
              className={classNames(styles.taskName, {
                [styles.taskNameCompleted]: task.status === "done",
              })}
            >
              {task.title}
            </label>
            <label className={styles.description}>{task.description}</label>
            {task.category && (
              <label className={styles.category}>{task.category}</label>
            )}
          </div>
          <div className={styles.buttons}>
            <div className={styles.tooltipContainer}>
              <span className={styles.tooltip}>Delete Task</span>
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" checked={isChecked} onChange={() => {}} />
              <label onClick={handleLabelClick} htmlFor="checkbox"></label>
            </div>
            <div className={styles.dragHandle} {...attributes} {...listeners}>
              <span className={styles.dragIcon}>::</span>
            </div>
          </div>
          {task.parentId !== undefined && (
            <div className={styles.navigation}>
              {parents.map((p) => (
                <div className={styles.navigationLink} key={p}>
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </li>
    )
  );
}
