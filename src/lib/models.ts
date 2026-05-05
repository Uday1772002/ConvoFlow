import { Schema, model, models } from "mongoose";

// User Model
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [255, "Email cannot exceed 255 characters"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
  },
  password: { type: String, required: true },
  image: { type: String, maxlength: [500, "Image URL too long"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const User = models.User || model("User", UserSchema);

// Conversation Model
const ConversationSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [100, "Group name cannot exceed 100 characters"],
  },
  isGroup: { type: Boolean, default: false },
  participantIds: [{ type: String }], // String array to support NextAuth string IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ConversationSchema.pre("save", function () {
  this.updatedAt = new Date();
});

ConversationSchema.index({ participantIds: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);

// Message Model
const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: [5000, "Message cannot exceed 5000 characters"],
  },
  conversationId: { type: String, required: true }, // String to support various ID formats
  senderId: { type: String, required: true }, // String to support NextAuth IDs
  readBy: [{ type: String }], // Array of user IDs who have read this message
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

MessageSchema.pre("save", function () {
  this.updatedAt = new Date();
});

MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ deletedAt: 1 });

export const Message = models.Message || model("Message", MessageSchema);
