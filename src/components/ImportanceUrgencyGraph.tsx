'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { Task } from '@/types';
import TaskListItem from "@/components/TaskListItem";

interface ImportanceUrgencyGraphProps {
  initialTasks: Task[];
}

const getBadgeColor = (status: Task['status']) => {
  switch (status) {
    case 'TODO':
      return '#f44336'; // Red
    case 'In progress':
      return '#2196f3'; // Blue
    case 'Pending':
      return '#ff9800'; // Orange
    case 'Reschedule':
      return '#9e9e9e'; // Grey
    case 'Done':
      return '#4caf50'; // Green
    case "Won't do":
      return '#795548'; // Brown
    default:
      return '#000'; // Black as fallback
  }
};

const ImportanceUrgencyGraph: React.FC<ImportanceUrgencyGraphProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, quadrant: { importance: number, urgency: number }) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...quadrant } : task
    );
    setTasks(newTasks);

    // Update the task in Notion
    await fetch('/api/updateTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...quadrant }),
    });
  };

  const renderQuadrant = (title: string, importance: number, urgency: number) => (
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
            <TaskListItem
                key={task.id}
                task={task}
                handleDragStart={handleDragStart}
            />
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
              <TaskListItem
                  key={task.id}
                  task={task}
                  handleDragStart={handleDragStart}
              />
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
