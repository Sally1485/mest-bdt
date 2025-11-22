import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;

@Schema({ collection: 'Program', timestamps: true })
export class Program {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
