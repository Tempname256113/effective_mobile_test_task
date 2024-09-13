import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex from 'knex';

@Global()
@Module({
  providers: [
    {
      provide: 'KnexConnection',
      useFactory: async (configService: ConfigService) => {
        return knex({
          client: 'pg',
          connection: {
            connectString: configService.get('pgConfig.connectString'),
            host: configService.get('pgConfig.host'),
            port: configService.get('pgConfig.port'),
            user: configService.get('pgConfig.user'),
            database: configService.get('pgConfig.database'),
            password: configService.get('pgConfig.password'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KnexConnection'],
})
export class KnexModule {}
