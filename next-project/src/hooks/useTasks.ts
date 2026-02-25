import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types";
import * as api from "../api/tasks";

export const taskKeys = { all: ["tasks"] as const };

export function useTasks(search = "") {
    return useQuery({
        queryKey: taskKeys.all,
        queryFn: api.getTasks,
        staleTime: 30_000,
        select: (data: Task[]) => {
            if (!search.trim()) return data;
            const term = search.toLowerCase();
            return data.filter((t) =>
                t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term),
            );
        },
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<Task, "id">) => api.createTask(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...rest }: { id: string } & Partial<Omit<Task, "id">>) =>
            api.updateTask(id, rest),
        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.all });
            const snapshot = queryClient.getQueryData<Task[]>(taskKeys.all);
            queryClient.setQueryData<Task[]>(taskKeys.all, (current = []) =>
                current.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
            );
            return { snapshot };
        },
        onError: (_e, _v, context) => {
            if (context?.snapshot) queryClient.setQueryData(taskKeys.all, context.snapshot);
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => api.deleteTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
    });
}
