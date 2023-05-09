import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {ExpectedContractType, ExpectedWorkType} from "../entities/students-entity";

export enum SortCondition {
  ByCourseCompletion = 'courseCompletion',
  ByCourseEngagement = 'courseEngagement',
  ByProjectDegree = 'projectDegree',
  ByTeamProjectDegree = 'teamProjectDegree',
  ByExpectedTypeWork = 'expectedTypeWork',
  ByExpectedContractType = 'expectedContractType',
  ByExpectedSalary = 'expectedSalary',
  ByCanTakeApprenticeship = 'canTakeApprenticeship',
  ByMonthsOfCommenrcialExp = 'monthsOfCommercialExp',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetListOfReservedStudentsDto {
  @IsOptional()
  @IsEnum(SortCondition)
  sortBy: SortCondition;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @IsOptional()
  @IsNumber()
  courseCompletion: number;

  @IsOptional()
  @IsNumber()
  courseEngagement: number;

  @IsOptional()
  @IsNumber()
  projectDegree: number;

  @IsOptional()
  @IsNumber()
  teamProjectDegree: number;

  @IsOptional()
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
  @IsString()
  targetWorkCity: string;

  @IsOptional()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsOptional()
  @IsNumber()
  monthsOfCommercialExp: number;
}