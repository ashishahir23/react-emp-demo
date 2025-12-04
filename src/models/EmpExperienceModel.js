export class EmpExperienceModel {
    constructor({
        empid = 0,
        expid = 0,
        companyName = "",
        designation = "",
        startDate = null,
        endDate = null,
    } = {}) {
        this.empid = empid;
        this.expid = expid;
        this.companyName = companyName;
        this.designation = designation,
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
