import { Injectable } from '@nestjs/common';
import { AppRepository } from '../repositories/app.repository';

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}

  async removeUsersProblems(): Promise<string> {
    const updatedUsersAmount =
      await this.appRepository.setUsersTroublesToFalse();

    return `Количество пользователей которые имели проблемы: ${updatedUsersAmount}`;
  }
}
