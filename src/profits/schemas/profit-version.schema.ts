import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type ProfitVersionDocument = Document & ProfitVersion;

@Schema()
export class ProfitVersion {
  _id: Types.ObjectId;
  
  @Prop({ required: true})
  rows: number;
  
  @Prop({ default: true })
  status: boolean;
  
  @Prop({ default: Date.now })
  created_at: Date;
  
  @Prop({ default: Date.now })
  updated_at: Date;
  
  @Prop({ required: true, default: "" })
  created_by: Types.ObjectId;
  
  @Prop({ required: true, default: "" })
  updated_by: Types.ObjectId;
}

export const ProfitVersionSchema = SchemaFactory.createForClass(
    ProfitVersion
);
