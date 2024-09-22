// Define a type for the pages
interface Page {
  id: string;
  title: string;
  urgency: number;
  importance: number;
}

const fakePages: Page[] = [
  {
    id: '1',
    title: 'Task 1',
    urgency: 1,
    importance: 1
  },
  {
    id: '2',
    title: 'Task 3',
    urgency: 1,
    importance: 1,
  },
  {
    id: '3',
    title: 'qwe',
    urgency: 1,
    importance: -1
  },
  {
    id: '4',
    title: 'asd',
    urgency: 1,
    importance: -1,
  },
  {
    id: '5',
    title: 'Task 1',
    urgency: -1,
    importance: -1
  },
  {
    id: '6',
    title: 'Task 3',
    urgency: -1,
    importance: 1,
  },
  {
    id: '7',
    title: 'Task 2',
    urgency: -1,
    importance: 1,
  },
  {
    id: '8',
    title: 'UD#1',
    urgency: 0,
    importance: 0,
  },
  {
    id: '9',
    title: 'UD#2',
    urgency: 0,
    importance: 0,
  },
  {
    id: '10',
    title: 'UD#3',
    urgency: 0,
    importance: 0,
  },
];

export type { Page };
export { fakePages };