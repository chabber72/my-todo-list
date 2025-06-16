export const categories = ["Bug", "Feature", "ToDo"] as const;
type TaskCategory = (typeof categories)[number];

export interface Task {
  id: number;
  parentId?: number;
  sortedId: number;
  title: string;
  category?: TaskCategory;
  description?: string;
  status?: "to-do" | "in-progress" | "done";
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
}
