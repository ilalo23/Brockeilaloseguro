import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type ProfitDocument = Document & Profit;

@Schema()
export class Profit {
  _id: Types.ObjectId;

  @Prop({ required: true})
  version_id: Types.ObjectId;

  @Prop({ required: true})
  user_id: Types.ObjectId;
  
  @Prop({ required: true})
  customer: string;

  @Prop({ required: true})
  num_contract: string;

  @Prop({ required: true})
  assurance: string;

  @Prop({ required: true})
  type_assurance: string;

  @Prop({ required: true})
  profit: number;

  @Prop({ required: true})
  reason: string;

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

export const ProfitSchema = SchemaFactory.createForClass(
    Profit
);
