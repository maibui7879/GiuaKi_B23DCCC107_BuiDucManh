import AsyncStorage from '@react-native-async-storage/async-storage';

import {Task} from '../domain/task';
import {createSeedTasks} from '../utils/taskUtils';

const TASKS_KEY = '@planner/tasks';

export async function loadTasks(): Promise<Task[]> {
  const value = await AsyncStorage.getItem(TASKS_KEY);
  if (!value) {
    const seeds = createSeedTasks();
    await saveTasks(seeds);
    return seeds;
  }
  try {
    return JSON.parse(value) as Task[];
  } catch {
    const seeds = createSeedTasks();
    await saveTasks(seeds);
    return seeds;
  }
}

export function saveTasks(tasks: Task[]) {
  return AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
