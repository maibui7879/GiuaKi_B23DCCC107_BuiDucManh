import React, {createContext, useContext, useEffect, useMemo, useState, useRef, useCallback} from 'react';
import {Alert} from 'react-native';
import {useNotifications} from '../../../../shared/components/Notifications';

import {loadTasks, saveTasks} from '../../data/taskStorage';
import {Category, SortMode, Task, TaskFilter} from '../../domain/task';
import {createId, isOverdue, parseDate, priorityRank} from '../../utils/taskUtils';

type TaskStore = {
  tasks: Task[];
  loading: boolean;
  saving: boolean;
  filtering: boolean;
  filter: TaskFilter;
  categoryFilter: Category | 'all';
  setCategoryFilter: (category: Category | 'all') => void;
  resetFilters: () => void;
  search: string;
  sortMode: SortMode;
  visibleTasks: Task[];
  completedCount: number;
  setFilter: (filter: TaskFilter) => void;
  setSearch: (search: string) => void;
  setSortMode: (mode: SortMode) => void;
  getTask: (id: string) => Task | undefined;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteCompleted: () => Promise<void>;
};

const TasksContext = createContext<TaskStore | null>(null);

export function TasksProvider({children}: React.PropsWithChildren) {
  const {notify} = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const saveLock = useRef(false);
  const frame = useRef<number | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');

  useEffect(() => {
    loadTasks().then(setTasks).catch(() => Alert.alert('Không tải được dữ liệu', 'Vui lòng mở lại ứng dụng để thử lại.')).finally(() => setLoading(false));
    return () => {if (frame.current !== null) cancelAnimationFrame(frame.current);};
  }, []);

  const commit = useCallback(async (next: Task[]) => {
    if (saveLock.current) throw new Error('Đang lưu');
    saveLock.current = true;
    setSaving(true);
    try {
      await saveTasks(next);
      setTasks(next);
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }, []);
  const changeView = useCallback((apply: () => void) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setFiltering(true);
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {apply(); setFiltering(false); frame.current = null;});
    });
  }, []);
  const saveAction = useCallback(async (next: Task[], message?: string, title = 'Đã xoá công việc') => {
    if (saveLock.current) return;
    try {await commit(next); if (message) notify({title, message});} catch {Alert.alert('Không lưu được công việc', 'Dữ liệu chưa thay đổi. Vui lòng thử lại.');}
  }, [commit, notify]);

  const value = useMemo<TaskStore>(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi-VN');
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLocaleLowerCase('vi-VN').includes(normalizedSearch);
      const matchesFilter = filter === 'all' || (filter === 'todo' && !task.done) || (filter === 'done' && task.done) || (filter === 'overdue' && isOverdue(task));
      return matchesSearch && matchesFilter && (categoryFilter === 'all' || task.category === categoryFilter);
    });
    const visibleTasks = [...filtered].sort((a, b) => {
      if (sortMode === 'priority') return priorityRank(a.priority) - priorityRank(b.priority);
      return (parseDate(a.dueDate)?.getTime() ?? 0) - (parseDate(b.dueDate)?.getTime() ?? 0);
    });

    return {
      tasks,
      loading,
      saving,
      filtering,
      filter,
      categoryFilter,
      resetFilters: () => changeView(() => {setFilter('all'); setCategoryFilter('all'); setSearch(''); setSortMode('dueDate');}),
      setCategoryFilter: next => {if (next !== categoryFilter) changeView(() => setCategoryFilter(next));},
      search,
      sortMode,
      visibleTasks,
      completedCount: tasks.filter(task => task.done).length,
      setFilter: next => {if (next !== filter) changeView(() => setFilter(next));},
      setSearch,
      setSortMode: next => {if (next !== sortMode) changeView(() => setSortMode(next));},
      getTask: id => tasks.find(task => task.id === id),
      addTask: async task => {await commit([...tasks, {id: createId(), ...task}]); notify({title: 'Đã thêm công việc', message: `“${task.title}” đã được lưu.`});},
      updateTask: async (id, task) => {await commit(tasks.map(item => item.id === id ? {id, ...task} : item)); notify({title: 'Đã cập nhật công việc', message: `Thay đổi của “${task.title}” đã được lưu.`});},
      toggleTask: async id => {
        const task = tasks.find(item => item.id === id);
        if (!task) return;
        await saveAction(tasks.map(item => item.id === id ? {...item, done: !item.done} : item), `“${task.title}” đã được đánh dấu ${task.done ? 'chưa hoàn thành' : 'hoàn thành'}.`, 'Đã cập nhật trạng thái');
      },
      deleteTask: async id => saveAction(tasks.filter(item => item.id !== id), 'Công việc đã được xoá khỏi danh sách.'),
      deleteCompleted: async () => saveAction(tasks.filter(item => !item.done), `Đã xoá ${tasks.filter(item => item.done).length} công việc hoàn thành.`),
    };
  }, [categoryFilter, filter, loading, saving, filtering, search, sortMode, tasks, changeView, commit, saveAction, notify]);

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside TasksProvider');
  return context;
}
