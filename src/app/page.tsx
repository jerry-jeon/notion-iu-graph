// File: app/page.tsx

import ImportanceUrgencyGraph from '../components/ImportanceUrgencyGraph';
import { getTasks } from '@/lib/notion';

export default async function Home() {
  const tasks = await getTasks();

  return <ImportanceUrgencyGraph initialTasks={tasks} />;
}

