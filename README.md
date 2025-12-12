# ConvoFlow 🚀

A modern, real-time chat application built with **Next.js 15**, featuring AI-powered message suggestions, secure authentication, and instant messaging capabilities.

![ConvoFlow](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)

---

## ✨ Features

### Core Functionality

- 💬 **Real-time Messaging** - Instant message delivery using Pusher WebSockets
- 👥 **One-on-One & Group Chats** - Support for direct messaging and group conversations
- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth v5
- 🔍 **User Search** - Find and connect with other users
- 📱 **Responsive Design** - Fully responsive UI that works on all devices

### AI-Powered Features

- 🤖 **Smart Reply Suggestions** - AI-generated contextual reply recommendations
- ✨ **Message Improvement** - Enhance message clarity and tone
- 📊 **Conversation Summaries** - Automatically summarize long conversations
- 🎯 **Context-Aware Responses** - AI understands conversation history

### Technical Features

- 🚀 **Next.js 15** with App Router and React Server Components
- 🎨 **Modern UI** - Beautiful, gradient-based design with dark mode support
- 🔄 **Real-time Updates** - Live message delivery and presence indicators
- 🗄️ **PostgreSQL Database** - Robust data persistence with Prisma ORM
- 🔒 **Data Validation** - Input validation using Zod
- 🎭 **Type Safety** - Full TypeScript implementation
- ⚡ **Optimized Performance** - Server-side rendering and code splitting

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with server components
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM for database access
- **PostgreSQL** - Relational database
- **NextAuth** - Authentication solution
- **Pusher** - Real-time WebSocket service
- **OpenAI SDK** - AI-powered features

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting (implicit via Next.js)
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database
- **Pusher** account (free tier available)
- **OpenAI** API key (for AI features)

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

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/convoflow?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Pusher
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
convoflow/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── conversations/ # Chat endpoints
│   │   │   ├── users/        # User endpoints
│   │   │   ├── pusher/       # Pusher auth
│   │   │   └── ai/           # AI features
│   │   ├── auth/             # Auth pages (signin/signup)
│   │   ├── dashboard/        # Main chat interface
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── chat/             # Chat components
│   │   ├── ui/               # Reusable UI components
│   │   └── providers/        # Context providers
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   ├── pusher.ts         # Pusher configuration
│   │   └── utils.ts          # Utility functions
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Auth middleware
├── .env.example              # Environment template
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## 🔧 Configuration

### Pusher Setup

1. Create account at [Pusher.com](https://pusher.com)
2. Create a new Channels app
3. Get your app credentials from the dashboard
4. Update `.env` with your Pusher credentials

### OpenAI Setup

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add to `.env` as `OPENAI_API_KEY`

### Database Setup

**Using Local PostgreSQL:**

```bash
createdb convoflow
```

**Using Docker:**

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

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

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `PUSHER_*` variables
- `OPENAI_API_KEY`

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
- `PATCH /api/conversations/[id]/messages/[messageId]` - Edit message
- `DELETE /api/conversations/[id]/messages/[messageId]` - Delete message

### AI Features

- `POST /api/ai/generate` - Generate AI suggestions/summaries

### Users

- `GET /api/users?q=query` - Search users

---

## 🎨 Features Showcase

### Real-time Messaging

Messages are delivered instantly using Pusher WebSockets, providing a seamless chat experience.

### AI Smart Replies

Click the sparkle icon to get AI-generated reply suggestions based on conversation context.

### Responsive Design

Works perfectly on desktop, tablet, and mobile devices with an adaptive layout.

### Dark Mode

Automatically adapts to system theme preferences.

---

## 🔐 Security

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure session management
- **Input Validation** - Zod schemas for all inputs
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **XSS Protection** - React's built-in escaping
- **CSRF Protection** - NextAuth CSRF tokens

---

## 📊 Performance

- ⚡ **Server Components** - Reduced client-side JavaScript
- 🎯 **Code Splitting** - Automatic route-based splitting
- 🗜️ **Image Optimization** - Next.js Image component
- 💾 **Caching** - API route caching strategies
- 📦 **Bundle Size** - Optimized with tree shaking

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

---

## 📈 Future Enhancements

- [ ] Voice messages
- [ ] File sharing
- [ ] Video calls
- [ ] Message reactions
- [ ] Message threading
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Push notifications
- [ ] Message search
- [ ] User status (online/offline)

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
- 📧 **Email**: your.email@example.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Pusher](https://pusher.com/) - Real-time infrastructure
- [OpenAI](https://openai.com/) - AI capabilities
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using Next.js 15**

[⬆ Back to Top](#convoflow-)

</div>

# or

pnpm dev

# or

bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```
