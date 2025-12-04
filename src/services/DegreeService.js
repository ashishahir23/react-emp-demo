import { StorageKeys } from "../constants/StorageKeys";

function saveDegrees(degrees) {
    localStorage.setItem(StorageKeys.DEGREE, JSON.stringify(degrees));
}

function getStoredDegree() {    
    return JSON.parse(localStorage.getItem(StorageKeys.DEGREE)) || [];
}

export async function loadDegree() {
    let degrees = getStoredDegree();

    if (degrees.length === 0) {
        const response = await fetch(import.meta.env.BASE_URL + "/data/degree.json");
        degrees = await response.json();
        saveDegrees(degrees);
    }
    
    return degrees;
}