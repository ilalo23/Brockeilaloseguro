import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  //@Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;

  @Prop({ default: 2 })
  status: number;
  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({ default: Date.now })
  updated_at: Date;
  @Prop({ required: false, default: null })
  updated_by: Types.ObjectId;
  /*@Prop({ type: [{ type: Types.ObjectId, ref: Request.name }] })
  requests: Request[];*/
}

export const UserSchema = SchemaFactory.createForClass(User);
