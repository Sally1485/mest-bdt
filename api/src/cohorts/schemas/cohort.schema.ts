import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Program } from '../../programs/schemas/program.schema';

export type CohortDocument = HydratedDocument<Cohort>;

@Schema({ collection: 'Cohort', timestamps: true })
export class Cohort {
  @Prop({
    required: true,
    ref: Program.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  program: Program;

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

export const CohortSchema = SchemaFactory.createForClass(Cohort);
