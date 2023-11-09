import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document }  from "mongoose";
import { HydratedDocument } from 'mongoose';
import { Assurance } from "./assurance.schema";


export type AssuranceApiDocument = HydratedDocument<AssuranceApi>;

@Schema()
export class AssuranceApi {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Assurance'})
    assurance: Assurance;
  
    @Prop({ required: true, unique: true})
    uri: string;
  
    @Prop({ default: 1 })
    status: number;
    
    @Prop({ default: Date.now })
    created_at: Date;
    
    @Prop({ default: Date.now })
    updated_at: Date;
    
    @Prop({  default: null })
    created_by: MongooseSchema.Types.ObjectId;
    
    @Prop({  default: null })
    updated_by: MongooseSchema.Types.ObjectId;
}



export const AssuranceApiSchema =
  SchemaFactory.createForClass(AssuranceApi);
