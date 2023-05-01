import { Injectable } from '@nestjs/common';
import {AvailableStudentData} from "../types";
import {StudentEntity, StudentStatus} from "../entities/Student.entity";

@Injectable()
export class UsersService {
  async getListOfAvailableStudents(): Promise<AvailableStudentData[]> {
    const Students = await StudentEntity.find({
      select: [
        'id',
        'courseCompletion',
        'courseEngagement',
        'projectDegree',
        'teamProjectDegree',
        'expectedTypeWork',
        'targetWorkCity',
        'expectedContractType',
        'expectedSalary',
        'canTakeApprenticeship',
        'monthsOfCommercialExp',
      ],
      relations: ['user'],
      where: {
        status: StudentStatus.Available,
      },
    });

    return Students.map(student => {
      const fullName = `${student.user.firstName} ${student.user.lastName[0]}.`;
      delete student.user;

      return {
        ...student,
        fullName,
      };
    }) as AvailableStudentData[];
  }
}
