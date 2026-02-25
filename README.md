# Kanban Board

A Kanban-style task management board built with **Next.js**, **Material UI**, and **React Query**, backed by a simple **JSON Server** API.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![MUI](https://img.shields.io/badge/MUI-7-blue) ![React Query](https://img.shields.io/badge/React_Query-5-red)

---

## Features

- Drag & drop tasks between columns (Backlog → In Progress → Review → Done)
- Create, edit, and delete tasks
- Priority levels (High / Medium / Low)
- Search/filter across all tasks
- Optimistic UI updates — the board reacts instantly, syncs with the server in the background
- Lazy-loaded columns with "Load more" pagination

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Assesment_Task
```

### 2. Start the JSON Server (backend)

```bash
cd json-server
npm install
npm run start
```

This fires up a REST API on `http://localhost:4000` using `db.json` as the data store.

### 3. Start the Next.js app (frontend)

Open another terminal:

```bash
cd next-project
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

> **Note:** Make sure the JSON server is running first — the frontend expects the API at port 4000.

---

## Project Structure

```
Assesment_Task/
├── json-server/          # Mock REST API
│   ├── db.json           # Task data
│   └── package.json
│
└── next-project/         # Frontend app
    └── src/
        ├── api/          # API client functions
        ├── types/        # Shared TypeScript interfaces
        ├── hooks/        # Custom React hooks
        └── app/
            ├── components/   # UI components
            │   ├── ui/       # Reusable pieces (Column, TaskCard, TaskDialog)
            │   ├── BoardHeader.tsx
            │   ├── BoardFilters.tsx
            │   └── KanbanBoard.tsx
            ├── Providers.tsx
            ├── layout.tsx
            ├── page.tsx
            └── globals.css
```

---

## Changes to Task Data Format

The original task objects in `db.json` were pretty flat — just an id, title, description, and a column string. I changed the format to support two new things:

1. **Priority field.** Each task now has an optional `priority` field (`"high"`, `"medium"`, or `"low"`). If it's missing, the app defaults to `"medium"` so older tasks don't break.

2. **Position ordering.** The `column` field changed from a plain string (like `"backlog"`) to a tuple: `["backlog", 2]`. The second value is the task's position within that column. This way when you reorder tasks via drag & drop, the order actually persists — before this change, tasks would just show up in whatever order the server returned them.

Example of a task in `db.json` now:
```json
{
  "id": "1",
  "title": "Set up project",
  "description": "Initialize repo and install deps",
  "column": ["done", 0],
  "priority": "high"
}
```

---

## The Drag & Drop Flickering Problem

When I first got drag & drop working, the cards would flicker after dropping — they'd snap back to their original spot for a split second, then jump to the correct position. Sometimes it happened two or three times before settling. Really annoying.

The root cause was a race condition: React Query's optimistic update would place the card correctly, but then `onSettled` triggers a refetch, and if the PATCH requests to the server hadn't finished yet, the refetch would bring back stale data and overwrite the optimistic state. That back-and-forth caused the flicker.

**How I fixed it:**

- Cancel in-flight queries in `onMutate` so pending refetches don't overwrite the optimistic state
- Snapshot the cache before mutating for rollback on error
- Batch all affected position changes with `Promise.all` so the server reaches a consistent state fast
- Store drag source info in a `useRef` instead of `useState` to avoid stale closure bugs in the drop handler
- Deep-clone the cache with `structuredClone` instead of mutating in place (React Query wouldn't detect same-reference changes)
