import {IsBooleanString, IsDecimal, IsEnum, IsNumberString, IsOptional, IsString} from "class-validator";
import {SortCondition, SortOrder} from "../types";
import {ExpectedContractType, ExpectedWorkType} from "../entities/students-entity";

export class GetListOfStudentsDto {
  @IsOptional()
  @IsEnum(SortCondition)
  sortBy: SortCondition;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @IsOptional()
  @IsString()
  searchPhrase: string;

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
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsBooleanString()
  canTakeApprenticeship: boolean;

  @IsOptional()
  @IsDecimal()
  monthsOfCommercialExp: number;

  @IsOptional()
  @IsNumberString()
  minExpectedSalary: number;

  @IsOptional()
  @IsNumberString()
  maxExpectedSalary: number;
}