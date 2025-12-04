import { StorageKeys } from "../constants/StorageKeys.js";

/**
 * Save/Update Employee Experience record(s)
 */

function saveExperiences(experiences) {
    localStorage.setItem(StorageKeys.EXPERIENCE, JSON.stringify(experiences));
}

export function saveEmployeeExperiences(empid, experiences) {    
    const otherEmpExp = getStoredExperiences().filter((exp) => exp.empid != empid);
    let merged = [];
    if ((otherEmpExp?.length ?? 0) > 0 && (experiences?.length ?? 0) > 0) {
        merged = [...otherEmpExp, ...experiences];
    }
    else {
        merged = [...experiences];
    }
    saveExperiences(merged);
}

export async function loadEmployeeExperience(empid) {

    let allEmpExp = getStoredExperiences();

    if ((allEmpExp?.length ?? 0) === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/empexperiance.json");
        allEmpExp = await response.json();
        saveExperiences(allEmpExp);
    }

    const empExps = allEmpExp.filter((exp) => exp.empid == empid);

    // const result = empExps.map(emp => {
    //     const sDate = emp.startDate ? new Date(emp.startDate) : null;
    //     const eDate = emp.endDate ? new Date(emp.endDate) : null;
    //     return {
    //         ...emp,
    //         startDate: sDate,
    //         endDate: eDate
    //     };
    // });

    return empExps;
}

function getStoredExperiences() {
    return JSON.parse(localStorage.getItem(StorageKeys.EXPERIENCE)) || [];
}

/**
 * Delete records(s)
 */
export function deleteEmpExperience(empid, expid) {
    const empexperience = getStoredExperiences().filter((exp) => exp.empid != empid && exp.expid != expid);
    saveExperiences(empexperience);
}