import { Controller, Patch } from '@nestjs/common';
import { AppService } from '../application/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Patch('/remove-users-problems')
  async removeUsersProblems(): Promise<string> {
    return this.appService.removeUsersProblems();
  }
}
