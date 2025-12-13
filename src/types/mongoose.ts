import { Types } from "mongoose";

// Mongoose document types
export interface MongooseDocument {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends MongooseDocument {
  name: string;
  email: string;
  image?: string;
  password?: string;
}

export interface MessageDocument extends MongooseDocument {
  content: string;
  conversationId: string;
  senderId: string;
  deletedAt?: Date | null;
}

export interface ConversationDocument extends MongooseDocument {
  name?: string;
  isGroup: boolean;
  participantIds: string[];
}
