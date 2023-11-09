import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  //@Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;
  @Prop({ required: true })
  identification: string;
  @Prop({ default: '' })
  fcm: string;

  @Prop({ default: '' })
  updated_fcm: Date;


  @Prop({ required: true })
  firstname: string;
  @Prop({ required: true })
  lastname: string;
  @Prop({ default: "" })
  photo: string;
  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({ default: "" })
  province: string;
  @Prop({ default: "" })
  city: string;
  @Prop({ default: "" })
  birthday: Date;
  @Prop({ default: 0 })
  ranking: number;
  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
