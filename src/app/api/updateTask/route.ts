// File: app/api/updateTask/route.ts

import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function POST(request: Request) {
  const { id, importance, urgency } = await request.json();

  try {
    await notion.pages.update({
      page_id: id,
      properties: {
        Importance: {
          select: {
            name: importance === 1 ? 'High' : 'Low',
          },
        },
        Urgency: {
          select: {
            name: urgency === 1 ? 'High' : 'Low',
          },
        },
      },
    });

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating Notion page:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}