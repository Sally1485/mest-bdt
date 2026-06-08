import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

export type InvitationDocument = HydratedDocument<Invitation>;
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
export const INVITATION_STATUSES: InvitationStatus[] = [
  'PENDING',
  'ACCEPTED',
  'EXPIRED',
  'REVOKED',
];

@Schema({
  collection: 'Invitation',
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret.tokenHash;
      return ret;
    },
  },
})
export class Invitation {
  @ApiProperty({ example: 'invitee@example.com' })
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @ApiProperty({
    description: 'The Company this invitation is for.',
    type: () => Company,
  })
  @Prop({
    required: true,
    ref: Company.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  company: Company;

  @ApiProperty({ example: 'READ', enum: ['READ', 'WRITE'] })
  @Prop({ required: true, enum: ['READ', 'WRITE'] })
  access: 'READ' | 'WRITE';

  @ApiProperty({ example: 'PENDING', enum: INVITATION_STATUSES })
  @Prop({ required: true, enum: INVITATION_STATUSES, default: 'PENDING' })
  status: InvitationStatus;

  // Stored only as SHA-256 hex digest. Never returned over HTTP.
  @Prop({ required: true })
  tokenHash: string;

  @ApiProperty({ example: '2025-01-04T12:00:00.000Z' })
  @Prop({ required: true })
  expiresAt: Date;

  @ApiProperty({ example: 'hanko-sub-uuid', required: false })
  @Prop()
  invitedBy?: string;

  @ApiProperty({ example: '2025-01-02T12:00:00.000Z', required: false })
  @Prop({ type: Date, default: null })
  acceptedAt?: Date | null;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

// Partial unique index: at most one PENDING invitation per (email, company)
InvitationSchema.index(
  { email: 1, company: 1 },
  { unique: true, partialFilterExpression: { status: 'PENDING' } },
);

// Unique index on tokenHash for fast lookup on /accept and /verify
InvitationSchema.index({ tokenHash: 1 }, { unique: true });
