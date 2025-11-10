import { StorageKeys } from "../constants/StorageKeys";

/**
 * Save/Update Deparment record(s)
 */

export function saveDepartments(departments) {
    localStorage.setItem(StorageKeys.DEPARMENTS, JSON.stringify(departments));
}

export function saveDepartment(department) {
    let depts = getStoredDepatments();
    department.id = (depts.length > 0 ? Math.max(...depts.map(e => parseInt(e.id, 10))) : 0) + 1;
    depts.push(department);
    localStorage.setItem(StorageKeys.DEPARMENTS, JSON.stringify(depts));
}

export function updateDepartment(dept) {
    const depts = getStoredDepatments();
    const index = depts.findIndex(d => d.id === dept.id);
    if (index != -1) {
        depts[index] = dept;
    }
    localStorage.setItem(StorageKeys.DEPARMENTS, JSON.stringify(depts));
}


/**
 * Get Deparments (supports pagination, sorting, global + column filters)
 */

export function getStoredDepatments() {
    return JSON.parse(localStorage.getItem(StorageKeys.DEPARMENTS)) || [];
}

export function getStoredDepartmentById(id) {
    const dept = getStoredDepatments().find((dept) => dept.id == id);
    return dept;
}

export async function loadDepartment() {

    let depts = getStoredDepatments();

    if (depts.length === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/department.json");
        depts = await response.json();
        saveDepartments(depts);
    }

    return depts;
}

export async function getDeparmentGridData(options = {}) {
    const {
        page = 1,
        pageSize = 10,
        sortField = "id",
        sortOrder = "asc",
        globalFilter = "",
        filters = [], // [{ field, operator, value }]
        isExport = false
    } = options;

    let departments = await loadDepartment();

    // Global filter (search box)
    if (globalFilter) {
        const search = globalFilter.toLowerCase();
        departments = departments.filter(
            (e) =>               
                e.name?.toLowerCase().includes(search)
        );
    }

    // Column filters
    if (filters.length > 0) {
        departments = departments.filter((dept) =>
            filters.every(({ field, operator, value }) => {
                const fieldValue = dept[field];
                if (value == null || value === "") return true;

                switch (operator) {
                    case "contains":
                        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
                    case "equals":
                        return String(fieldValue).toLowerCase() === String(value).toLowerCase();
                    case "startsWith":
                        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
                    case "endsWith":
                        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
                    default:
                        return true;
                }
            })
        );
    }

    // Sorting
    departments.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (typeof valA === "string") {
            return sortOrder === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }
        return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    if (isExport) {
        return departments;
    }
    else {
        // Pagination
        const total = departments.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pagedDepartments = departments.slice(start, end);

        return {
            data: pagedDepartments,
            total,
            page,
            pageSize,
        };
    }
}

/**
 * Delete records(s)
 */

export function deleteDepartment(id) {
    const departments = getStoredDepatments().filter((dept) => dept.id !== id);
    saveDepartments(departments);
}

export function deleteMultipleDepartment(ids = []) {
    const departments = getStoredDepatments().filter((dept) => !ids.includes(dept.id));
    saveDepartments(departments);
}