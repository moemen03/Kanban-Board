"use client";

import { Box } from "@mui/material";
import KanbanBoard from "./components/KanbanBoard";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "#f5f5f7" }}>
      <KanbanBoard />
    </Box>
  );
}
