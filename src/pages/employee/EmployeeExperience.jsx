import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppDialog, ToastAlertType, AlertTitle } from "../../context/AppDialogContext";
import { MessageText } from "../../constants/Messages";
import { EmpExperienceModel } from "../../models/EmpExperienceModel";

import {
  saveEmployeeExperiences
} from "../../services/EmployeeExperienceService";

const EmployeeExperience = ({ empid, experience, setExperience }) => {

  const { showToast, showConfirm, showAlert } = useAppDialog();

  const addExperience = () => {
    const newId = experience.length + 1;
    setExperience([
      ...experience,
      new EmpExperienceModel({ empid: Number(empid), expid: newId})
      // {
      //   empid: Number(empid),
      //   expid: newId,
      //   companyName: "",
      //   designation: "",
      //   startDate: null,
      //   endDate: null
      // }
    ]);    
  };

  const updateField = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    updated[index]["empid"] = Number(empid);
    setExperience(updated);
  };

  const handleSave = async (index) => {
    const updated = [...experience];
    if(!updated[index].companyName || !updated[index].designation || !updated[index].startDate || !updated[index].endDate) return;
    
    saveEmployeeExperiences(Number(empid), updated);
    showToast(`${MessageText.SUCCESS_SAVE}`, ToastAlertType.SUCCESS);
  };

  const removeExperience = (index) => {
    const updated = [...experience];
    updated.splice(index, 1);
    setExperience(updated);

    saveEmployeeExperiences(Number(empid), updated);
    showToast(`${MessageText.SUCCESS_DELETE}`, ToastAlertType.SUCCESS);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ marginTop: "-20px" }}>
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Professional Experience
        </Typography>

        {experience.map((exp, index) => (
          <Box
            key={index}
            sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }}
          >
            <Grid container spacing={2}>
              {/* Company Name */}
              <Grid size={12}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={exp.companyName}
                  onChange={(e) =>
                    updateField(index, "companyName", e.target.value)
                  }
                />
              </Grid>

              {/* Designation */}
              <Grid size={12}>
                <TextField
                  label="Designation"
                  fullWidth
                  value={exp.designation}
                  onChange={(e) =>
                    updateField(index, "designation", e.target.value)
                  }
                />
              </Grid>

              {/* Start Date */}
              <Grid size={4}>
                <DatePicker
                  label="Start Date"
                  value={exp.startDate ? new Date(exp.startDate) : null}
                  onChange={(date) => updateField(index, "startDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* End Date */}
              <Grid size={4}>
                <DatePicker
                  label="End Date"
                  value={exp.endDate ? new Date(exp.endDate) : null}
                  onChange={(date) => updateField(index, "endDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Delete Button */}
              <Grid size={4} textAlign="right">
                <Tooltip title="Save Experience">
                  <IconButton variant="outlined" onClick={() => { handleSave(index)}}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Experience">
                  <IconButton color="error" onClick={() => {
                    showConfirm({
                      title: AlertTitle.CONFIRMATION,
                      message: MessageText.CONFIRM_DELETE,
                      onConfirm: async () => {
                        removeExperience(index);
                        showToast(MessageText.SUCCESS_DELETE, ToastAlertType.SUCCESS);
                      },
                    })
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>

              </Grid>
            </Grid>
          </Box>
        ))}

        <Button variant="outlined" onClick={addExperience}>
          + Add
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default EmployeeExperience;