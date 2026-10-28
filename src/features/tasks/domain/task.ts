export const categories = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'] as const;
export const priorities = ['Cao', 'Trung bình', 'Thấp'] as const;

export type Category = (typeof categories)[number];
export type Priority = (typeof priorities)[number];
export type TaskFilter = 'all' | 'todo' | 'done' | 'overdue';
export type SortMode = 'dueDate' | 'priority';

export type Task = {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  done: boolean;
};
