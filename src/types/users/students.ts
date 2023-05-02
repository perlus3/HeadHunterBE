import {
  CanTakeApprenticeship,
  ExpectedContractType,
  ExpectedWorkType,
  StudentEntity
} from "../../entities/Student.entity";

export interface TeamProjectUrls {
  repositories: string[];
  studentCommits: string[];
  codeReviews: string[];
}

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

export interface OneStudentData{
  firstName: string;
  lastName: string;
  bio: string;
  githubUsername: string;
  courseCompletion: string;
  courseEngagement: string;
  projectDegree: string;
  teamProjectDegree: string;
  portfolio: string[];
  teamProjectUrls: TeamProjectUrls;
  bonusProjectUrls: string[];
  expectedTypeWork: ExpectedWorkType;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: number;
  canTakeApprenticeship: CanTakeApprenticeship;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
}
