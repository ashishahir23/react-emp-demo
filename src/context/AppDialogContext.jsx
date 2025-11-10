import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

// Create context
const AppDialogContext = createContext();

// Create provider component
export const AppDialogProvider = ({ children }) => {

  // --- Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
    autoHideDuration: 5000
  });

  // --- Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // --- Simple alert dialog state
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  // show toast
  const showToast = useCallback((message, type = "success", autoHideDuration = 5000) => {
    setToast({ open: true, message: message, type: type, autoHideDuration: autoHideDuration });
  }, []);

  // --- Show Delete Confirmation
  const showConfirm = useCallback(({title, message, onConfirm}) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  }, []);

  // --- Show Simple Alert
  const showAlert = useCallback((title, message) => {
    setAlertDialog({ open: true, title, message });
  }, []);

  // --- Close handlers
  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));
  const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, open: false }));
  const closeAlert = () => setAlertDialog((prev) => ({ ...prev, open: false }));

  return (
    <AppDialogContext.Provider value={{ showToast, showConfirm, showAlert  }}>
      {children}

      {/* Snackbar (Toast) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.autoHideDuration}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.type} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={closeConfirm}>
        <DialogTitle>{confirmDialog.title || "Confirm Action"}</DialogTitle>
        <DialogContent>{confirmDialog.message || "Are you sure?"}</DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} variant="contained" >Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              confirmDialog.onConfirm?.();
              closeConfirm();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simple Alert Dialog */}
      <Dialog open={alertDialog.open} onClose={closeAlert}>
        <DialogTitle>{alertDialog.title || "Alert"}</DialogTitle>
        <DialogContent>{alertDialog.message}</DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} autoFocus variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AppDialogContext.Provider>
  );
};

// Hook for easy access
export const useAppDialog = () => useContext(AppDialogContext);

export const ToastAlertType = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  INFORMATION: 'info',
  WARNING: 'warning.'
});


export const AlertTitle = Object.freeze({
  CONFIRMATION: 'Confirm Action',
  ALERT: 'Alert',
  INFORMATION: 'Information',
  WARNING: 'Warning',
  ERROR: 'Error',
  LOGOUT_CONFIRMATION:'Logout Confirmation'
});
