import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Schema as MongooseSchema, Document } from "mongoose";
import { HydratedDocument } from 'mongoose';
import { AssuranceService } from "./assurance-service.schema";


export type AssuranceDocument = Assurance & Document;

@Schema()
export class Assurance {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true})
  label: string;

  @Prop({ required: true, unique: true})
  code: string;

  @Prop({ required: true})
  small_logo: string;

  @Prop({ required: true})
  normal_logo: string;

  @Prop({required: true})
  primary_color: string;
  
  @Prop({required: true})
  secondary_color: string;

  @Prop({ default: true })
  status: boolean;
  
  @Prop({ default: Date.now })
  created_at: Date;
  
  @Prop({ default: Date.now })
  updated_at: Date;
  
  @Prop({ default: null })
  created_by: MongooseSchema.Types.ObjectId;
  
  @Prop({ default: null })
  updated_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssuranceService' }]})
  services: AssuranceService[];
}

export const AssuranceSchema = SchemaFactory.createForClass(
    Assurance
);
