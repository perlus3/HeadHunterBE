import {ExpectedContractType, ExpectedWorkType} from "../../entities/students-entity";

export interface AvailableStudentData {
  id: string;
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
