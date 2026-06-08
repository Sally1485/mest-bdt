import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Arguments for {@link EmailService.sendInvitation}.
 *
 * `rawToken` is the unhashed token. It is interpolated into the accept link
 * inside the email body and must never be persisted or sent over HTTP.
 */
export interface SendInvitationArgs {
  to: string;
  companyName: string;
  access: 'READ' | 'WRITE';
  rawToken: string;
  expiresAt: Date;
}

/**
 * Sends invitation emails over SMTP via Nodemailer.
 *
 * The transporter is built once from environment variables and cached. Each
 * email carries both a plaintext and an HTML body containing the company
 * name, role label, accept link, and expiry timestamp.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST as string;
    const port = Number(process.env.SMTP_PORT);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER as string;
    const pass = process.env.SMTP_PASS as string;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  /**
   * Sends a single invitation email. Re-throws any underlying transporter
   * error so the caller can map it to a 502.
   */
  async sendInvitation({
    to,
    companyName,
    access,
    rawToken,
    expiresAt,
  }: SendInvitationArgs): Promise<void> {
    const roleLabel = access === 'READ' ? 'Read Only' : 'Full Access';
    const appBaseUrl = process.env.APP_BASE_URL as string;
    const acceptLink = `${appBaseUrl}/invitations/accept?token=${rawToken}`;
    const expiresAtHuman = expiresAt.toUTCString();

    const subject = `You're invited to join ${companyName}`;

    const text =
      `You have been invited to join ${companyName} as ${roleLabel}.\n\n` +
      `Accept your invitation by opening the following link:\n` +
      `${acceptLink}\n\n` +
      `This invitation expires on ${expiresAtHuman}. ` +
      `If it expires before you accept, ask the inviter to send a new one.\n`;

    const html =
      `<p>You have been invited to join <strong>${companyName}</strong> as <strong>${roleLabel}</strong>.</p>` +
      `<p>Accept your invitation by clicking the link below:</p>` +
      `<p><a href="${acceptLink}">${acceptLink}</a></p>` +
      `<p>This invitation expires on <strong>${expiresAtHuman}</strong>. ` +
      `If it expires before you accept, ask the inviter to send a new one.</p>`;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      });

      // Ethereal returns a previewable URL for inspecting the captured
      // email. Other transports return `false` here, in which case we log
      // the message id instead. Both are at debug level so production stdout
      // stays clean — bump the log level to see them.
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.debug(`Invitation email preview: ${previewUrl}`);
      } else {
        this.logger.debug(
          `Invitation email sent (messageId=${info.messageId})`,
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Invitation email send failed: ${message}`);
      throw err;
    }
  }
}
