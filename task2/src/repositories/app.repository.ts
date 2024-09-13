import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AppRepository {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async setUsersTroublesToFalse(): Promise<number> {
    return this.knex('users')
      .update({
        problems: false,
      })
      .where({
        problems: true,
      });
  }
}
