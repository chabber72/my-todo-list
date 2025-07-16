import { defaultCategories } from "../model/task";
import styles from "./TaskFilter.module.css";

type TaskFilterProps = {
  selectedFilter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function TaskFilter({
  selectedFilter,
  onFilterChange,
}: TaskFilterProps) {
  return (
    <div className="titleHeader">
      <select
        className={styles.select}
        aria-label="Filter by category"
        value={selectedFilter}
        onChange={onFilterChange}
      >
        <option value="All">All</option>
        {defaultCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
