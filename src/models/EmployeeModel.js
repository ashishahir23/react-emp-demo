

export class EmployeeModel {
  constructor({
    id = 0,
    fname = "",
    lname = "",
    email = "",
    phone = "",
    dob = "",
    isdeleted = false,
    deptid = "",
    departmentname = "",
  } = {}) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.isdeleted = isdeleted;
    this.deptid = deptid
    this.departmentname = departmentname
  }
}