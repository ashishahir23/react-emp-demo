import React from "react";
import { useNavigate } from "react-router-dom";
import AppDataGrid from "../../components/AppDataGrid";
import {
  getEmployeeGridData,
  deleteEmployee,
  deleteMultipleEmployees
} from "../../services/EmployeeService";

export default function EmployeeList() {
  
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", sortable: true, type: 'number', align: "left", headerAlign: "left", headerClassName: "grid-header-cell" },
    { field: "fname", headerName: "First Name", sortable: true, flex: 1, headerClassName: "grid-header-cell" },
    { field: "lname", headerName: "Last Name", sortable: true, flex: 1, headerClassName: "grid-header-cell" },
    { field: "email", headerName: "Email", sortable: true, flex: 1, headerClassName: "grid-header-cell" },
    { field: "phone", headerName: "Phone", sortable: true, flex: 1, type: 'number', align: "left", headerAlign: "left", headerClassName: "grid-header-cell" },
    { field: "dob", headerName: "DOB", sortable: true, flex: 1, headerClassName: "grid-header-cell" },
    { field: "departmentname", headerName: "Department", sortable: true, flex: 1, headerClassName: "grid-header-cell" }
  ]

  const handleAdd = () => {
    navigate(`/employee/add`);
  };

  const handleEdit = (emp) => {
    navigate(`/employee/edit/${emp.id}`);
  };

  const handleDelete = async (emp) => {
    await deleteEmployee(emp.id);
  };

  const handleDeleteAll = async (ids) => {
    await deleteMultipleEmployees(ids);
  };

  return (
    <>
      <AppDataGrid
        title={"Employee List"}
        fetchData={getEmployeeGridData}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}      
      />
    </>
  );
}
