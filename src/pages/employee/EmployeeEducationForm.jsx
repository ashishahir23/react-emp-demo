import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    MenuItem,
    IconButton,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDialog, ToastAlertType, AlertTitle } from "../../context/AppDialogContext";
import { MessageText } from "../../constants/Messages";
import { EmpEducationModel } from "../../models/EmpEducationModel";

import {
    saveEmployeeEducations
} from "../../services/EmployeeEducationService";

import {
    loadDegree
} from "../../services/DegreeService";


const EmployeeEducationForm = ({ empid, education, setEducation }) => {

    const { showToast, showConfirm, showAlert } = useAppDialog();
    const [degreeOptions, setDegreeOptions] = useState([]);

    const fetchDegrees = async () => {
        const data = await loadDegree();
        setDegreeOptions(data);
    };

    useEffect(() => {
        fetchDegrees();
    }, []);   

    const [form, setForm] = useState(new EmpEducationModel({ empid: empid, dgrid: "" }));
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === "dgrid") {
            const degreeItem = degreeOptions.find(item => item.dgrid == e.target.value);
            const dName = degreeItem ? degreeItem.degreename : "Unknown";
            setForm({ ...form, [e.target.name]: e.target.value, degree: dName });
        }
        else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (!form.degree || !form.institute || !form.passingYear) return;

        form["empid"] = Number(empid);
        if (editIndex !== null) {
            const updated = [...education];
            updated[editIndex] = form;
            setEducation(updated);
            setEditIndex(null);
            await saveEmployeeEducations(Number(empid), updated);
            showToast(`${MessageText.SUCCESS_UPDATE}`, ToastAlertType.SUCCESS);
        } else {
            let updated = [];
            if ((education?.length ?? 0) > 0) {
                updated = [...education, form];
            }
            else {
                updated = [{ ...form }];
            }
            setEducation(updated);            
            await saveEmployeeEducations(Number(empid), updated);
            showToast(`${MessageText.SUCCESS_SAVE}`, ToastAlertType.SUCCESS);
        }
        setForm(new EmpEducationModel(empid = empid));
    };

    const handleEdit = (index) => {
        const selectedItem = education[index];
        setForm(selectedItem);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        const updated = education.filter((_, i) => i !== index);
        setEducation(updated);
        await saveEmployeeEducations(Number(empid), updated);
        showToast(`${MessageText.SUCCESS_DELETE}`, ToastAlertType.SUCCESS);
        if (editIndex === index) {
            setEditIndex(null);
            setForm(new EmpEducationModel(empid = empid));
        }
    };

    return (
        <Box>
            <Card sx={{ mb: 3, p: 1 }}>
                <CardContent>
                    <Typography variant="h6" mb={2}>
                        Education Details
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Degree"
                        name="dgrid"
                        value={form.dgrid}
                        onChange={handleChange}
                        sx={{
                            width: "20%",
                            marginBottom: "2%"
                        }}
                    >
                        {degreeOptions.map((d) => (
                            <MenuItem key={d.dgrid} value={String(d.dgrid)}>
                                {d.degreename}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Institute / College"
                        name="institute"
                        value={form.institute}
                        onChange={handleChange}
                        sx={{
                            width: "79%",
                            marginLeft: "1%",
                            marginBottom: "2%"
                        }}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        label="Passing Year"
                        name="passingYear"
                        value={form.passingYear}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                min: 1900,
                                max: new Date().getFullYear(),
                            }
                        }}
                        sx={{
                            width: "20%",
                            marginBottom: "2%"
                        }}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        label="Percentage / CGPA"
                        name="percentage"
                        value={form.percentage}
                        onChange={handleChange}
                        sx={{
                            width: "60%",
                            marginLeft: "1%",
                            marginBottom: "2%"
                        }}
                    />

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleSave}
                        sx={{
                            width: "15%",
                            marginLeft: "2%",
                            marginTop: "1%"
                        }}
                    >
                        {editIndex !== null ? "Update" : "+ Add"}
                    </Button>
                </CardContent>
            </Card>

            {/* List of Education Records */}
            <Card>
                <CardContent>
                    <Typography variant="h6" mb={2}>
                        Saved Records
                    </Typography>

                    {(education?.length ?? 0) === 0 && <Typography>No records added yet.</Typography>}

                    {(education?.length ?? 0) > 0 && education.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                mb: 2,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={12}>
                                    <strong>Degree:</strong> {item.degree}
                                </Grid>
                                <Grid size={12}>
                                    <strong>Institute:</strong> {item.institute}
                                </Grid>
                                <Grid size={5}>
                                    <strong>Year:</strong> {item.passingYear}
                                </Grid>
                                <Grid size={5}>
                                    <strong>Marks:</strong> {item.percentage}
                                </Grid>
                                <Grid size={2}>
                                    <IconButton onClick={() => handleEdit(index)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => {
                                        showConfirm({
                                            title: AlertTitle.CONFIRMATION,
                                            message: MessageText.CONFIRM_DELETE,
                                            onConfirm: async () => {
                                                handleDelete(index);
                                                showToast(MessageText.SUCCESS_DELETE, ToastAlertType.SUCCESS);
                                            },
                                        })
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}

export default EmployeeEducationForm;