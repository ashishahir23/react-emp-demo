import React from "react";
import { Drawer, Box, IconButton, Typography, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RightDrawer = ({ open, onClose, title, children, width = 400 }) => {  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width,
            p: 2,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            boxShadow: 6,
          },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            aria-label="Close Drawer"
            sx={{
              color: "secondary.main",               
              backgroundColor: "#fff",             
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ overflowY: "auto" }}>{children}</Box>
    </Drawer>
  );
};

export default RightDrawer;
