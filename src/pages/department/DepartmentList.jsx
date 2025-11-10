import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppDataGrid from "../../components/AppDataGrid";
import DepartmentModal from "../department/DepartmentModal";
import DepartmentForm from "../department/DepartmentForm";
import {
  getDeparmentGridData,
  deleteDepartment,
  deleteMultipleDepartment
} from "../../services/DepartmentService";



const DepartmentList = ({ openInModal = false, onDepartmentItemChange = null }) => {

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [deptId, setDeptId] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { field: "id", headerName: "ID", sortable: true, flex: 1, type: 'number', align: "left", headerAlign: "left", headerClassName: "grid-header-cell" },
    { field: "name", headerName: "Department Name", sortable: true, flex: 1, headerClassName: "grid-header-cell" },
  ];

  const handleAdd = () => {
    if (openInModal) {
      setDeptId(0);
      setShowForm(true);
    }
    else {
      navigate(`/department/add`);
    }
  };

  const handleEdit = (dept) => {
    if (openInModal) {
      setDeptId(dept.id);
      setShowForm(true);
    }
    else {
      navigate(`/department/edit/${dept.id}`);
    }
  };


  const handleDelete = async (dept) => {
    await deleteDepartment(dept.id);
    onDepartmentItemChange?.();
  };

  const handleDeleteAll = async (ids) => {
    await deleteMultipleDepartment(ids);
    onDepartmentItemChange?.();
  };

  // Called after department save
  const handleDepartmentListRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    onDepartmentItemChange?.();
  };


  return (
    <>
      <AppDataGrid
        title={"Department List"}
        fetchData={getDeparmentGridData}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
        openInModal={openInModal}
        refreshKey={refreshKey}
      />

      {openInModal && (
        <DepartmentModal
          open={showForm}
          onClose={() => setShowForm(false)}
          deptId={deptId}
        >
          <DepartmentForm
            onCancel={() => setShowForm(false)}
            openInModal={openInModal}
            deptId={deptId}
            onRefresh={handleDepartmentListRefresh}
          />
        </DepartmentModal>
      )}
    </>
  );
}

export default DepartmentList;