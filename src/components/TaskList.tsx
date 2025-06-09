import { useEffect, useRef, useState } from "react";
import { TaskForm } from "./TaskForm";
import { Task } from "../task";

import {
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import classNames from "classnames";
import { TaskGroup } from "./TaskGroup";
import styles from "./TaskList.module.css";
import {
  getFullDate,
  getNextMonday,
  getNextSunday,
  getThisMonday,
  getThisSunday,
  getUTCDate,
  Month,
  Months,
} from "../dates";
import useLongPress from "../hooks/useLongPress";
import { Icon } from "./icon";
import { DatePanel } from "./DatePanel";
import { TaskFilter } from "./TaskFilter";

const today = new Date();
const currentMonth = today.toLocaleString("default", {
  month: "long",
}) as Month;

const isVisibleInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const [showDatePanel, setShowDatePanel] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [isRecording, setIsRecording] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const storedArrayString = localStorage.getItem("myData");
  const [data, setData] = useState<Task[]>(
    storedArrayString ? (JSON.parse(storedArrayString) as Task[]) : [],
  );
  const refDay = useRef<Map<number, HTMLDivElement>>(new Map());
  const refMonth = useRef<Map<string, HTMLDivElement>>(new Map());

  const backspaceLongPress = useLongPress<HTMLButtonElement>({
    onLongPress() {
      setIsRecording(true);
    },
    onClick() {
      isRecording ? setIsRecording((prev) => !prev) : handleAddTaskClick();
    },
  });

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

  useEffect(() => {}, [showDatePanel]);

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

  const handleOnTaskAdd = (task: Task) => {
    const maxId = data.length > 0 ? Math.max(...data.map((t) => t.id)) : 0;
    const maxSortedId =
      data.length > 0 ? Math.max(...data.map((t) => t.sortedId)) : 0;
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

  const handleTaskClick = (task: Task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const handleOnCancel = () => {
    setCurrentTask(undefined);
    setShowForm(false);
  };

  const handleTaskUpdate = (task: Task) => {
    setData((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    setShowForm(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

  const handleMonthClick = (value: Month) => () => {
    setSelectedMonth(value);
  };

  const handleDayClick = (value: number) => () => {
    setSelectedDay(value);
  };

  const selectedDate =
    selectedMonth !== null && selectedDay !== null
      ? new Date(
          today.getFullYear(),
          Months.indexOf(selectedMonth),
          selectedDay,
          0,
        )
      : null;

  const selectedDateIndex = selectedDate && selectedDate.getDate();

  const handleSelectedFilterClick = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedFilter(event.currentTarget.value);
  };

  const filterOnDueDate = (dueDate?: Date) => {
    return selectedDateIndex && dueDate !== undefined
      ? getUTCDate(dueDate) <=
          getFullDate(
            today.getFullYear(),
            Months.indexOf(selectedMonth),
            selectedDateIndex,
          )
      : true;
  };

  const filterOnStartDate = (startDate?: Date) => {
    return selectedDateIndex && startDate !== undefined
      ? getUTCDate(startDate) <=
          getFullDate(
            today.getFullYear(),
            Months.indexOf(selectedMonth),
            selectedDateIndex,
          )
      : true;
  };

  const filteredData = data.filter(
    (t) =>
      (t.category === selectedFilter || selectedFilter === "All") &&
      t.status !== "done" &&
      ((t.dueDate === undefined && t.startDate === undefined) ||
        filterOnDueDate(t.dueDate) ||
        filterOnStartDate(t.startDate)),
  );

  const overdueTasks = filteredData.filter((t) =>
    selectedDateIndex && t.dueDate !== undefined
      ? getUTCDate(t.dueDate) <
        getFullDate(
          today.getFullYear(),
          Months.indexOf(selectedMonth),
          selectedDateIndex,
        )
      : false,
  );

  const dueTasks = filteredData.filter((t) =>
    selectedDateIndex && t.dueDate !== undefined
      ? getUTCDate(t.dueDate).getTime() ===
        getFullDate(
          today.getFullYear(),
          Months.indexOf(selectedMonth),
          selectedDateIndex,
        ).getTime()
      : false,
  );

  const dueThisWeekTasks = data.filter((t) =>
    (t.category === selectedFilter || selectedFilter === "All") &&
    selectedDateIndex &&
    t.dueDate !== undefined &&
    selectedDate &&
    t.startDate !== undefined
      ? getUTCDate(t.dueDate) >= getThisMonday(selectedDate) &&
        getUTCDate(t.dueDate) <= getThisSunday(selectedDate) &&
        getUTCDate(t.startDate) >
          getFullDate(
            today.getFullYear(),
            Months.indexOf(selectedMonth),
            selectedDateIndex,
          )
      : false,
  );

  const dueNextWeekTasks = data.filter((t) =>
    t.dueDate !== undefined && selectedDate
      ? getUTCDate(t.dueDate) >= getNextMonday(selectedDate) &&
        getUTCDate(t.dueDate) <= getNextSunday(selectedDate)
      : false,
  );

  const currentTasks = filteredData.filter(
    (t) =>
      !dueTasks.includes(t) &&
      !overdueTasks.includes(t) &&
      !dueNextWeekTasks.includes(t),
  );

  const handleDeleteTask = (task: Task) => {
    setCurrentTask(undefined);
    setData((prev) => prev.filter((t) => t !== task));
    setShowForm(false);
  };

  return showForm ? (
    <TaskForm
      onTaskAdd={handleOnTaskAdd}
      task={currentTask}
      onCancel={handleOnCancel}
      onTaskUpdate={handleTaskUpdate}
      onTaskDelete={handleDeleteTask}
    />
  ) : (
    <>
      <div
        className={classNames(styles.dateRibbon, {
          [styles.hideDateRibbon]: !showDatePanel,
          [styles.showDateRibbon]: showDatePanel,
        })}
      >
        {showDatePanel && (
          <DatePanel
            refMonth={refMonth}
            refDay={refDay}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            onMonthClick={handleMonthClick}
            onDayClick={handleDayClick}
          />
        )}
        <div className={styles.grabberParent}>
          <div
            className={styles.dateRibbonGrabberBar}
            onClick={handleDateRibbonClick}
          />
        </div>
      </div>
      <div className={styles.taskList}>
        <div className={styles.titleHeader}>
          <TaskFilter
            selectedFilter={selectedFilter}
            onFilterChange={handleSelectedFilterClick}
          />
        </div>
        {filteredData.length === 0 ? (
          <label>No tasks found</label>
        ) : (
          <>
            <TaskGroup
              filteredData={overdueTasks}
              groupDescription="Overdue"
              mouseSensor={mouseSensor}
              touchSensor={touchSensor}
              handleDragEnd={handleDragEnd}
              handleTaskClick={handleTaskClick}
              handleTaskUpdate={handleTaskUpdate}
            />
            <TaskGroup
              filteredData={dueTasks}
              groupDescription="Due Today"
              mouseSensor={mouseSensor}
              touchSensor={touchSensor}
              handleDragEnd={handleDragEnd}
              handleTaskClick={handleTaskClick}
              handleTaskUpdate={handleTaskUpdate}
            />
            <TaskGroup
              filteredData={dueThisWeekTasks}
              groupDescription="Due This Week"
              mouseSensor={mouseSensor}
              touchSensor={touchSensor}
              handleDragEnd={handleDragEnd}
              handleTaskClick={handleTaskClick}
              handleTaskUpdate={handleTaskUpdate}
            />
            <TaskGroup
              filteredData={dueNextWeekTasks}
              groupDescription="Due Next Week"
              mouseSensor={mouseSensor}
              touchSensor={touchSensor}
              handleDragEnd={handleDragEnd}
              handleTaskClick={handleTaskClick}
              handleTaskUpdate={handleTaskUpdate}
            />
            <TaskGroup
              filteredData={currentTasks}
              groupDescription="Active"
              mouseSensor={mouseSensor}
              touchSensor={touchSensor}
              handleDragEnd={handleDragEnd}
              handleTaskClick={handleTaskClick}
              handleTaskUpdate={handleTaskUpdate}
            />
          </>
        )}
      </div>
      <div className={styles.addTaskButtonContainer}>
        <button
          {...backspaceLongPress}
          className={classNames(styles.addTaskButton, {
            [styles.recording]: isRecording,
          })}
        >
          {isRecording ? <Icon name="square" /> : "+"}
        </button>
      </div>
    </>
  );
}
