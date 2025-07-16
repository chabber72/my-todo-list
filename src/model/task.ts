export const defaultCategories = ["Bug", "Feature", "ToDo"] as const;
type TaskCategory = (typeof defaultCategories)[number];

export interface Task {
  id: number;
  parentId?: number;
  sortedId: number;
  title: string;
  category?: TaskCategory;
  completedDate?: Date;
  description?: string;
  status?: "to-do" | "in-progress" | "done";
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
}
