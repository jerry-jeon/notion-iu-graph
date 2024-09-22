import { Client } from '@notionhq/client';
import { Task } from '@/types';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getTasks(): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0];

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Action Date",
      date: {
        equals: today,
      },
    },
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name.title[0]?.plain_text || 'Untitled',
    importance: page.properties.Importance.select?.name === 'High' ? 1 : -1,
    urgency: page.properties.Urgency.select?.name === 'High' ? 1 : -1,
  }));
}
