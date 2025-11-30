import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormDocument = HydratedDocument<Form>;

@Schema({ collection: 'Form', timestamps: true })
export class Form {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  schema: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
