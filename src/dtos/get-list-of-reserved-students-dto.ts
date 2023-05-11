import {IsBooleanString, IsDecimal, IsEnum,IsOptional, IsString} from "class-validator";
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
  @IsDecimal()
  courseCompletion: number;

  @IsOptional()
  @IsDecimal()
  courseEngagement: number;

  @IsOptional()
  @IsDecimal()
  projectDegree: number;

  @IsOptional()
  @IsDecimal()
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
  @IsBooleanString()
  canTakeApprenticeship: boolean;

  @IsOptional()
  @IsDecimal()
  monthsOfCommercialExp: number;
}