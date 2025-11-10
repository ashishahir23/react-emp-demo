import React from "react";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DepartmentModal = ({ open, onClose, deptId, children }) => {
    return (
        <Box sx={{
                    p: 4,
                    mx: "auto",
                    boxShadow: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
        >
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {deptId > 0 ? "Edit Department" : "Add Department"}                    
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>{children}</DialogContent>
            </Dialog>
        </Box>
    );
};

export default DepartmentModal;
