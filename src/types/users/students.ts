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

export interface StudentCvResponse {
  firstName: string;
  lastName: string;
  bio?: string;
  email?: string;
  githubUsername: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  portfolioUrls?: string[];
  projectUrls?: string[];
  bonusProjectUrls: string[];
  expectedTypeWork: ExpectedWorkType;
  targetWorkCity?: string;
  expectedContractType: ExpectedContractType;
  expectedSalary?: number;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education?: string;
  workExperience?: string;
}

export interface ReservedStudentsResponse extends AvailableStudentData {
  reservedUntil: Date;
}
