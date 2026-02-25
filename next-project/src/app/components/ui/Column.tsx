"use client";

import { Paper, Typography, Button, Box, Chip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { TaskColumn as TColumn, ColumnProps } from "../../../types";

const COL_COLORS: Record<TColumn, string> = {
  backlog: "#6366f1",
  in_progress: "#f59e0b",
  review: "#3b82f6",
  done: "#10b981",
};

const PAGE_SIZE = 5;

export default function Column({
  columnKey, label, tasks,
  onAddTask, onEditTask, onDeleteTask,
  draggingId, dragOverId, dragOverColumn,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: ColumnProps) {
  const [shown, setShown] = useState(PAGE_SIZE);

  const visible = tasks.slice(0, shown);
  const remaining = tasks.length - shown;
  const isDropTarget = draggingId != null && dragOverColumn === columnKey;

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1, maxWidth: 340, minHeight: 150,
        bgcolor: "#EBF0F0", borderRadius: 3,
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* header */}
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid #eee" }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: COL_COLORS[columnKey] }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: "var(--font-space-mono), monospace",
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 0.5, fontSize: "0.75rem",
          }}
        >
          {label}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600, bgcolor: "#e8eaed", color: "#5f6368" }}
        />
      </Box>

      {/* cards */}
      <Box
        onDragOver={(e) => { e.preventDefault(); onDragOver(e, columnKey); }}
        onDrop={(e) => { e.preventDefault(); onDrop(columnKey, tasks.length); }}
        sx={{
          flex: 1, overflowY: "auto", p: 1.5,
          bgcolor: isDropTarget ? "rgba(99,102,241,0.06)" : "transparent",
          transition: "background 0.3s cubic-bezier(.4,0,.2,1), min-height 0.3s ease",
          minHeight: 80, borderRadius: 2,
        }}
      >
        {visible.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            draggable
            isDragging={draggingId === task.id}
            isDragOver={dragOverId === task.id}
            onDragStart={(e) => { e.stopPropagation(); onDragStart(task.id, columnKey); }}
            onDragEnd={onDragEnd}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onDragOver(e, columnKey, task.id); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop(columnKey, i); }}
          />
        ))}

        {remaining > 0 && (
          <Button
            size="small" fullWidth
            onClick={() => setShown((n) => n + PAGE_SIZE)}
            sx={{ mt: 1, textTransform: "none", color: "#5f6368", fontSize: "0.75rem" }}
          >
            Load more ({remaining} remaining)
          </Button>
        )}
      </Box>

      {/* footer */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #eee" }}>
        <Button
          fullWidth
          startIcon={<Add />}
          onClick={() => onAddTask(columnKey)}
          sx={{
            textTransform: "none", color: "#5f6368",
            justifyContent: "flex-start", fontSize: "0.8rem",
            "&:hover": { bgcolor: "#eee" },
          }}
        >
          Add task
        </Button>
      </Box>
    </Paper>
  );
}
