"use client";

import { Card, CardContent, Typography, IconButton, Box, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getPriority } from "../../../api/tasks";
import type { TaskPriority, TaskCardProps } from "../../../types";

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: "High", color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  low: { label: "Low", color: "#10b981" },
};

export default function TaskCard({
  task, index,
  onEdit, onDelete,
  draggable = false,
  isDragging = false,
  isDragOver = false,
  onDragStart, onDragEnd, onDragOver, onDrop,
}: TaskCardProps) {
  const p = getPriority(task);

  return (
    <Card
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        mb: 1.5, borderRadius: 2,
        boxShadow: isDragging
          ? "0 12px 28px rgba(99,102,241,0.25), 0 4px 10px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.08)",
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging
          ? "scale(1.04) rotate(1.5deg)"
          : isDragOver ? "translateY(6px)" : "none",
        transition: [
          "box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          "opacity 0.25s ease",
          "transform 0.25s cubic-bezier(.4,0,.2,1)",
          "border-color 0.2s ease",
          "margin 0.25s ease",
        ].join(", "),
        cursor: draggable ? "grab" : "default",
        borderTop: isDragOver ? "3px solid #6366f1" : "3px solid transparent",
        mt: isDragOver ? 1 : 0,
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
        "&:hover .task-actions": { opacity: 1 },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "var(--font-space-mono), monospace",
              fontWeight: 600, flex: 1, mr: 1, fontSize: "0.95rem",
            }}
          >
            {task.title}
          </Typography>

          <Box
            className="task-actions"
            sx={{ opacity: 0, transition: "opacity 0.2s ease", display: "flex", gap: 0.5, ml: "auto" }}
          >
            <IconButton
              size="small" onClick={() => onEdit(task)}
              sx={{ transition: "background 0.2s, transform 0.15s", "&:hover": { transform: "scale(1.15)" } }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small" color="error" onClick={() => onDelete(task.id)}
              sx={{ transition: "background 0.2s, transform 0.15s", "&:hover": { transform: "scale(1.15)" } }}
            >
              <Delete sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.8rem", mb: 1 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ mt: task.description ? 0 : 1.5, display: "flex" }}>
          <Chip
            size="small"
            label={PRIORITY_CONFIG[p].label}
            sx={{
              bgcolor: PRIORITY_CONFIG[p].color,
              color: "#fff", fontWeight: 600,
              fontSize: "0.7rem", height: 20,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
