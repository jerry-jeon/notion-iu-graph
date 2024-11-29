export type TaskStatus = 'TODO' | 'In progress' | 'Pending' | 'Reschedule' | 'Done' | 'Won\'t do';

export interface Task {
  id: string;
  title: string;
  importance: number | undefined;  // 1 for High, -1 for Low, undefined if not set
  urgency: number | undefined;     // 1 for High, -1 for Low, undefined if not set
  status: TaskStatus;
}