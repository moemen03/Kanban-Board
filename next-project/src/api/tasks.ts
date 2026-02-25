import type { Task, TaskColumn, TaskPriority } from "../types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const getPriority = (task: Task): TaskPriority => task.priority ?? "medium";

export const COLUMNS: { key: TaskColumn; label: string }[] = [
    { key: "backlog", label: "Backlog" },
    { key: "in_progress", label: "In Progress" },
    { key: "review", label: "Review" },
    { key: "done", label: "Done" },
];

export async function getTasks(): Promise<Task[]> {
    const res = await fetch(`${BASE}/tasks`);
    if (!res.ok) throw new Error("Couldn't load tasks");
    return res.json();
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
    const res = await fetch(`${BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Task creation failed");
    return res.json();
}

export async function updateTask(
    id: string,
    data: Partial<Omit<Task, "id">>
): Promise<Task> {
    const res = await fetch(`${BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Couldn't update task ${id}`);
    return res.json();
}

export async function deleteTask(id: string): Promise<void> {
    const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Couldn't delete task ${id}`);
}
