import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Define the User schema
export interface IUser extends Document {
  email: string;
  name: string;
  userName: string;
  password: string;
  photo?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  userName: {
    type: String,
    required: [true, "Please add a username"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/4pDNDk1/avatar.png",
  },
  followers: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
});

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// Define and export the User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
