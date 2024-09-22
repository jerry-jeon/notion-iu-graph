import { Client } from '@notionhq/client';
import { Task } from '../types';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getTasks(): Promise<Task[]> {
  // Get current date in system timezone
  const now = new Date();

  // Format the date to YYYY-MM-DD in the system timezone
  const today = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).format(now);

  // Get the timezone offset
  const timeZoneOffset = -now.getTimezoneOffset() / 60;
  const timeZoneString = timeZoneOffset >= 0 ? `+${String(timeZoneOffset).padStart(2, '0')}:00` : `-${String(Math.abs(timeZoneOffset)).padStart(2, '0')}:00`;

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Action Date",
          date: {
            on_or_after: today,
          },
        },
        {
          property: "Action Date",
          date: {
            before: `${today}T23:59:59${timeZoneString}`,
          },
        },
      ],
    },
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name.title[0]?.plain_text || 'Untitled',
    importance: page.properties.Importance.select?.name === 'High' ? 1 : -1,
    urgency: page.properties.Urgency.select?.name === 'High' ? 1 : -1,
  }));
}