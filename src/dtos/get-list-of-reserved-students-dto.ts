import {IsBooleanString, IsDecimal, IsEnum,IsOptional, IsString} from "class-validator";
import {ExpectedContractType, ExpectedWorkType} from "../entities/students-entity";
import {GetListOfAvailableStudentsDto} from "./get-list-of-available-students-dto";

export class GetListOfReservedStudentsDto extends GetListOfAvailableStudentsDto {

}