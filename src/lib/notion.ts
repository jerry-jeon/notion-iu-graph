import { Client } from '@notionhq/client';
import { Task } from '../types';

// Use .env.local
let dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

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
    importance: mapImportance(page.properties.Importance?.select?.name),
    urgency: mapUrgency(page.properties.Urgency?.select?.name),
  }));
}

function mapImportance(value: string | undefined): number | undefined {
  if (value === 'High') return 1;
  if (value === 'Low') return -1;
  return undefined;
}

function mapUrgency(value: string | undefined): number | undefined {
  if (value === 'High') return 1;
  if (value === 'Low') return -1;
  return undefined;
}