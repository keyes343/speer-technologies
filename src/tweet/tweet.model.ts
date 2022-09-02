import { Schema } from 'mongoose';

export const TweetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    username: { type: String, required: true },
    tweet: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export interface Tweet extends Document {
  _id: string;
  userId: string;
  username: string;
  tweet: string;
  likes: number;
}
