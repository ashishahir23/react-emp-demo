import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box, Stack, Select, MenuItem, Tooltip, InputLabel, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Title from "../../components/Title";
import { MessageText } from '../../constants/Messages';
import { useAppDialog, ToastAlertType } from "../../context/AppDialogContext";
import { EmployeeModel } from "../../models/EmployeeModel";
import { EmpExperienceModel } from "../../models/EmpExperienceModel";
import { formatDate } from "../../utils/DateFormatter";
import RightDrawer from "../../components/RightDrawer";
import DepartmentList from "../department/DepartmentList";
import EmployeeEducationForm from "../employee/EmployeeEducationForm";
import EmployeeExperience from "../employee/EmployeeExperience";


import {
  getStoredEmployeeById,
  saveEmployee,
  updateEmployee
} from "../../services/EmployeeService";

import {
  loadDepartment
} from "../../services/DepartmentService";

import {
  loadEmployeeEducation,
  saveEmployeeEducations
} from "../../services/EmployeeEducationService";

import {
  loadEmployeeExperience,
  saveEmployeeExperiences
} from "../../services/EmployeeExperienceService";

const EmployeeForm = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast, } = useAppDialog();
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState(new EmployeeModel());
  const [departments, setDepartments] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshDeptKey, setRefreshDeptKey] = useState(0);


  const employeeTabs = [
    { id: "basic", label: "Basic", tooltip: "Employee Basic Info" },
    { id: "educt", label: "Education", tooltip: "Employee Education Details" },
    { id: "profile", label: "Profile", tooltip: "Employee Profile Details" }
  ];

  //const [experience, setExperience] = useState([new EmpExperienceModel()]);
  const [experience, setExperience] = useState([
    {
      empid: 0,
      expid: 0,
      companyName: "",
      designation: "",
      startDate: null,
      endDate: null
    }]);
  const [education, setEducation] = useState([]);

  const [activeTabId, setActiveTabId] = useState(employeeTabs[0].id);

  const handleTabChange = (event, newValue) => {
    // Prevent switching disabled tabs
    const clickedTab = employeeTabs.find(t => t.id === newValue);
    const isClickedDisabled = clickedTab && clickedTab.id !== "basic" && !isEdit;
    if (isClickedDisabled) return;
    setActiveTabId(newValue);
  };

  useEffect(() => {
    let emp = getStoredEmployeeById(id);
    if (emp) {
      setIsEdit(true);
      if (emp?.dob) {
        emp.dob = new Date(emp.dob);
      }
      setEmployeeFormData(emp);

      const loadEmpEducation = async () => {
        let empEducation = await loadEmployeeEducation(id);        
        setEducation(empEducation);
      };
      loadEmpEducation();

       const loadEmpExperience = async () => {
        let empExp = await loadEmployeeExperience(id);        
        setExperience(empExp);
      };
      loadEmpExperience();
    }
    else {
      setIsEdit(false);
    }
  }, []);

  // Load departments for the dropdown
  const fetchDepartments = async () => {
    const data = await loadDepartment();
    setDepartments(data);
  };

  // Initial + refresh key based re-fetch
  useEffect(() => {
    fetchDepartments();
  }, [refreshDeptKey]);

  // handle user updated data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle user updated date
  const handleDateChange = (newValue) => {
    setEmployeeFormData((prev) => ({ ...prev, dob: newValue }));
    setErrors((prev) => ({ ...prev, dob: "" }));
  };

  const handleClear = () => {
    setIsEdit(false);
    setEmployeeFormData(new EmployeeModel());
    navigate("/employee/list");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {

      if (isEdit) {
        try {

          let updatedEmployee = employeeFormData;
          updatedEmployee.dob = formatDate(updatedEmployee.dob);
          updateEmployee(updatedEmployee);

          //....
          //saveEmployeeEducations(updatedEmployee.id, education);

          //saveEmployeeExperiences(updatedEmployee.id, experience);

          showToast(`${MessageText.SUCCESS_UPDATE}`, ToastAlertType.SUCCESS);
          navigate("/employee/list");
        }
        catch (error) {
          console.log('error: ', error);
          showToast(`${MessageText.ERROR_UPDATE}`, ToastAlertType.SUCCESS);
        }

      } else {
        // Add new record
        try {

          let newEmployee = employeeFormData;
          newEmployee.dob = formatDate(newEmployee.dob);
          var empId = saveEmployee(newEmployee);

          //saveEmployeeEducations(empId, education);

          //saveEmployeeExperiences(empId, experience);

          showToast(`${MessageText.SUCCESS_SAVE}`, ToastAlertType.SUCCESS);
          navigate("/employee/list");
        } catch {
          showToast(`${MessageText.ERROR_SAVE}`, ToastAlertType.ERROR);
        }
      }
    }
  };

  const validate = () => {
    let temp = {};

    // Birth date validation
    if (!employeeFormData.dob) {
      temp.dob = "Birth date is required";
    } else if (isNaN(new Date(employeeFormData.dob).getTime())) {
      temp.dob = "Invalid birth date";
    }

    // Phone validation
    if (!employeeFormData.phone) {
      temp.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(employeeFormData.phone)) {
      temp.phone = "Phone must be 10 digits only";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };
  
  return (
    <>
      <Box sx={{
        p: 4,
        maxWidth: 750,
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>

        {/* Title */}
        <Title text={"Employee"} isEdit={isEdit} />

        <Tabs value={activeTabId} onChange={handleTabChange}>
          {employeeTabs.map((t) => {

            const isDisabled = t.id !== "basic" && !isEdit ? true : false;
            const tooltipText = isDisabled ? "You must save record before accessing this tab" : t.tooltip;

            return (
              <Tab
                key={t.id}
                value={t.id}
                label={
                  <Tooltip title={tooltipText} arrow>
                    <span>{t.label}</span>
                  </Tooltip>
                }
              />
            );
          })}
        </Tabs>

        {/* Tab Panels */}
        {activeTabId === "basic" &&
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit}
              sx={{
                p: 4,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: "-20px"
              }}
            >
              {/* First Name */}
              <TextField
                label="First Name"
                placeholder="Enter First name"
                name="fname"
                autoComplete="given-name"
                value={employeeFormData.fname}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Last Name */}
              <TextField
                label="Last Name"
                name="lname"
                autoComplete="family-name"
                placeholder="Enter Last name"
                value={employeeFormData.lname}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Email */}
              <TextField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter Email"
                autoComplete="email"
                fullWidth
                value={employeeFormData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />

              {/* Phone number */}
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                autoComplete="tel"
                fullWidth
                value={employeeFormData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                slotProps={{
                  input: {
                    maxLength: 10,
                  },
                }}
              />

              {/* Add your date picker here */}
              <DatePicker
                label="Birth Date"
                value={employeeFormData.dob}
                onChange={handleDateChange}
                placeholder="Select Birth Date"
                format="yyyy-MM-dd"
                error={!!errors.dob}
                helperText={errors.dob}
                disableFuture
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: 'outlined',
                    helperText: 'DOB cannot be a future date',
                  },
                }}
              />

              <FormControl fullWidth variant="outlined">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    label="Department"
                    id="deptid"
                    name="deptid"
                    value={employeeFormData.deptid}
                    onChange={handleChange}
                    sx={{ width: "90%", }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Tooltip title="Add Department">
                    <Button
                      variant="contained"
                      startIcon={<OpenInNewIcon fontSize="small" />}
                      onClick={() => setDrawerOpen(true)}
                      sx={{ width: "10%", paddingRight: "1px;" }}
                      color="primary"
                    >
                    </Button>
                  </Tooltip>
                </Box>
              </FormControl>

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
          </LocalizationProvider>
        }
        {activeTabId === "educt" &&
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: "-30px"
            }}>
            <EmployeeEducationForm empid={id} education={education} setEducation={setEducation} />
          </Box>
        }
        {activeTabId === "profile" &&
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: "-55px"
            }}>
            <EmployeeExperience empid={id} experience={experience} setExperience={setExperience} />
          </Box>
        }
      </Box>


      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Department List"
        width={750}
      >
        <DepartmentList openInModal={true} onDepartmentItemChange={() => { setRefreshDeptKey((prev) => prev + 1); }} />
      </RightDrawer>

    </>
  )
};

export default EmployeeForm