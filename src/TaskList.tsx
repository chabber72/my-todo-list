import { useEffect, useRef, useState } from "react";
import { TaskForm } from "./TaskForm";
import { categories, Task } from "./task";

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
} from "./dates";

const today = new Date();
const currentMonth = today.toLocaleString("default", {
  month: "long",
}) as Month;

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
] as const;
type Month = (typeof months)[number];
const daysInMonth = (month: Month) => {
  const index = months.indexOf(month) + 1;
  return new Date(today.getFullYear(), index, 0).getDate();
};

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
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const storedArrayString = localStorage.getItem("myData");
  const [data, setData] = useState<Task[]>(
    storedArrayString ? (JSON.parse(storedArrayString) as Task[]) : [],
  );
  const refDay = useRef<Map<number, HTMLDivElement>>(new Map());
  const refMonth = useRef<Map<string, HTMLDivElement>>(new Map());

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

  const handleDeleteTask = (task: Task) => {
    setCurrentTask(undefined);
    setData((prev) => prev.filter((t) => t !== task));
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

  const getDayName = (indexMonth: number, indexDay: number) => {
    const day = new Date(today.getFullYear(), indexMonth, indexDay);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day.getDay()];
  };

  const selectedDate =
    selectedMonth !== null && selectedDay !== null
      ? new Date(
          today.getFullYear(),
          months.indexOf(selectedMonth),
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
            months.indexOf(selectedMonth),
            selectedDateIndex,
          )
      : true;
  };

  const filterOnStartDate = (startDate?: Date) => {
    return selectedDateIndex && startDate !== undefined
      ? getUTCDate(startDate) <=
          getFullDate(
            today.getFullYear(),
            months.indexOf(selectedMonth),
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
          months.indexOf(selectedMonth),
          selectedDateIndex,
        )
      : false,
  );

  const dueTasks = filteredData.filter((t) =>
    selectedDateIndex && t.dueDate !== undefined
      ? getUTCDate(t.dueDate).getTime() ===
        getFullDate(
          today.getFullYear(),
          months.indexOf(selectedMonth),
          selectedDateIndex,
        ).getTime()
      : false,
  );

  const dueThisWeekTasks = data.filter((t) =>
    selectedDateIndex &&
    t.dueDate !== undefined &&
    selectedDate &&
    t.startDate !== undefined
      ? getUTCDate(t.dueDate) >= getThisMonday(selectedDate) &&
        getUTCDate(t.dueDate) <= getThisSunday(selectedDate) &&
        getUTCDate(t.startDate) >
          getFullDate(
            today.getFullYear(),
            months.indexOf(selectedMonth),
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

  return showForm ? (
    <TaskForm
      onTaskAdd={handleOnTaskAdd}
      task={currentTask}
      onCancel={handleOnCancel}
      onTaskUpdate={handleTaskUpdate}
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
          <>
            <label className={styles.dateRibbonLabel}>TaskList</label>
            <div className={styles.months}>
              {months.map((month) => (
                <div
                  className={classNames(styles.month, {
                    [styles.selectedMonth]: selectedMonth === month,
                  })}
                  key={month}
                  onClick={handleMonthClick(month)}
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
              {Array.from(
                { length: daysInMonth(selectedMonth) },
                (_x, i) => i,
              ).map((i) => {
                const index = i + 1;
                return (
                  <div
                    key={index}
                    className={classNames(styles.day, {
                      [styles.selectedDay]: selectedDay === index,
                    })}
                    onClick={handleDayClick(index)}
                    ref={(el) => {
                      if (el) {
                        refDay.current.set(index, el);
                      }
                    }}
                  >
                    {index}
                    <div>
                      {getDayName(months.indexOf(selectedMonth), index)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
          <select
            className={styles.select}
            value={selectedFilter}
            onChange={handleSelectedFilterClick}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <TaskGroup
          filteredData={overdueTasks}
          groupDescription="Overdue"
          mouseSensor={mouseSensor}
          touchSensor={touchSensor}
          handleDeleteTask={handleDeleteTask}
          handleDragEnd={handleDragEnd}
          handleTaskClick={handleTaskClick}
          handleTaskUpdate={handleTaskUpdate}
        />
        <TaskGroup
          filteredData={dueTasks}
          groupDescription="Due Today"
          mouseSensor={mouseSensor}
          touchSensor={touchSensor}
          handleDeleteTask={handleDeleteTask}
          handleDragEnd={handleDragEnd}
          handleTaskClick={handleTaskClick}
          handleTaskUpdate={handleTaskUpdate}
        />
        <TaskGroup
          filteredData={dueThisWeekTasks}
          groupDescription="Due This Week"
          mouseSensor={mouseSensor}
          touchSensor={touchSensor}
          handleDeleteTask={handleDeleteTask}
          handleDragEnd={handleDragEnd}
          handleTaskClick={handleTaskClick}
          handleTaskUpdate={handleTaskUpdate}
        />
        <TaskGroup
          filteredData={dueNextWeekTasks}
          groupDescription="Due Next Week"
          mouseSensor={mouseSensor}
          touchSensor={touchSensor}
          handleDeleteTask={handleDeleteTask}
          handleDragEnd={handleDragEnd}
          handleTaskClick={handleTaskClick}
          handleTaskUpdate={handleTaskUpdate}
        />
        <TaskGroup
          filteredData={currentTasks}
          groupDescription="Active"
          mouseSensor={mouseSensor}
          touchSensor={touchSensor}
          handleDeleteTask={handleDeleteTask}
          handleDragEnd={handleDragEnd}
          handleTaskClick={handleTaskClick}
          handleTaskUpdate={handleTaskUpdate}
        />
      </div>
      <div className={styles.addTaskButtonContainer}>
        <button className={styles.addTaskButton} onClick={handleAddTaskClick}>
          +
        </button>
      </div>
    </>
  );
}
