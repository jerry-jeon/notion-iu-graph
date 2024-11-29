'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, List } from '@mui/material';
import { Task } from '@/types';
import TaskListItem from "@/components/TaskListItem";

interface ImportanceUrgencyGraphProps {
  initialTasks: Task[];
}

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
        <Box sx={{ width: '100%', height: '100vh', padding: '16px', boxSizing: 'border-box' }}>
          <Typography variant="h4" gutterBottom>
            Importance-Urgency Graph
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, height: 'calc(100% - 48px)' }}>
            {/* Main Quadrants */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              {/* Top Quadrants */}
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <Box
                    sx={{
                      flex: 1,
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5', // Optional: Add a background color
                      padding: 1,
                      borderRadius: 1,
                    }}
                >
                  {renderQuadrant('Important & Urgent', 1, 1)}
                </Box>
                <Box
                    sx={{
                      flex: 1,
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5',
                      padding: 1,
                      borderRadius: 1,
                    }}
                >
                  {renderQuadrant('Important & Not Urgent', 1, -1)}
                </Box>
              </Box>
              {/* Bottom Quadrants */}
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <Box
                    sx={{
                      flex: 1,
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5',
                      padding: 1,
                      borderRadius: 1,
                    }}
                >
                  {renderQuadrant('Not Important & Urgent', -1, 1)}
                </Box>
                <Box
                    sx={{
                      flex: 1,
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5',
                      padding: 1,
                      borderRadius: 1,
                    }}
                >
                  {renderQuadrant('Not Important & Not Urgent', -1, -1)}
                </Box>
              </Box>
            </Box>
            {/* Undefined List */}
            <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  backgroundColor: '#e1f5fe', // Optional: Different background color for contrast
                  padding: 1,
                  borderRadius: 1,
                }}
            >
              {renderUndefinedList()}
            </Box>
          </Box>
        </Box>
    );
};

export default ImportanceUrgencyGraph;
