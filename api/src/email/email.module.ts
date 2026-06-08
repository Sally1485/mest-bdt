import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Provides the SMTP-backed invitation email pipeline.
 *
 * Exports {@link EmailService} so consuming modules (e.g. `InvitationsModule`)
 * can inject it via `imports: [EmailModule]`. Bootstrap-time env validation
 * lives in `validateInvitationConfig` (`./config.ts`) and runs from `main.ts`
 * before the HTTP listener starts.
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
