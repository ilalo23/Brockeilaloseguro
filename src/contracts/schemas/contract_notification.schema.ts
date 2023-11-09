import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContractNotificationDocument = Document & ContractNotification;

export enum TypeContractNofication {
  PAYMENT_EXPIRED = "PAYMENT_EXPIRED",
  RENOVATION = "RENOVATION",
}

@Schema()
export class ContractNotification {
  _id: Types.ObjectId;

  @Prop({ required: true })
  identification: string;

  @Prop({ default: false })
  wasViewed: boolean;

  @Prop({ default: false })
  wasSent: boolean;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  title: string;


  @Prop({ required: true })
  typeNotification: TypeContractNofication;

  @Prop({ required: true })
  group_contracts: number[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ContractNotificationSchema = SchemaFactory.createForClass(
  ContractNotification
);
