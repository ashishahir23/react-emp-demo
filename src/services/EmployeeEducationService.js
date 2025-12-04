import { StorageKeys } from "../constants/StorageKeys";
import { loadDegree } from "./DegreeService.js";


/**
 * Save/Update Employee Education record(s)
 */

function saveEducations(educations) {
    localStorage.setItem(StorageKeys.EDUCATION, JSON.stringify(educations));
}

export function saveEmployeeEducations(empid, educations) {
    let merged = [];
    const otherEmpEducations = getStoredEducations().filter((edc) => edc.empid != empid);    
    if ((otherEmpEducations?.length ?? 0) > 0 && (educations?.length ?? 0) > 0) {
        merged = [...otherEmpEducations, ...educations];
    }
    else {    
        merged = [...educations];
    }    
    saveEducations(merged);
}

export async function loadEmployeeEducation(empid) {

    let allEmpEducations = getStoredEducations();
    
    if ((allEmpEducations?.length ?? 0) === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/empeducation.json");
        allEmpEducations = await response.json();
        saveEducations(allEmpEducations);
    }

    const empEducations = allEmpEducations.filter((edc) => edc.empid == empid);

    let mergedData = null;    
    if ((empEducations?.length ?? 0) > 0) {        
        const degrees = await loadDegree();

        mergedData = empEducations.map(emp => {
            const degree = degrees.find(d => d.dgrid == emp.dgrid);
            return {
                ...emp,
                degree: degree ? degree.degreename : "Unknown"
            };
        });
    }

    return mergedData;
}

function getStoredEducations() {
    return JSON.parse(localStorage.getItem(StorageKeys.EDUCATION)) || [];
}

export function getStoredEmpEducations(id) {
    const empEducations = getStoredEducations().filter((emp) => emp.id == id);
    return empEducations;
}

/**
 * Delete records(s)
 */
export function deleteEmplEducation(empid, dgrid) {
    const empEducations = getStoredEducations().filter((edc) => edc.empid !== empid && edc.dgrid !== dgrid);
    saveEducations(empEducations);
}