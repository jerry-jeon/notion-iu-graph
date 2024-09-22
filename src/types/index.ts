export interface Task {
  id: string;
  title: string;
  importance: number;  // 1 for High, -1 for Low
  urgency: number;     // 1 for High, -1 for Low
}