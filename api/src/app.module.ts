import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseNormalizePlugin } from '@kikiutils/mongoose/plugins/normalize';
import { ProfilesModule } from './profiles/profiles.module';
import { ProgramsModule } from './programs/programs.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      connectionFactory: (connection: Connection) => {
        connection.plugin(mongooseNormalizePlugin);
        return connection;
      },
    }),
    ProfilesModule,
    ProgramsModule,
    CohortsModule,
    CompaniesModule,
    UsersModule,
  ],
})
export class AppModule {}
