import { useRef, useState } from "react";
import styles from "./TaskForm.module.css";
import { categories, Task } from "../model/task";
import React from "react";

type TaskFormProps = {
  task?: Task;
  onTaskAdd?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  onTaskUpdate?: (task: Task) => void;
  onCancel?: () => void;
};

const EMPTY_TASK: Task = {
  id: -1,
  sortedId: 1,
  title: "",
  description: "",
  category: undefined,
  createdAt: new Date(),
  dueDate: undefined,
  startDate: undefined,
};

export function TaskForm({
  onCancel,
  onTaskAdd,
  onTaskDelete,
  onTaskUpdate,
  task,
}: TaskFormProps) {
  const [currentTask, setCurrentTask] = useState<Task>({
    ...EMPTY_TASK,
    ...task,
  });
  const ref = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current?.focus();
    }
  }, [ref]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTask((prev) => ({
      ...(prev || EMPTY_TASK),
      title: event.target.value,
    }));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCurrentTask((prev) => ({
      ...(prev || EMPTY_TASK),
      description: event.target.value as Task["category"],
    }));
  };

  function handleAdd(): void {
    if (currentTask && onTaskAdd) {
      onTaskAdd(currentTask);
    }
  }

  function handleOnCancel(): void {
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

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrentTask((prev) => ({
      ...(prev || EMPTY_TASK),
      category: event.target.value as Task["category"],
    }));
  };

  const dueDate = currentTask?.dueDate
    ? new Date(currentTask.dueDate)
    : undefined;

  const startDate = currentTask?.startDate
    ? new Date(currentTask.startDate)
    : undefined;

  const isValidDate = (date: Date | undefined) => {
    return date && !isNaN(date.getTime());
  };

  return (
    <div className={styles.taskForm}>
      <h2 className={styles.title}>Title:</h2>
      <div className={styles.inputWrapper}>
        {ref && (
          <input
            value={currentTask.title}
            onChange={handleTitleChange}
            ref={ref}
            type="text"
            role="textbox"
            aria-label="title"
          />
        )}
      </div>
      <h2 className={styles.title}>Description:</h2>
      <div className={styles.inputWrapper}>
        <textarea
          value={currentTask.description}
          onChange={handleDescriptionChange}
          rows={10}
          cols={30}
          role="textbox"
          aria-label="description"
        />
      </div>
      <h2 className={styles.title}>Category:</h2>

      <select
        role="combobox"
        onChange={handleCategoryChange}
        value={currentTask?.category}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className={styles.dateHeader}>
        <h2 className={styles.title}>Start Date:</h2>
        <h2 className={styles.title}>Due Date:</h2>
      </div>
      <div className={styles.dates}>
        <input
          type="date"
          value={
            isValidDate(startDate)
              ? startDate?.toISOString().split("T")[0]
              : undefined
          }
          onChange={(e) => {
            if (isValidDate(new Date(e.target.value))) {
              const date = new Date(e.target.value);
              setCurrentTask((prev) => ({
                ...(prev || EMPTY_TASK),
                startDate: date,
              }));
            } else {
              setCurrentTask((prev) => ({
                ...(prev || EMPTY_TASK),
                startDate: undefined,
              }));
            }
          }}
        />
        <input
          type="date"
          value={
            isValidDate(dueDate)
              ? dueDate?.toISOString().split("T")[0]
              : undefined
          }
          onChange={(e) => {
            if (isValidDate(new Date(e.target.value))) {
              const date = new Date(e.target.value);
              setCurrentTask((prev) => ({
                ...(prev || EMPTY_TASK),
                dueDate: date,
              }));
            } else {
              setCurrentTask((prev) => ({
                ...(prev || EMPTY_TASK),
                dueDate: undefined,
              }));
            }
          }}
        />
      </div>
      <div className={styles.buttons}>
        <button onClick={handleOnCancel}>Cancel</button>
        {task && <button onClick={handleDeleteClick}>Delete</button>}
        <button onClick={task ? handleUpdate : handleAdd}>
          {task ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}
