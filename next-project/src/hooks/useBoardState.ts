import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "./useTasks";
import type { Task, TaskColumn } from "../types";

export function useBoardState() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: tasks = [], isLoading } = useTasks(searchTerm);

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [targetColumn, setTargetColumn] = useState<TaskColumn>("backlog");

    const columns: Record<TaskColumn, Task[]> = {
        backlog: [], in_progress: [], review: [], done: [],
    };

    tasks.forEach((task) => {
        const col = task.column[0];
        if (columns[col]) columns[col].push(task);
    });

    // sort each column by the position index
    (Object.keys(columns) as TaskColumn[]).forEach((key) => {
        columns[key].sort((a, b) => a.column[1] - b.column[1]);
    });

    const openCreateDialog = (col: TaskColumn) => {
        setTaskToEdit(null);
        setTargetColumn(col);
        setIsDialogOpen(true);
    };

    const openEditDialog = (task: Task) => {
        setTaskToEdit(task);
        setIsDialogOpen(true);
    };

    const removeTask = (id: string) => deleteMutation.mutate(id);

    return {
        searchTerm,
        setSearchTerm,
        tasks,
        isLoading,
        createMutation,
        updateMutation,
        columns,
        isDialogOpen,
        setIsDialogOpen,
        taskToEdit,
        targetColumn,
        openCreateDialog,
        openEditDialog,
        removeTask,
    };
}
