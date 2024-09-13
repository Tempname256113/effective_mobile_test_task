import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './application/app.service';
import { ConfigModule } from '@nestjs/config';
import pgConfig from './configs/pg.config';
import { AppRepository } from './repositories/app.repository';
import { KnexModule } from './knex.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [pgConfig],
    }),
    KnexModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}
