import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Form } from '../../forms/schemas/form.schema';
import { Company } from '../../companies/schemas/company.schema';

export type ResponseDocument = HydratedDocument<Response>;

@Schema({ collection: 'Response', timestamps: true })
export class Response {
  @Prop({
    required: true,
    ref: Form.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  form: Form;

  @Prop({
    required: true,
    ref: Company.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  company: Company;

  @Prop({ required: true })
  data: string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
