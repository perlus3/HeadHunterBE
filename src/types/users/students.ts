import {CanTakeApprenticeship, ExpectedContractType, ExpectedWorkType} from "../../entities/Student.entity";

export interface AvailableStudentData {
  id: string;
  fullName: string;
  courseCompletion: string;
  courseEngagement: string;
  projectDegree: string;
  teamProjectDegree: string;
  expectedTypeWork?: ExpectedWorkType;
  targetWorkCity?: string;
  expectedContractType?: ExpectedContractType;
  expectedSalary?: number;
  canTakeApprenticeship?: CanTakeApprenticeship;
  monthsOfCommercialExp?: number;
}
