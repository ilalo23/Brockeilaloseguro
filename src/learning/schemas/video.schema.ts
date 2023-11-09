import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Types } from "mongoose";
import { HydratedDocument } from 'mongoose';
import { Chanel } from "./chanel.schema";

export type VideoDocument = HydratedDocument<Video>;

@Schema()
export class Video {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chanel' })
  chanel: Chanel;

  @Prop({ required: true})
  title: string;

  @Prop({ required: true})
  url: string;

  @Prop({ required: true})
  description: string;

  @Prop({ default: 0})
  views: number;

  @Prop({ default: 0})
  n_comments: number;

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

export const VideoSchema = SchemaFactory.createForClass(
    Video
);
