import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { Client } from '@notionhq/client';
import config from '../config.json';  // Import the configuration

type ImportanceUrgency = 1 | -1 | undefined;

interface Task {
  id: number;
  title: string;
  importance: ImportanceUrgency;
  urgency: ImportanceUrgency;
}

// Mock function to simulate fetching data from Notion API
const fetchNotionPages = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Task 1', importance: 1, urgency: -1 },
        { id: 2, title: 'Task 2', importance: -1, urgency: 1 },
        { id: 3, title: 'Task 3', importance: 1, urgency: 1 },
        { id: 4, title: 'Task 4', importance: undefined, urgency: undefined },
        { id: 5, title: 'Task 5', importance: -1, urgency: -1 },
      ]);
    }, 1000);
  });
};

// Initializing a client
const notion = new Client({
  auth: config.notion_api_key,
})

const realFetchNotionPages = async (): Promise<Task[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await notion.databases.query({
      database_id: config.notion_db_id,
      filter: {
        property: "Action Date",
        date: {
          equals: today,
        },
      },
    });

    console.log(response)
    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || 'Untitled',
      importance: page.properties.Importance.select?.name === 'High' ? 1 : -1,
      urgency: page.properties.Urgency.select?.name === 'High' ? 1 : -1,
    }));
  } catch (error) {
    console.error('Error fetching Notion pages:', error);
    return [];
  }
};

const ImportanceUrgencyGraph: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    realFetchNotionPages()
  }, []);

  useEffect(() => {
    fetchNotionPages().then(setTasks);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, quadrant: { importance: ImportanceUrgency, urgency: ImportanceUrgency }) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text'));
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...quadrant } : task
    );
    setTasks(newTasks);
  };

  const renderQuadrant = (title: string, importance: ImportanceUrgency, urgency: ImportanceUrgency) => (
    <Card
      sx={{
        height: '100%',
        padding: 2,
        border: '1px solid #ccc',
        boxSizing: 'border-box'
      }}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, { importance, urgency })}
    >
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {tasks.filter(task =>
          task.importance === importance && task.urgency === urgency
        ).map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            style={{
              backgroundColor: '#bbdefb',
              padding: '8px',
              margin: '4px',
              borderRadius: '4px',
              cursor: 'move'
            }}
          >
            {task.title}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderUndefinedList = () => (
    <Card sx={{ height: '100%', padding: 2 }}>
      <CardHeader title="Undefined Tasks" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <List>
          {tasks.filter(task => task.importance === undefined || task.urgency === undefined).map(task => (
            <ListItem
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              sx={{
                backgroundColor: '#e1f5fe',
                marginBottom: 1,
                borderRadius: 1,
                cursor: 'move'
              }}
            >
              <ListItemText primary={task.title} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ width: '100%', height: '100vh', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>Importance-Urgency Graph</Typography>
      <Grid container spacing={2} style={{ height: 'calc(100% - 48px)' }}>
        <Grid item xs={9}>
          <Grid container spacing={2} style={{ height: '100%' }}>
            <Grid item xs={6} style={{ height: '50%' }}>
              {renderQuadrant('Important & Urgent', 1, 1)}
            </Grid>
            <Grid item xs={6} style={{ height: '50%' }}>
              {renderQuadrant('Important & Not Urgent', 1, -1)}
            </Grid>
            <Grid item xs={6} style={{ height: '50%' }}>
              {renderQuadrant('Not Important & Urgent', -1, 1)}
            </Grid>
            <Grid item xs={6} style={{ height: '50%' }}>
              {renderQuadrant('Not Important & Not Urgent', -1, -1)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          {renderUndefinedList()}
        </Grid>
      </Grid>
    </div>
  );
};

export default ImportanceUrgencyGraph;