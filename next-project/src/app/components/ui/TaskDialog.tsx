"use client";

import {
  Dialog, DialogContent, TextField,
  Button, Box, Typography, IconButton,
  ToggleButton, ToggleButtonGroup, Alert, alpha,
} from "@mui/material";
import { Close, AddTask, EditNote } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getPriority } from "../../../api/tasks";
import type { TaskColumn, TaskPriority, TaskDialogProps } from "../../../types";

const COL_META: Record<TaskColumn, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "#6366f1" },
  in_progress: { label: "In Progress", color: "#f59e0b" },
  review: { label: "Review", color: "#3b82f6" },
  done: { label: "Done", color: "#10b981" },
};

export default function TaskDialog({
  open, onClose, onSubmit,
  initial, defaultColumn = "backlog",
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [error, setError] = useState<string | null>(null);

  const col = initial ? initial.column[0] : defaultColumn;
  const meta = COL_META[col];
  const isEdit = !!initial;

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDesc(initial?.description ?? "");
    setPriority(initial ? getPriority(initial) : "medium");
    setError(null);
  }, [open, initial]);

  async function handleSave() {
    if (!title.trim()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: desc.trim(),
        column: col,
        priority,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, bgcolor: "#fafafa",
      "&.Mui-focused": { bgcolor: "#fff" },
    },
  };

  return (
    <Dialog
      open={open} onClose={onClose}
      maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      {/* header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${meta.color}, ${alpha(meta.color, 0.7)})`,
          px: 3, py: 2.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isEdit ? <EditNote sx={{ color: "#fff", fontSize: 26 }} /> : <AddTask sx={{ color: "#fff", fontSize: 26 }} />}
          <Box>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
              {isEdit ? "Edit Task" : "New Task"}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.85) }}>
              {meta.label}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: alpha("#fff", 0.8), "&:hover": { color: "#fff" } }}>
          <Close />
        </IconButton>
      </Box>

      {/* form fields */}
      <DialogContent sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#555", mb: 0.5, display: "block" }}>
            Title *
          </Typography>
          <TextField
            placeholder="What needs to be done?"
            value={title} onChange={(e) => setTitle(e.target.value)}
            fullWidth autoFocus size="small" sx={inputSx}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#555", mb: 0.5, display: "block" }}>
            Description
          </Typography>
          <TextField
            placeholder="Add details about this task…"
            value={desc} onChange={(e) => setDesc(e.target.value)}
            fullWidth multiline rows={3} size="small" sx={inputSx}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#555", mb: 0.5, display: "block" }}>
            Priority
          </Typography>
          <ToggleButtonGroup
            value={priority} exclusive
            onChange={(_, v) => { if (v) setPriority(v); }}
            fullWidth size="small"
            sx={{
              "& .MuiToggleButton-root": { fontWeight: 600, textTransform: "none", py: 0.75 },
              "& .Mui-selected": { color: "#fff !important" },
            }}
          >
            <ToggleButton value="high" sx={{ "&.Mui-selected": { bgcolor: "#ef4444 !important" } }}>High</ToggleButton>
            <ToggleButton value="medium" sx={{ "&.Mui-selected": { bgcolor: "#f59e0b !important" } }}>Medium</ToggleButton>
            <ToggleButton value="low" sx={{ "&.Mui-selected": { bgcolor: "#10b981 !important" } }}>Low</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </DialogContent>

      {/* actions */}
      <Box sx={{ px: 3, pb: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", color: "#666", borderRadius: 2, px: 3, "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave} variant="contained" disabled={!title.trim()}
            sx={{
              textTransform: "none", borderRadius: 2, px: 3, fontWeight: 600,
              bgcolor: meta.color,
              boxShadow: `0 4px 12px ${alpha(meta.color, 0.35)}`,
              "&:hover": {
                bgcolor: meta.color,
                boxShadow: `0 6px 16px ${alpha(meta.color, 0.45)}`,
              },
            }}
          >
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
