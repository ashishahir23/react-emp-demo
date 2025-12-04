export class EmpEducationModel {
    constructor({
        empid = 0,
        dgrid = 0,
        institute = "",
        passingYear = "",
        percentage ="",
    } = {}) {
        this.empid = empid;
        this.dgrid = dgrid;
        this.institute = institute,
        this.passingYear = passingYear;
        this.percentage = percentage;
    }
}
