ecport interface EmployeeInter{
    balance:number,
    id:number,
    membershipStatus:number,
    password:string,
    phone:string,
    role:number,
    userName:string
}
export type EmployeeList = Array<EmployeeInter>