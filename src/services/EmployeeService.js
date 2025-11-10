import { StorageKeys } from "../constants/StorageKeys";
import { getStoredDepatments, saveDepartments } from "./DepartmentService";


/**
 * Save/Update Employee record(s)
 */

function saveEmployees(employees) {
    localStorage.setItem(StorageKeys.EMPLOYEES, JSON.stringify(employees));
}

export function saveEmployee(employee) {
    let employees = getStoredEmployees();    
    employee.id = (employees.length > 0 ? Math.max(...employees.map(e => parseInt(e.id, 10))) : 0) + 1;
    employees.push(employee);
    localStorage.setItem(StorageKeys.EMPLOYEES, JSON.stringify(employees));
}

export function updateEmployee(employee) {
    const employees = getStoredEmployees();
    const index = employees.findIndex(emp => emp.id === employee.id);

    if (index != -1) {
        employees[index] = employee;
    }
    localStorage.setItem(StorageKeys.EMPLOYEES, JSON.stringify(employees));
}

/**
 * Get employees (supports pagination, sorting, global + column filters)
 */

export async function getEmployeeGridData(options = {}) {
    const {
        page = 1,
        pageSize = 10,
        sortField = "id",
        sortOrder = "asc",
        globalFilter = "",
        filters = [], // [{ field, operator, value }]
        isExport = false
    } = options;

    let employees = await loadEmployeesWithDept();

    // Global filter (search box)
    if (globalFilter) {
        const search = globalFilter.toLowerCase();
        employees = employees.filter(
            (e) =>
                e.fname.toLowerCase().includes(search) ||
                e.lname.toLowerCase().includes(search) ||
                e.departmentname?.toLowerCase().includes(search)
        );
    }

    // Column filters
    if (filters.length > 0) {
        employees = employees.filter((emp) =>
            filters.every(({ field, operator, value }) => {
                const fieldValue = emp[field];
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
    employees.sort((a, b) => {
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
        return employees;
    }
    else {
        // 🔹 Pagination
        const total = employees.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pagedEmployees = employees.slice(start, end);

        return {
            data: pagedEmployees,
            total,
            page,
            pageSize,
        };
    }
}

export async function loadEmployeesWithDept() {
    let employees = getStoredEmployees();

    if (employees.length === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/employees.json");
        employees = await response.json();
        saveEmployees(employees);
    }

    let depts = getStoredDepatments();

    if (depts.length === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/department.json");
        depts = await response.json();
        saveDepartments(depts);
    }

    const mergedData = employees.map(emp => {
        const dept = depts.find(d => d.id === emp.deptid);
        return {
            ...emp,
            departmentname: dept ? dept.name : "Unknown"
        };
    });

    return mergedData;
}

function getStoredEmployees() {    
    return JSON.parse(localStorage.getItem(StorageKeys.EMPLOYEES)) || [];
}

export function getStoredEmployeeById(id) {
    const employee = getStoredEmployees().find((emp) => emp.id == id);    
    return employee;
}

/**
 * Delete records(s)
 */
export function deleteEmployee(id) {
    const employees = getStoredEmployees().filter((emp) => emp.id !== id);
    saveEmployees(employees);
}

export function deleteMultipleEmployees(ids = []) {
    const employees = getStoredEmployees().filter((emp) => !ids.includes(emp.id));
    saveEmployees(employees);
}