import {IsBooleanString, IsDecimal, IsEnum, IsOptional, IsString} from "class-validator";
import {SortCondition, SortOrder} from "../types";
import {ExpectedContractType, ExpectedWorkType} from "../entities/students-entity";

export class GetListOfAvailableStudentsDto {
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