import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Role } from "../dto/create-administration.dto";

export type AdministrationDocument = Document & Administration;

@Schema()
export class Administration {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  role: Role;
  @Prop({ default: 1 })
  status: number;
  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({ default: Date.now })
  updated_at: Date;
  @Prop({ required: true, default: "" })
  created_by: Types.ObjectId;
  @Prop({ required: true, default: "" })
  updated_by: Types.ObjectId;
}

export const AdministrationSchema = SchemaFactory.createForClass(
  Administration
);
