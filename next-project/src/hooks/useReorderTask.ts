import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import * as api from "../api/tasks";
import { taskKeys } from "./useTasks";
import type { Task, TaskColumn, ReorderVars } from "../types";

export function useReorderTask() {
    const queryClient = useQueryClient();
    const tasksToUpdate = useRef<{ id: string; column: [TaskColumn, number] }[]>([]);

    return useMutation({
        mutationFn: async (_variables: ReorderVars) => {
            await Promise.all(
                tasksToUpdate.current.map((entry) =>
                    api.updateTask(entry.id, { column: entry.column }),
                ),
            );
        },

        onMutate: async ({ itemId, toCol, toIndex }: ReorderVars) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.all });
            const snapshot = queryClient.getQueryData<Task[]>(taskKeys.all);

            queryClient.setQueryData<Task[]>(taskKeys.all, (current) => {
                if (!current) return current;
                const copy = structuredClone(current);

                const draggedTask = copy.find((t) => t.id === itemId);
                if (!draggedTask) return current;

                const sourceCol = draggedTask.column[0];
                const sourcePos = draggedTask.column[1];

                // shift items in the source column to fill the gap
                copy.forEach((t) => {
                    if (t.id !== itemId && t.column[0] === sourceCol && t.column[1] > sourcePos) {
                        t.column = [t.column[0], t.column[1] - 1];
                    }
                });

                // shift items in the destination column to make room
                copy.forEach((t) => {
                    if (t.id !== itemId && t.column[0] === toCol && t.column[1] >= toIndex) {
                        t.column = [t.column[0], t.column[1] + 1];
                    }
                });

                draggedTask.column = [toCol as TaskColumn, toIndex];

                // collect everything that actually changed position
                const diff: typeof tasksToUpdate.current = [];
                copy.forEach((t) => {
                    const original = current.find((o) => o.id === t.id);
                    if (!original) return;
                    if (original.column[0] !== t.column[0] || original.column[1] !== t.column[1]) {
                        diff.push({ id: t.id, column: t.column });
                    }
                });
                tasksToUpdate.current = diff;

                return copy;
            });

            return { snapshot };
        },

        onError: (_error, _variables, context) => {
            if (context?.snapshot) queryClient.setQueryData(taskKeys.all, context.snapshot);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
}
