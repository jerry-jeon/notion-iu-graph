export interface Task {
  id: string;
  title: string;
  importance: number | undefined;  // 1 for High, -1 for Low, undefined if not set
  urgency: number | undefined;     // 1 for High, -1 for Low, undefined if not set
}