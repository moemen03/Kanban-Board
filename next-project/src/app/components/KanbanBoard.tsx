"use client";

import { useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Column from "./ui/Column";
import TaskDialog from "./ui/TaskDialog";
import { useBoardState } from "../../hooks/useBoardState";
import { useReorderTask } from "../../hooks/useReorderTask";
import BoardHeader from "./BoardHeader";
import BoardFilters from "./BoardFilters";
import { COLUMNS } from "../../api/tasks";
import type { TaskPriority, TaskColumn } from "../../types";

export default function KanbanBoard() {
  const {
    searchTerm, setSearchTerm,
    tasks, isLoading,
    columns,
    isDialogOpen, setIsDialogOpen,
    taskToEdit, targetColumn,
    openCreateDialog, openEditDialog,
    removeTask,
    createMutation, updateMutation,
  } = useBoardState();

  const reorder = useReorderTask();

  const dragSource = useRef<{ itemId: string; fromCol: string } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<TaskColumn | null>(null);

  function handleDragStart(taskId: string, col: TaskColumn) {
    dragSource.current = { itemId: taskId, fromCol: col };
    setDraggingId(taskId);
  }

  function handleDragOver(_e: React.DragEvent, col: TaskColumn, taskId?: string) {
    setHoveredTaskId(taskId ?? null);
    setHoveredColumn(col);
  }

  function handleDrop(toCol: TaskColumn, toIndex: number) {
    const src = dragSource.current;
    if (!src) return;

    const { itemId, fromCol } = src;

    if (fromCol === toCol) {
      const colTasks = columns[toCol] ?? [];
      const currentIdx = colTasks.findIndex((t) => t.id === itemId);

      if (currentIdx === toIndex || (toIndex === colTasks.length && currentIdx === colTasks.length - 1)) {
        dragSource.current = null;
        setDraggingId(null);
        setHoveredTaskId(null);
        return;
      }

      if (currentIdx < toIndex) toIndex--;
    }

    reorder.mutate({ itemId, fromCol, toCol, toIndex });
    resetDragState();
  }

  function resetDragState() {
    dragSource.current = null;
    setDraggingId(null);
    setHoveredTaskId(null);
    setHoveredColumn(null);
  }

  async function handleDialogSubmit(data: {
    title: string;
    description: string;
    column: string;
    priority: TaskPriority;
  }) {
    const colTasks = columns[data.column as keyof typeof columns] ?? [];

    if (taskToEdit) {
      await updateMutation.mutateAsync({
        id: taskToEdit.id,
        title: data.title,
        description: data.description,
        column: [data.column as TaskColumn, taskToEdit.column[1]],
        priority: data.priority,
      });
    } else {
      await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        column: [data.column as TaskColumn, colTasks.length],
        priority: data.priority,
      });
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4, flexWrap: "wrap", gap: 2,
          px: { xs: 3, md: 5 }, py: 3,
          bgcolor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <BoardHeader taskCount={tasks.length} />
        <BoardFilters search={searchTerm} onSearchChange={setSearchTerm} />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2, alignItems: "flex-start" }}>
            {COLUMNS.map((col) => (
              <Column
                key={col.key}
                columnKey={col.key}
                label={col.label}
                tasks={columns[col.key]}
                onAddTask={openCreateDialog}
                onEditTask={openEditDialog}
                onDeleteTask={removeTask}
                draggingId={draggingId}
                dragOverId={hoveredTaskId}
                dragOverColumn={hoveredColumn}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={resetDragState}
              />
            ))}
          </Box>
        )}
      </Box>

      <TaskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        initial={taskToEdit}
        defaultColumn={targetColumn}
      />
    </Box>
  );
}
