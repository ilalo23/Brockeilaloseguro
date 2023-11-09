import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeRecoveryDocument = CodeRecovery & Document;

@Schema()
export class CodeRecovery {
  //@Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true })
  identification: string;
  @Prop({ required: true })
  code: string;
  @Prop({ default: 0 })
  status: number;
  @Prop({ required: true })
  validUntil: Date;
  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({ default: Date.now })
  updated_at: Date;
  /*@Prop({ type: [{ type: Types.ObjectId, ref: Request.name }] })
  requests: Request[];*/
}

export const CodeRecoverySchema = SchemaFactory.createForClass(CodeRecovery);
