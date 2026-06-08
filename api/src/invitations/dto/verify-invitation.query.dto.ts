import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class VerifyInvitationQueryDto {
  @Matches(/^[0-9a-f]{64}$/, { message: 'Invalid token format.' })
  @ApiProperty({
    description: 'The 64-character lowercase hex invitation token to verify.',
    example: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  })
  token: string;
}
