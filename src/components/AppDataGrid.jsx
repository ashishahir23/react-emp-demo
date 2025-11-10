import React, { useState, useEffect } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { Box, Button, Stack, IconButton, TextField, Tooltip, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDialog, ToastAlertType, AlertTitle } from "../context/AppDialogContext";
import { MessageText } from "../constants/Messages";
import Papa from "papaparse";

export default function AppDataGrid({ title, columns, fetchData,
    onAdd, onEdit, onDelete, onDeleteAll,
    refreshKey,
    pageSizeOptions = [5, 10, 20, 50, 100],
    initialPageSize = 10,
    openInModal = false,
    defaultSortField = "id",
    defaultSortOrder = "asc",
}) {

    const { showToast, showConfirm, showAlert } = useAppDialog();

    const [rows, setRows] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState(undefined);
    const [total, setTotal] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: initialPageSize });
    const [sortModel, setSortModel] = useState([]);
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {

            // wait for some time to display loader
            await new Promise(resolve => setTimeout(resolve, 1000));

            const sortField = sortModel[0]?.field || defaultSortField;
            const sortOrder = sortModel[0]?.sort || defaultSortOrder;
            const filters = filterModel.items.map((f) => ({
                field: f.field,
                operator: f.operator,
                value: f.value,
            }));

            const result = await fetchData({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                sortField,
                sortOrder,
                globalFilter: searchText,
                filters
            });

            setRows(result.data);
            setTotal(result.total);
        } catch (err) {
            showToast("Failed to load data", AlertTitle.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const getExportData = async () => {
        let result = [];
        setLoading(true);
        try {
            const sortField = sortModel[0]?.field || defaultSortField;
            const sortOrder = sortModel[0]?.sort || defaultSortOrder;
            const filters = filterModel.items.map((f) => ({
                field: f.field,
                operator: f.operator,
                value: f.value,
            }));

            result = await fetchData({
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                sortField,
                sortOrder,
                filters,
                isExport: true
            });

        } catch (err) {
            showToast("Failed to export data", AlertTitle.ERROR);
        } finally {
            setLoading(false);
        }
        return result;
    };

    useEffect(() => {
        loadData();
    }, [paginationModel, sortModel, filterModel, searchText, refreshKey]);

    const handlExport = async () => {
        var result = await getExportData();
        const csv = Papa.unparse(result);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${title.replace(/\s+/g, "_")}_export.csv`;
        link.click();
    };

    // 🔹 Add an Action column if onEdit or onDelete exists
    const actionColumn = {
        field: "actions",
        headerName: "Actions",
        type: 'actions',
        cellClassName: 'actions',
        align: "center",
        headerAlign: "center",
        sortable: false,
        disableColumnMenu: true,
        headerClassName: "grid-header-cell",
        renderCell: (params) => (
            <Box key={`action-${params.id}`} sx={{ display: "flex", gap: 1 }}>
                {onEdit && (
                    <Tooltip title="Edit">
                        <IconButton
                            key={`edit-${params.id}`}
                            size="small"
                            onClick={() => onEdit(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip title="Delete">
                        <IconButton
                            key={`delete-${params.id}`}
                            size="small"
                            color="error"
                            onClick={() =>
                                showConfirm({
                                    title: AlertTitle.CONFIRMATION,
                                    message: MessageText.CONFIRM_DELETE,
                                    onConfirm: async () => {
                                        await onDelete(params.row);
                                        showToast(MessageText.SUCCESS_DELETE, ToastAlertType.SUCCESS);
                                        loadData();
                                    },
                                })}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )
                }
            </Box >
        ),
    };

    const finalColumns = [...columns, actionColumn];

    const CustomLoadingOverlay = () => {
        return (
            <GridOverlay>
                <div className="grid-loading-div" >
                    <CircularProgress color="primary" />
                    <p className="mtp10">Loading data...</p>
                </div>
            </GridOverlay>
        );
    }

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2, width: "100%" }}
            >
                {!openInModal && (
                    <Typography variant="h5" fontWeight="bold" sx={{ width: "20%" }}>
                        {title}
                    </Typography>
                )}
                <Stack direction="row" justifyContent="right" sx={{ width: !openInModal ? "80%" : "99%", paddingTop: "10px;" }} spacing={3}>
                    {/* Search Box */}
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "70%" }}
                    />
                    <Tooltip title="Refresh">
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon fontSize="small" />}
                            onClick={loadData}
                        >
                            Refresh
                        </Button>
                    </Tooltip>
                    {onAdd && (
                        <Tooltip title="Add">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon fontSize="small" />}
                                onClick={onAdd}
                                sx={{ width: "10%", }}
                                color="primary"
                            >
                                Add
                            </Button>
                        </Tooltip>
                    )}
                    {!openInModal && handlExport && (
                        <Tooltip title="Export">
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon fontSize="small" />}
                                onClick={handlExport}
                                sx={{ width: "10%" }}
                                color="primary"
                            >
                                Export
                            </Button>
                        </Tooltip>
                    )}
                    {!openInModal && onDeleteAll && (
                        <Tooltip title="Delete All">
                            <Button
                                variant="contained"
                                startIcon={<DeleteIcon fontSize="small" />}
                                sx={{ width: "10%" }}
                                color="error"
                                disabled={!selectedIds || selectedIds.length == 0}
                                onClick={() =>
                                    showConfirm({
                                        title: AlertTitle.CONFIRMATION,
                                        message: MessageText.CONFIRM_DELETE_ALL.replace("{selectedids}", selectedIds.length),
                                        onConfirm: async () => {
                                            await onDeleteAll(selectedIds);
                                            setSelectedIds([]);
                                            showToast(
                                                `${selectedIds.length} ${MessageText.SUCCESS_DELETE_ALL}`,
                                                ToastAlertType.SUCCESS
                                            );
                                            loadData();
                                        },
                                    })
                                }
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>
            <div style={{ height: "80vh", width: "100%", overflowX: "hidden" }}>
                <DataGrid
                    rows={rows}
                    columns={finalColumns}
                    pagination
                    pageSizeOptions={pageSizeOptions}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onFilterModelChange={setFilterModel}
                    rowCount={total}
                    loading={loading}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(selectionModel) => {
                        const idsArray = Array.from(selectionModel.ids);
                        setSelectedIds(idsArray);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    slots={{
                        loadingOverlay: CustomLoadingOverlay,
                    }}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    paginationMode="server"
                    filterMode="server"
                    sortingMode="server"
                    sx={{
                        "& .MuiDataGrid-virtualScroller": {
                            overflowY: "auto"
                        },
                    }}
                />
            </div>
        </>
    );
}
