import { Schema, model } from "mongoose";
import { User } from "../zod/schemas";

/**
 * Mongoose schema for users.
 */
const userSchema = new Schema<User>(
  {
    fname: { type: String },
    lname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    profileImage: String,
  },
  { timestamps: true },
);

export const UserModel = model<User>("User", userSchema);
