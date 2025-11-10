import React from "react";
import {
    Box,
    Select,
    MenuItem,
    Typography,
    IconButton
} from "@mui/material";
import { ArrowBack, ArrowBackIosNew, ArrowForwardIos, ArrowForward } from "@mui/icons-material";

export default function GridPagination({
    totalRows,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange
}) {
    const totalPages = Math.ceil(totalRows / pageSize);
    const startRow = (page - 1) * pageSize + 1;
    const endRow = Math.min(startRow + pageSize - 1, totalRows);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                p: 1.5,
                borderTop: "1px solid #ddd",
                backgroundColor: "#fafafa"                
            }}
        >
            {/* Rows per page selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="textSecondary">
                    Rows per page:
                </Typography>
                <Select
                    name = "gridPageSize"
                    size="small"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    sx={{ height: 30 }}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>

                {/* Display "x–y of z" */}
                <Typography variant="body2" color="textSecondary" sx={{ mx: 1, minWidth: "100px" }}>
                    {totalRows > 0 ? `${startRow}–${endRow} of ${totalRows}` : "0 of 0"}
                </Typography>

                {/* Navigation arrows */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        size="small"
                        sx={{ width:"20px" }}
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        <ArrowBackIosNew fontSize="small" />
                    </IconButton>

                    <Typography variant="body2" sx={{ display: "flex", mx: 1 }}>
                        {page} / {totalPages || 1}
                    </Typography>

                    <IconButton
                        size="small"
                        sx={{ width:"20px" }}
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <ArrowForwardIos fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}