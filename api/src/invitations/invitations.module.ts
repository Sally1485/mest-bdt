import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthGuard } from '../common/guards/auth.guard';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { EmailModule } from '../email/email.module';
import { User, UserSchema } from '../users/schemas/user.schema';

import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';

/**
 * Wires up the company-invitations feature.
 *
 * Registers the three collections the controller and service touch directly
 * (`Invitation`, `User`, `Company`) and imports `EmailModule` so the
 * controller can inject `EmailService` for post-persistence delivery.
 *
 * `AuthGuard` is provided locally for the per-route `@UseGuards(AuthGuard)`
 * decorations on every endpoint except `GET /invitations/verify`. This
 * matches the same pattern used by `ResponsesModule`.
 *
 * `InvitationsService` is exported so other modules can reuse the invitation
 * lifecycle without re-registering its Mongoose models.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    EmailModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService, AuthGuard],
  exports: [InvitationsService],
})
export class InvitationsModule {}
