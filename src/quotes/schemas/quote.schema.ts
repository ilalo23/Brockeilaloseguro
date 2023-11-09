import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from "mongoose";
import { Assurance } from "src/general/schemas/assurance.schema";
export type QuoteDocument = HydratedDocument<Quote>;

enum TypeAssurance {
  PRIVATE_LIGHT_CAR = 'PRIVATE_LIGHT_CAR',
  PREPAID_MEDICINE = 'PREPAID_MEDICINE',
}

@Schema()
export class QuoteCustomer {
  @Prop({ required: true })
  identification: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;
}


@Schema()
export class QuoteCar {

  @Prop({ required: true })
  plate: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ default: 0 })
  recommend_price: number;

  @Prop({ required: true })
  form_price: number;

  @Prop({ default: 0 })
  extra_price: number;

}


@Schema()
export class QuoteProduct {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rate: string;

  @Prop({ required: true })
  payments: Array<{
    form: string;
    condition: string;
  }>;

  @Prop({ required: true })
  coverages: Array<Array<string>>;

  @Prop({ required: true })
  deductibles: Array<Array<string>>;

}

@Schema()
export class Quote {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Assurance'})
  assurance: Assurance;
  @Prop({ required: true })
  quote_id: string;
  @Prop({ enum: TypeAssurance, required: true })
  type: TypeAssurance;

  @Prop({ required: true, type: QuoteCustomer })
  customer: QuoteCustomer;

  @Prop({ required: true, type: QuoteCar })
  car: QuoteCar;

  @Prop({ required: true })
  products: Array<QuoteProduct>;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ required: true, default: "" })
  created_by: MongooseSchema.Types.ObjectId;

}

export const QuoteSchema = SchemaFactory.createForClass(
  Quote
);
