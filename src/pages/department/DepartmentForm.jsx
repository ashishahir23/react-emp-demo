import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box, Stack } from "@mui/material";

import Title from "../../components/Title";
import { MessageText } from '../../constants/Messages';
import { useAppDialog, ToastAlertType  } from "../../context/AppDialogContext";
import { DepartmentModel } from "../../models/DepartmentModel";

import {
    getStoredDepartmentById,
    saveDepartment,
    updateDepartment
} from "../../services/DepartmentService";

const DepartmentForm = ({ openInModal = false, onCancel = null, onRefresh = null, deptId = 0 }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useAppDialog();
    const [deptFormData, setDeptFormData] = useState(new DepartmentModel());    
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        let dept = getStoredDepartmentById((openInModal ? deptId : id));        
        if (dept) {
            setIsEdit(true);
            setDeptFormData(dept);
        }
        else {
            setIsEdit(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeptFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        if (openInModal) {            
            onCancel();
        }
        else {
            setIsEdit(false);
            setDeptFormData(new DepartmentModel());
            navigate("/department/list");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {            
            try {
                updateDepartment(deptFormData);
                showToast(`${MessageText.SUCCESS_UPDATE}`, ToastAlertType.SUCCESS);

                if (openInModal) {                    
                    onCancel();
                    onRefresh();
                }
                else {
                    navigate("/department/list");
                }
            }
            catch (error) {
                showToast(`${MessageText.ERROR_UPDATE}`, ToastAlertType.SUCCESS);
            }
        } else {            
            try {
                saveDepartment(deptFormData);
                showToast(`${MessageText.SUCCESS_SAVE}`, ToastAlertType.SUCCESS);
                if (openInModal) {
                    onCancel();
                    onRefresh();
                }
                else {
                    navigate("/department/list");
                }
            } catch {
                showToast(`${MessageText.ERROR_SAVE}`, ToastAlertType.ERROR);
            }
        }
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit}
                sx={{
                    p: 4,
                    maxWidth: 550,
                    mx: "auto",
                    boxShadow: !openInModal ? 3 : 0,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                {/* Title */}
                {!openInModal && (
                    <Title text={"Department"} isEdit={isEdit} />
                )}

                {/* Department Name */}
                <TextField
                    label="Department Name"
                    placeholder="Enter Department name"
                    name="name"
                    autoComplete="name"
                    value={deptFormData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                {/* Save/Cancel Button */}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        {isEdit ? "Update" : "Save"}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClear}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </>
    )
};

export default DepartmentForm