// MongoDB/Mongoose types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Conversation {
  id: string;
  name?: string;
  isGroup: boolean;
  participantIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  conversationId: string;
  joinedAt: Date;
  lastReadAt: Date;
}

export type ConversationWithDetails = Conversation & {
  participants: {
    user: User;
  }[];
  messages: Message[];
};

export type MessageWithSender = Message & {
  sender: User;
};

export type ConversationWithLastMessage = Conversation & {
  participants: {
    user: User;
  }[];
  messages: Message[];
  _count: {
    messages: number;
  };
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
