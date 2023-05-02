import { Injectable } from '@nestjs/common';
import {AvailableStudentData, OneStudentData} from "../types";
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

  async getStudentData(id: string): Promise<OneStudentData> {
    const student = await StudentEntity.findOne({
      select: [
        'id',
        'bio',
        'githubUsername',
        'courseCompletion',
        'courseEngagement',
        'projectDegree',
        'teamProjectDegree',
        'portfolioUrls',
        'bonusProjectUrls',
        'expectedTypeWork',
        'targetWorkCity',
        'expectedContractType',
        'expectedSalary',
        'canTakeApprenticeship',
        'monthsOfCommercialExp',
        'education',
        'workExperience',
      ],
      relations: ['user'],
      where: {
        id,
      },
    });

    return {
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      bio: student.bio,
      githubUsername: student.githubUsername,
      courseCompletion: student.courseCompletion,
      courseEngagement: student.courseEngagement,
      projectDegree: student.projectDegree,
      teamProjectDegree: student.teamProjectDegree,
      portfolio: student.portfolioUrls,
      teamProjectUrls: null,
      bonusProjectUrls: student.bonusProjectUrls,
      expectedTypeWork: student.expectedTypeWork,
      targetWorkCity: student.targetWorkCity,
      expectedContractType: student.expectedContractType,
      expectedSalary: student.expectedSalary,
      canTakeApprenticeship: student.canTakeApprenticeship,
      monthsOfCommercialExp: student.monthsOfCommercialExp,
      education: student.education,
      workExperience: student.workExperience,
    } as OneStudentData;
  }
}
