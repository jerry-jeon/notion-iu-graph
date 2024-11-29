import React from 'react';
import { ListItem, ListItemText, Box } from '@mui/material';
import {Task, TaskStatus} from "@/types";

interface TaskListItemProps {
    task: Task;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

// TaskListItem Component
const TaskListItem: React.FC<TaskListItemProps> = ({ task, handleDragStart }) => {
    const getBadgeColor = (status: TaskStatus): string => {
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

    return (
        <ListItem
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            sx={{
                backgroundColor: '#e1f5fe',
                marginBottom: 1,
                borderRadius: 1,
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
            }}
        >
            <ListItemText primary={task.title} />
            <Box
                sx={{
                    backgroundColor: getBadgeColor(task.status),
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8em',
                    fontWeight: 'bold',
                }}
            >
                {task.status}
            </Box>
        </ListItem>
    );
};

export default TaskListItem;