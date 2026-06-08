import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from './profiles/profiles.module';
import { ProgramsModule } from './programs/programs.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { ResponsesModule } from './responses/responses.module';
import { UploadsModule } from './uploads/uploads.module';
import { InvitationsModule } from './invitations/invitations.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        let normalize: any;
        if (process.env.NODE_ENV !== 'test') {
          try {
            // Dynamic import to bypass ESM issues in Jest for CommonJS
            const module = await eval("import('normalize-mongoose')");
            normalize = module.default;
          } catch {
            // ignore
          }
        }

        return {
          uri: process.env.MONGO_URI as string,
          connectionFactory: (connection: Connection) => {
            if (normalize) {
              connection.plugin(normalize);
            }
            return connection;
          },
        };
      },
    }),
    ProfilesModule,
    ProgramsModule,
    CohortsModule,
    CompaniesModule,
    UsersModule,
    FormsModule,
    ResponsesModule,
    UploadsModule,
    EmailModule,
    InvitationsModule,
  ],
})
export class AppModule {}
