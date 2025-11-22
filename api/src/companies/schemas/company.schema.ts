import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Cohort } from '../../cohorts/schemas/cohort.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ collection: 'Company', timestamps: true })
export class Company {
  @Prop({
    required: true,
    ref: Cohort.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  cohort: Cohort;

  @Prop()
  name: string;

  @Prop()
  mainPointOfContact: string;

  @Prop()
  altPointOfContact: string;

  @Prop()
  projectManager: string;

  @Prop()
  keyOrgUnits: number;

  @Prop()
  mission: string;

  @Prop()
  sector: string;

  @Prop()
  productOrService: string;

  @Prop()
  annualRevenue: number;

  @Prop()
  operationalYears: number;

  @Prop()
  totalUsers: number;

  @Prop()
  totalEmployees: number;

  @Prop()
  expectation: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
