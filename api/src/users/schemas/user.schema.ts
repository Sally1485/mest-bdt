import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'User', timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: true,
    ref: Company.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  company: Company;

  @Prop({ required: true, enum: ['READ', 'WRITE'] })
  access: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
