import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import type { BoardFiltersProps } from "../../types";

export default function BoardFilters({ search, onSearchChange }: BoardFiltersProps) {
  return (
    <TextField
      placeholder="Search tasks…"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{
        minWidth: 220, bgcolor: "#fff", borderRadius: 2,
        "& .MuiOutlinedInput-root": { borderRadius: 2 },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: 20, color: "#9e9e9e" }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
