export type TaskColumn = "backlog" | "in_progress" | "review" | "done";

export type TaskPriority = "high" | "medium" | "low";

export interface Task {
    id: string;
    title: string;
    description: string;
    column: [TaskColumn, number];
    priority?: TaskPriority;
}

export interface ReorderVars {
    itemId: string;
    fromCol: string;
    toCol: string;
    toIndex: number;
}

export interface ColumnProps {
    columnKey: TaskColumn;
    label: string;
    tasks: Task[];
    onAddTask: (col: TaskColumn) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    draggingId: string | null;
    dragOverId: string | null;
    dragOverColumn: TaskColumn | null;
    onDragStart: (taskId: string, col: TaskColumn) => void;
    onDragOver: (e: React.DragEvent, col: TaskColumn, taskId?: string) => void;
    onDrop: (col: TaskColumn, idx: number) => void;
    onDragEnd: () => void;
}

export interface TaskCardProps {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    draggable?: boolean;
    isDragging?: boolean;
    isDragOver?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
}

export interface TaskDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; column: TaskColumn; priority: TaskPriority }) => Promise<void> | void;
    initial?: Task | null;
    defaultColumn?: TaskColumn;
}

export interface BoardFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
}
