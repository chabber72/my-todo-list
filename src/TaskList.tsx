import { useEffect, useRef, useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { categories, Task } from "./task";
import styles from "./TaskList.module.css";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import classNames from "classnames";

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
const getDayNumber = (date: Date) => {
  return new Date(
    new Date(date).toLocaleString("en-US", {
      timeZone: "UTC",
    }),
  ).getDate();
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

  const handleMonthClick =
    (value: Month) => (event: React.MouseEvent<HTMLDivElement>) => {
      setSelectedMonth(value);
    };

  const handleDayClick =
    (value: number) => (event: React.MouseEvent<HTMLDivElement>) => {
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
        ).getDate()
      : null;

  const handleSelectedFilterClick = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedFilter(event.currentTarget.value);
  };

  const filterOnDueDate = (dueDate?: Date) => {
    return selectedDate && dueDate !== undefined
      ? getDayNumber(dueDate) >= selectedDate
      : true;
  };

  const filterOnStartDate = (startDate?: Date) => {
    return selectedDate && startDate !== undefined
      ? getDayNumber(startDate) <= selectedDate
      : true;
  };

  const isDueToday = (dueDate?: Date) => {
    return selectedDate && dueDate !== undefined
      ? getDayNumber(dueDate) === selectedDate
      : false;
  };

  const isOverDue = (dueDate?: Date) => {
    return selectedDate && dueDate !== undefined
      ? getDayNumber(dueDate) < selectedDate
      : false;
  };

  const filteredData = data.filter(
    (t) =>
      (t.category === selectedFilter || selectedFilter === "All") &&
      ((t.dueDate === undefined && t.startDate === undefined) ||
        filterOnDueDate(t.dueDate) ||
        filterOnStartDate(t.startDate)),
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
                (x, i) => i,
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
          <h2 className={styles.title}>Tasks</h2>
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
        <ul>
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={[mouseSensor, touchSensor]}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={data}
              strategy={verticalListSortingStrategy}
            >
              {filteredData.map((task) => (
                <TaskCard
                  id={task.id}
                  key={task.id}
                  task={task}
                  isDueToday={
                    isDueToday(task.dueDate) && task.status !== "done"
                  }
                  isOverdue={isOverDue(task.dueDate) && task.status !== "done"}
                  onDeleteTask={handleDeleteTask}
                  onClick={handleTaskClick}
                  onUpdateTask={handleTaskUpdate}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      </div>
      <div className={styles.addTaskButtonContainer}>
        <button className={styles.addTaskButton} onClick={handleAddTaskClick}>
          +
        </button>
      </div>
    </>
  );
}
