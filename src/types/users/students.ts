import {ExpectedContractType, ExpectedWorkType} from "../../entities/students-entity";
import {UsersEntity} from "../../entities/users.entity";

export interface AvailableStudentData {
  user: UsersEntity;
  fullName: string;
  courseCompletion: string;
  courseEngagement: string;
  projectDegree: string;
  teamProjectDegree: string;
  expectedTypeWork: ExpectedWorkType;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: number;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}
