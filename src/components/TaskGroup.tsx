import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, SensorDescriptor } from "@dnd-kit/core";
import styles from "./TaskGroup.module.css";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Task } from "../model/task";
import { TaskCard } from "./TaskCard";

export type GroupType =
  | "overdue"
  | "due-today"
  | "due-this-week"
  | "due-next-week"
  | "active";

type TaskGroupProps = {
  filteredData: Task[];
  groupType?: GroupType;
  groupDescription: string;
  mouseSensor: SensorDescriptor<{
    activationConstraint: {
      distance: number;
    };
  }>;
  touchSensor: SensorDescriptor<{
    activationConstraint: {
      delay: number;
      tolerance: number;
    };
  }>;
  handleDragEnd?: (event: DragEndEvent) => void;
  handleTaskClick?: (task: Task) => void;
  handleTaskUpdate?: (task: Task) => void;
};

export function TaskGroup({
  groupType,
  filteredData,
  groupDescription,
  handleDragEnd,
  handleTaskClick,
  handleTaskUpdate,
  mouseSensor,
  touchSensor,
}: TaskGroupProps) {
  return (
    filteredData.length > 0 && (
      <div className={styles.taskList}>
        {groupDescription && (
          <div className={styles.title}>{groupDescription}</div>
        )}
        <ul>
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={[mouseSensor, touchSensor]}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={filteredData}
              strategy={verticalListSortingStrategy}
            >
              {filteredData.map((task) => (
                <TaskCard
                  id={task.id}
                  groupType={groupType}
                  key={task.id}
                  task={task}
                  onClick={handleTaskClick}
                  onUpdateTask={handleTaskUpdate}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      </div>
    )
  );
}
