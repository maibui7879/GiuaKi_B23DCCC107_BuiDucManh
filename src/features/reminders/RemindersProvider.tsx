import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTasks} from '../tasks/presentation/hooks/useTasks';
import {daysUntil, formatDate} from '../tasks/utils/taskUtils';
import {Task} from '../tasks/domain/task';

type Reminder = {id: string; task: Task; days: number; read: boolean};
type Store = {reminders: Reminder[]; unreadCount: number; loading: boolean; markRead: (ids: string[]) => void};
const Context = createContext<Store>({reminders: [], unreadCount: 0, loading: true, markRead: () => {}});
const key = '@planner/reminders/read';

export function RemindersProvider({children}: React.PropsWithChildren) {
  const {tasks, loading: tasksLoading} = useTasks();
  const [today, setToday] = useState(() => formatDate(new Date()));
  const [readIds, setReadIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const readRef = useRef<string[]>([]);
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then(value => {
      const parsed: unknown = value ? JSON.parse(value) : [];
      const ids = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
      if (active) {readRef.current = ids; setReadIds(ids);}
    }).catch(() => Alert.alert('Không tải được thông báo đã đọc', 'Bạn vẫn có thể xem các công việc sắp đến hạn.')).finally(() => {if (active) setReady(true);});
    const refresh = () => setToday(formatDate(new Date()));
    const timer = setInterval(refresh, 60000);
    const listener = AppState.addEventListener('change', state => {if (state === 'active') refresh();});
    return () => {active = false; clearInterval(timer); listener.remove();};
  }, []);
  const reminders = useMemo(() => tasks.flatMap(task => {
    const days = daysUntil(task.dueDate);
    if (task.done || days === null || days < 0 || days > 3) return [];
    const id = JSON.stringify([task.id, task.dueDate, today]);
    return [{id, task, days, read: readIds.includes(id)}];
  }).sort((a, b) => a.days - b.days || a.task.title.localeCompare(b.task.title)), [tasks, readIds, today]);
  const markRead = useCallback((ids: string[]) => {
    if (!ready) return;
    const next = [...new Set([...readRef.current, ...ids])].slice(-1000);
    readRef.current = next;
    setReadIds(next);
    writes.current = writes.current.then(() => AsyncStorage.setItem(key, JSON.stringify(next))).catch(() => Alert.alert('Không lưu được trạng thái đã đọc', 'Vui lòng thử lại.'));
  }, [ready]);
  return <Context.Provider value={{reminders, unreadCount: ready ? reminders.filter(item => !item.read).length : 0, loading: !ready || tasksLoading, markRead}}>{children}</Context.Provider>;
}
export const useReminders = () => useContext(Context);
