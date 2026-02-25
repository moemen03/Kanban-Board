import { Box, Typography, Avatar } from "@mui/material";
import { ViewKanban } from "@mui/icons-material";

export default function BoardHeader({ taskCount }: { taskCount: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar
        variant="rounded"
        sx={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          width: 44, height: 44,
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
        }}
      >
        <ViewKanban sx={{ fontSize: 26, color: "#fff" }} />
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          Kanban Board
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {taskCount} task{taskCount !== 1 && "s"}
        </Typography>
      </Box>
    </Box>
  );
}
