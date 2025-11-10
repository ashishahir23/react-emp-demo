import { getDateString } from "../utils/DateFormatter";

const isValidUser = (userName, password) => {    
    if (userName == "demo" && password == `demo@${getDateString()}`) {
        return true;
    }
    return false
}

export default isValidUser;
