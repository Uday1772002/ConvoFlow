# ConvoFlow 🚀

> **House of Edtech Full-Stack Developer Assignment - December 2025**  
> Built by [Uday Ram](https://github.com/Uday1772002) | [LinkedIn](https://linkedin.com/in/jayaram-uday)

A production-ready, full-stack chat application with real-time messaging, AI-powered features, and comprehensive security. Demonstrates modern web development from concept to deployment.

![ConvoFlow](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io)

📚 **Assignment Documentation**:

- [Assignment Completion Report](./ASSIGNMENT_COMPLETION.md)
- [Security Documentation](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## ✨ Features

### Core Functionality

- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 👥 **One-on-One & Group Chats** - Support for direct messaging and group conversations
- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth v5
- 🔍 **User Search** - Find and connect with other users
- 📱 **Responsive Design** - Fully responsive UI that works on all devices
- 🎨 **Dark Theme** - Beautiful dark mode by default with cyan accent color

### AI-Powered Features (Google Gemini)

- 🤖 **Smart Reply Suggestions** - AI-generated contextual reply recommendations
- ✨ **Message Improvement** - Enhance message clarity and tone
- 📊 **Conversation Summaries** - Automatically summarize long conversations with dialog UI
- 🎯 **Context-Aware Responses** - AI understands conversation history and sender context

### Real-time Presence Features

- ✍️ **Typing Indicators** - See when others are typing in real-time
- 🟢 **Online Status** - Green dot indicators show who's currently online
- 🔔 **Unread Badges** - Cyan badges display unread message counts
- 📨 **Live Updates** - Messages appear instantly via WebSocket connection

### Professional UX Enhancements

- 🔍 **Conversation Search** - Filter chats by name or message content
- ⌨️ **Keyboard Shortcuts** - Cmd/Ctrl+K for search, Escape to close dialogs
- 💀 **Loading Skeletons** - Professional loading states instead of spinners
- 🕐 **Hover Timestamps** - Full date/time on hover over message times
- ✨ **Smooth Animations** - Polished transitions and hover effects
- 📱 **Collapsible Sidebar** - Toggle sidebar on all screen sizes

### Technical Features

- 🚀 **Next.js 15** with App Router and React Server Components
- 🗄️ **MongoDB Database** - Robust data persistence with Mongoose
- 🔌 **Socket.IO** - Bidirectional real-time communication
- 🎭 **Type Safety** - Full TypeScript implementation
- ⚡ **Optimized Performance** - Server-side rendering and code splitting

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with dark mode
- **Shadcn/ui** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **NextAuth v5** - Authentication with JWT sessions
- **Socket.IO** - Real-time bidirectional event-based communication
- **Node.js HTTP Server** - Custom server for Socket.IO integration
- **Google Generative AI** - Gemini AI for smart features

### Development Tools

- **ESLint** - Code linting
- **Git** - Version control
- **TypeScript** - Static type checking

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** database (local or Atlas)
- **Google AI Studio** API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/jayaramuday/convoflow.git
cd convoflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following variables:

```env
# MongoDB
MONGODB_URI="mongodb://localhost:27017/convoflow"
# Or use MongoDB Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/convoflow?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google Gemini AI
GEMINI_API_KEY="your-google-ai-studio-api-key"
```

**Get your Gemini API Key:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Click "Get API Key" → "Create API key"
4. Copy and paste into `.env.local`

### 4. Set Up MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Database will be created automatically on first run
```

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env.local` as `MONGODB_URI`

### 5. Run Development Server

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) with Socket.IO server integrated.

---

## 📁 Project Structure

```
convoflow/
├── server.js                 # Custom Node.js server with Socket.IO
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── conversations/ # Chat endpoints
│   │   │   ├── users/       # User endpoints
│   │   │   └── ai/          # AI features (Gemini)
│   │   ├── auth/            # Auth pages (signin/signup)
│   │   ├── dashboard/       # Main chat interface
│   │   │   └── page.tsx     # Dashboard with all features
│   │   ├── layout.tsx       # Root layout with dark theme
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── chat/            # Chat components
│   │   │   ├── conversation-list.tsx  # With unread badges & online status
│   │   │   ├── message-list.tsx       # With hover effects
│   │   │   ├── message-input.tsx      # With typing events
│   │   │   ├── message-skeleton.tsx   # Loading state
│   │   │   └── new-chat-dialog.tsx    # Create conversation
│   │   ├── ui/              # Reusable UI components
│   │   └── providers/       # Session provider
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── auth.config.ts   # Auth options
│   │   ├── mongodb.ts       # MongoDB connection
│   │   ├── models.ts        # Mongoose schemas
│   │   ├── socket.ts        # Socket.IO client
│   │   ├── gemini.ts        # Google AI integration
│   │   └── utils.ts         # Utility functions
│   ├── types/               # TypeScript types
│   └── middleware.ts        # Auth middleware
├── .env.local               # Environment variables (gitignored)
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config with dark mode
└── tsconfig.json            # TypeScript config
```

---

## 🔧 Configuration

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API key" or "Create API key"
4. Copy the API key
5. Add to `.env.local` as `GEMINI_API_KEY`

**Free Tier:**

- 60 requests per minute
- Perfect for development and small projects

### MongoDB Setup

**Local MongoDB:**

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Verify
mongosh
```

**MongoDB Atlas (Cloud):**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user
4. Whitelist your IP or use `0.0.0.0/0` for development
5. Get connection string
6. Add to `.env.local`

### NextAuth Secret Generation

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

```bash
npm run build
```

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_URL` - Your production URL (e.g., https://yourapp.vercel.app)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GEMINI_API_KEY` - Your Google AI Studio API key

**Note:** Socket.IO requires a server that supports WebSockets. Vercel serverless functions don't support persistent WebSocket connections. Consider:

- Railway
- Render
- DigitalOcean App Platform
- Or deploy Socket.IO server separately

---

## 📝 API Documentation

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Conversations

- `GET /api/conversations` - Get user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get conversation details
- `DELETE /api/conversations/[id]` - Delete conversation

### Messages

- `GET /api/conversations/[id]/messages` - Get messages
- `POST /api/conversations/[id]/messages` - Send message
- `DELETE /api/conversations/[id]/messages/[messageId]` - Delete message

### AI Features

- `POST /api/ai/generate` - Generate AI suggestions/summaries

### Users

- `GET /api/users?q=query` - Search users

---

## 🎨 Features Showcase

### Real-time Messaging with Socket.IO

Messages are delivered instantly with bidirectional WebSocket communication. No page refresh needed!

### Typing Indicators

See "User is typing..." indicators in real-time as others compose messages. Auto-disappears after 2 seconds of inactivity.

### Online Status

Green dots on user avatars show who's currently online. Updated in real-time as users connect/disconnect.

### Unread Badges

Cyan badges show unread message counts on each conversation. Automatically clears when you open the chat.

### Conversation Search

Use the search bar to filter conversations by contact name or message content. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows) to quickly focus the search.

### AI-Powered Features

- **Smart Replies**: Click the ✨ sparkle icon to get 3 AI-generated reply suggestions
- **Summarize**: Click "Summarize" button to get an AI-generated conversation summary
- **Context-Aware**: AI understands who said what and recent conversation history

### Professional UX

- **Loading Skeletons**: Beautiful loading states instead of spinners
- **Hover Timestamps**: See full date/time on hover
- **Keyboard Shortcuts**: Cmd+K for search, Escape to close dialogs
- **Dark Theme**: Sleek dark mode with cyan accents
- **Smooth Animations**: Polished transitions throughout

---

## 🔐 Security

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure session management with NextAuth
- **NoSQL Injection Prevention** - Mongoose schema validation
- **XSS Protection** - React's built-in escaping
- **CSRF Protection** - NextAuth CSRF tokens
- **Environment Variables** - Sensitive data in .env.local (gitignored)

---

## 📊 Performance

- ⚡ **Server Components** - Reduced client-side JavaScript
- 🎯 **Code Splitting** - Automatic route-based splitting
- 🗜️ **Image Optimization** - Next.js Image component
- 💾 **Caching** - API route caching strategies
- 📦 **Bundle Size** - Optimized with tree shaking

---

## 📈 Future Enhancements

- [ ] Voice messages
- [ ] File and image sharing
- [ ] Video calls
- [ ] Message reactions (👍, ❤️, 😂)
- [ ] Reply to specific messages (threading)
- [ ] Read receipts (✓✓)
- [ ] Edit/delete messages
- [ ] Push notifications
- [ ] Message search within conversations
- [ ] @mentions in group chats
- [ ] User profiles and settings
- [ ] Theme customization
- [ ] Export chat history
- [ ] Message forwarding

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Jayaram Uday**

- 🔗 **GitHub**: [@jayaramuday](https://github.com/jayaramuday)
- 💼 **LinkedIn**: [jayaramuday](https://linkedin.com/in/jayaramuday)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB](https://www.mongodb.com/) - Database platform
- [Socket.IO](https://socket.io/) - Real-time engine
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth](https://next-auth.js.org/) - Authentication

---

## 📞 Support

For support, open an issue on GitHub.

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (with Socket.IO)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

<div align="center">

**Built with ❤️ using Next.js 15, Socket.IO, MongoDB & Google Gemini AI**

[⬆ Back to Top](#convoflow-)

</div>
