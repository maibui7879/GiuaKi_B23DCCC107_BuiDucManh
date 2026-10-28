import {Priority, Task} from '../domain/task';

export function dateToKey(date: Date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function formatDate(date: Date) {
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map((part, index) => (index < 2 ? String(part).padStart(2, '0') : String(part)))
    .join('/');
}

export function parseDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function todayKey() {
  return dateToKey(new Date());
}

export function isOverdue(task: Task) {
  const date = parseDate(task.dueDate);
  return !task.done && !!date && dateToKey(date) < todayKey();
}

export function daysUntil(value: string) {
  const date = parseDate(value);
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86400000);
}

export function dueLabel(value: string) {
  const days = daysUntil(value);
  if (days === null) return 'Ngày không hợp lệ';
  if (days === 0) return 'Hạn hôm nay';
  if (days > 0) return `Còn ${days} ngày`;
  return `Quá hạn ${Math.abs(days)} ngày`;
}

export function priorityRank(priority: Priority) {
  return {Cao: 0, 'Trung bình': 1, Thấp: 2}[priority];
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function relativeDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
}

export function createSeedTasks(): Task[] {
  return [
    {id: 'seed-1', title: 'Ôn tập React Native', note: 'Ôn lại navigation và hooks.', category: 'Học tập', priority: 'Cao', dueDate: relativeDate(1), done: false},
    {id: 'seed-2', title: 'Nộp báo cáo tuần', note: 'Kiểm tra lại nội dung trước khi gửi.', category: 'Công việc', priority: 'Cao', dueDate: relativeDate(3), done: false},
    {id: 'seed-3', title: 'Đi bộ 30 phút', note: 'Đi bộ sau giờ học.', category: 'Sức khoẻ', priority: 'Thấp', dueDate: relativeDate(0), done: true},
    {id: 'seed-4', title: 'Mua đồ dùng cá nhân', note: '', category: 'Cá nhân', priority: 'Trung bình', dueDate: relativeDate(5), done: false},
    {id: 'seed-5', title: 'Hoàn thành bài tập cũ', note: 'Việc mẫu để kiểm tra trạng thái quá hạn.', category: 'Học tập', priority: 'Trung bình', dueDate: relativeDate(-2), done: false},
    {id: 'seed-6', title: 'Gọi điện cho gia đình', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: relativeDate(2), done: false},
  ];
}
