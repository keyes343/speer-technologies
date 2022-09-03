import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// @Schema()
// export class Market {
//   @Prop()
//   stock_name: keyof AllCompanies;

//   @Prop({ type: Number, default: 0 })
//   stock_price: number;
// }

@Schema()
export class Market {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: string;

  @Prop({ type: String, unique: true })
  company_name: 'Company_A' | 'Company_B' | 'Company_C';

  @Prop()
  remaining_stocks: number;

  @Prop()
  price_total: number;

  @Prop()
  price_per_stock: number;
}

export const MarketSchema = SchemaFactory.createForClass(Market);

// export interface Market extends Document {
//   _id: string;
//   stock_name: string;
//   stock_price: number;
// }
