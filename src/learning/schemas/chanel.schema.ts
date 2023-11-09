import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { HydratedDocument } from 'mongoose';

export type ProfitDocument = HydratedDocument<Chanel>;

@Schema()
export class Chanel {
  _id: Types.ObjectId;

  @Prop({ required: true})
  name: string;

  @Prop({ default: ''})
  logo: string;
  
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

export const ChanelSchema = SchemaFactory.createForClass(
    Chanel
);
