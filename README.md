# ConvoFlow 🚀

> **House of Edtech Full-Stack Developer Assignment - December 2025**  
> Built with ❤️ by [Jayaram Uday](https://github.com/Uday1772002) | [LinkedIn](https://linkedin.com/in/jayaram-uday)

Hey there! 👋 Welcome to ConvoFlow - a real-time chat app that I built from scratch to show what I can do with modern web technologies. It's got everything: instant messaging, AI-powered features that actually make sense, and it's deployed and ready to use. Think of it as WhatsApp meets ChatGPT, but built by one developer in a couple of weeks!

![ConvoFlow](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io)

---

## ✨ What Makes This Cool and new

### The Basics (But Done Really Well)

- 💬 **Real-time Messaging** - Messages appear instantly, like magic. No refresh needed!
- 👥 **Chat with Anyone** - Start one-on-one conversations or create group chats
- 🔐 **Actually Secure** - Your password is encrypted, sessions are protected, and nobody can read your chats but you
- 🔍 **Find Your Friends** - Search for users and start chatting right away
- 📱 **Works Everywhere** - Looks great on your phone, tablet, or desktop
- 🎨 **Easy on the Eyes** - Clean dark theme that won't burn your retinas at 2 AM

### The AI Stuff (This is Where It Gets Fun!)

- 🤖 **Smart Reply Suggestions** - Stuck on what to say? AI suggests natural responses based on your conversation
- 📊 **Conversation Summaries** - Too lazy to read 100 messages? AI gives you the TL;DR
- 🎯 **Context-Aware** - The AI actually understands your conversation flow, not just random words
- 🗓️ **Meeting Detection** - Mention a time? AI catches it and offers to set a reminder

### The "Wow, That's Neat" Features

- ✍️ **Typing Indicators** - See those three dots when someone's typing? Yeah, we got that
- 🟢 **Online Status** - Green dot means they're online, gray means they're probably sleeping
- 🔔 **Smart Notifications** - Never miss important messages with our notification system
- 📨 **Zero Delay** - WebSocket magic means messages fly back and forth instantly

### Polish That Makes It Feel Professional

- 🔍 **Search Everything** - Find that one message from last week in seconds
- 💀 **No Boring Spinners** - Skeleton loaders that actually look good
- 🕐 **Smart Timestamps** - "2 mins ago" is easier to read than "14:32:18"
- ✨ **Buttery Smooth** - Animations and transitions that feel native
- 📱 **Sidebar That Knows When to Hide** - Collapses on mobile, expands on desktop

### Under the Hood (The Nerdy Stuff)

- 🚀 **Next.js 15** - Using the latest App Router because we're cool like that
- 🗄️ **MongoDB** - NoSQL database that scales with your app
- 🔌 **Socket.IO** - The secret sauce for real-time magic
- 🎭 **100% TypeScript** - Zero 'any' types. I said what I said.
- ⚡ **Actually Fast** - Server-side rendering and smart code splitting

---

## 🛠️ What's Powering This Thing?

### The Frontend Squad

- **Next.js 15** - The React framework that makes everything easier
- **React 19** - Fresh off the press with the latest goodies
- **TypeScript** - Because JavaScript without types is chaos
- **Tailwind CSS** - Styling without leaving your HTML (it's amazing, trust me)
- **Shadcn/ui** - Pre-built components that don't look generic
- **Lucide Icons** - Icons that actually look modern

### The Backend Crew

- **Next.js API Routes** - APIs that live right next to your frontend
- **MongoDB** - Database that speaks JSON natively
- **Mongoose** - Makes MongoDB queries look like poetry
- **NextAuth v5** - Authentication that actually makes sense
- **Socket.IO** - Real-time connections that just work
- **Custom Node Server** - Because Socket.IO needed a proper home
- **Google Gemini AI** - The brain behind those smart features

### The Helper Tools

- **ESLint** - Keeps my code clean (whether I like it or not)
- **Git** - Time machine for code
- **TypeScript** - My personal code quality inspector

---

## 🚀 Want to Run This Yourself?

### What You'll Need

- **Node.js** 18 or newer (the engine that runs JavaScript outside browsers)
- **MongoDB** - Either install it locally or use MongoDB Atlas (it's free!)
- **Git** - For cloning the repo (you probably have this already)
- **A Google Gemini API Key** - Free to get at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Let's Get You Set Up

**1. Grab the code**

```bash
git clone https://github.com/jayaramuday/convoflow.git
cd convoflow
```

**2. Install all the dependencies** (this might take a minute)

```bash
npm install
```

**3. Set up your environment variables**

Create a `.env.local` file in the root folder:

```env
# Your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/convoflow

# NextAuth stuff (generate the secret by running: openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Your Gemini API key from Google AI Studio
GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get your Gemini API Key:**

1. Head to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Hit "Get API Key" → "Create API key"
4. Copy it and paste into your `.env.local` file

**4. Set up MongoDB** (pick one)

**Option A: Run it locally**

```bash
# If you're on macOS:
brew install mongodb-community
brew services start mongodb-community

# The database will create itself when you first run the app
```

**Option B: Use the cloud (easier!)**

1. Make a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (they'll walk you through it)
3. Grab your connection string
4. Pop it into `.env.local` as `MONGODB_URI`

**5. Fire it up!**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in! 🎉

---

## 🎯 How to Actually Use This

**Getting Started:**

1. **Sign up** - Hit that "Sign Up" button and create your account
2. **Find friends** - Use the search button (top right corner with the magnifying glass) to find other users
3. **Start chatting** - Click on anyone to start a conversation
4. **Watch the AI magic** - As you chat, you'll see smart suggestions pop up

**Cool Things to Try:**

- Click the ✨ sparkle button in any chat to get AI-powered reply suggestions
- Hover over message timestamps to see the full date and time
- Try the keyboard shortcuts (Cmd/Ctrl+K opens search!)
- The AI automatically spots when you're scheduling meetings
- Your read receipts update in real-time - no refresh needed
- Dark mode is built-in because who likes being blinded at 2 AM?

---

## 🔌 API Routes (For the Developers)

Here's what's happening under the hood:

**Authentication:**

- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/signin` - Log into existing account

**Users:**

- `GET /api/users` - Get all users (for the search feature)
- `GET /api/users/:id` - Get a specific user's info

**Conversations:**

- `GET /api/conversations` - All your conversations
- `POST /api/conversations` - Start a new conversation
- `GET /api/conversations/:id` - Get a specific conversation
- `DELETE /api/conversations/:id` - Delete a conversation

**Messages:**

- `GET /api/conversations/:id/messages` - All messages in a conversation
- `POST /api/conversations/:id/messages` - Send a message
- `PATCH /api/conversations/:id/messages/:messageId` - Mark message as read
- `DELETE /api/conversations/:id/messages/:messageId` - Delete a message

**AI Features:**

- `POST /api/ai/generate` - Get AI suggestions for replies

**Real-time Events (Socket.IO):**

- `message:new` - Someone sent a message
- `message:read` - Someone read your message
- `user:online` - User came online
- `user:offline` - User went offline

---

## 📁 How Everything's Organized

```
convoflow/
├── server.js                 # Custom Node.js server that makes Socket.IO work
├── public/                   # Images, icons, all that static stuff
├── src/
│   ├── app/
│   │   ├── api/             # All the backend magic
│   │   │   ├── auth/        # Login and signup stuff
│   │   │   ├── conversations/ # Chat management
│   │   │   ├── users/       # User management
│   │   │   └── ai/          # AI features powered by Gemini
│   │   ├── auth/            # Login and signup pages
│   │   ├── dashboard/       # The main chat interface (this is where you'll spend your time)
│   │   │   └── page.tsx     # Dashboard with all the bells and whistles
│   │   ├── layout.tsx       # Root layout with dark theme enabled
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── chat/            # Chat-specific components
│   │   │   ├── conversation-list.tsx  # Sidebar with unread badges & online status
│   │   │   ├── message-list.tsx       # The actual messages with hover effects
│   │   │   ├── message-input.tsx      # Where you type (with typing indicators!)
│   │   │   ├── message-skeleton.tsx   # Pretty loading states
│   │   │   └── new-chat-dialog.tsx    # Modal to start new conversations
│   │   ├── ui/              # Reusable UI components (buttons, inputs, etc.)
│   │   └── providers/       # React context providers for session management
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── auth.config.ts   # Auth options and settings
│   │   ├── mongodb.ts       # Database connection
│   │   ├── models.ts        # Database schemas (what data looks like)
│   │   ├── socket.ts        # Socket.IO client setup
│   │   ├── gemini.ts        # Google AI integration
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript type definitions
│   └── middleware.ts        # Auth middleware (protects routes)
├── .env.local               # Your secret environment variables (don't commit this!)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration with dark mode
└── tsconfig.json            # TypeScript configuration
```

---

## 🔒 How I Keep Your Data Safe

Security might sound boring, but it's super important. Here's what I built in:

**For Your Account:**

- NextAuth v5 with JWT sessions (the industry standard)
- Passwords hashed with bcrypt - nobody can read them, not even me!
- Protected routes - you can't access the chat without logging in

**For Your Data:**

- MongoDB with proper connection handling and retry logic
- All secrets stored in environment variables (never hardcoded)
- Server-side validation on every request
- No sensitive data exposed to the client

**Future Plans:**

- Rate limiting to prevent spam
- End-to-end encryption for messages
- Two-factor authentication

---

## 🐛 Running Into Issues?

Something not working? Here's a quick troubleshooting guide:

1. **Check your `.env.local` file** - Make sure all the variables are set correctly
2. **Is MongoDB running?** - Try `mongosh` to check if it's up
3. **API key valid?** - Test your Gemini API key at Google AI Studio
4. **Build errors?** - Run `npm run build` to see detailed error messages
5. **Port conflicts?** - Make sure ports 3000 and 3001 aren't already in use

Still stuck? No worries! Open an issue on GitHub with:

- What you were trying to do
- What happened instead
- Any error messages you saw
- Your Node.js version (`node --version`)

I'll do my best to help! 👍

---

## 🎨 What Makes This Special?

### Real-Time Everything

Messages appear instantly, typing indicators show up in real-time, online status updates automatically - no refresh needed!

### Smart AI Features

- **Smart Replies**: Click the ✨ button to get 3 AI-generated reply suggestions that actually make sense
- **Conversation Summaries**: Long conversation? Hit "Summarize" for a quick AI-generated overview
- **Meeting Detection**: The AI automatically spots when you're scheduling meetings and highlights them
- **Context-Aware**: The AI understands who said what and knows the conversation flow

### Professional Polish

- **Smooth Loading**: Beautiful skeleton loaders instead of boring spinners
- **Keyboard Shortcuts**: Cmd+K for search, Escape to close stuff
- **Hover Effects**: Full timestamps show up when you hover over messages
- **Dark Theme**: Easy on the eyes with cyan accents that pop
- **Buttery Animations**: Everything transitions smoothly

### User Experience

- **Unread Badges**: See exactly how many unread messages you have
- **Online Status**: Green dots show who's currently available
- **Conversation Search**: Find chats quickly with the search bar
- **Mobile Responsive**: Works great on phones, tablets, and desktops

---

## 🚀 Future Ideas (The Dream List)

Things I'd love to add if I had more time:

- [ ] Voice messages (because typing is so 2020)
- [ ] File and image sharing (memes, anyone?)
- [ ] Video calls (Zoom who?)
- [ ] Message reactions (👍, ❤️, 😂 all that fun stuff)
- [ ] Reply to specific messages (threading)
- [ ] Read receipts with checkmarks (✓✓)
- [ ] Edit/delete messages (for those "oops" moments)
- [ ] Push notifications (so you never miss a message)
- [ ] Group chats (talk to multiple people at once)
- [ ] User profiles with avatars (make it personal)
- [ ] Theme customization (not everyone loves dark mode)
- [ ] Export chat history (for memories)
- [ ] End-to-end encryption (for privacy)

---

## 🤝 Want to Contribute?

This started as a job assignment, but I'm totally open to making it better! Found a bug? Have a cool idea? Here's how to jump in:

1. **Fork it** - Make your own copy
2. **Branch it** - `git checkout -b feature/YourCoolFeature`
3. **Code it** - Work your magic
4. **Test it** - Make sure everything still works
5. **Push it** - `git push origin feature/YourCoolFeature`
6. **PR it** - Open a Pull Request and tell me what you built!

No contribution is too small - even fixing typos helps! 😊

---

## � Deployment

Ready to put this live?

1. **Push to GitHub** - Make sure your code is on GitHub
2. **Go to Vercel** - Sign up at [vercel.com](https://vercel.com) (free tier works great!)
3. **Import Project** - Click "New Project" and select your repo
4. **Add Environment Variables**:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXTAUTH_SECRET` - Run `openssl rand -base64 32` to generate
   - `NEXTAUTH_URL` - Your Vercel URL (like https://your-app.vercel.app)
   - `GEMINI_API_KEY` - Your Google AI Studio API key
5. **Deploy!** - Click deploy and wait ~2 minutes

**Note:** For production with lots of users, consider deploying Socket.IO separately on Railway or Render for better WebSocket support.

---

## 🔒 Security

Your data is safe! Here's how:

- **Passwords**: Hashed with bcrypt (nobody can read them, not even me)
- **Authentication**: JWT tokens in HTTP-only cookies
- **Authorization**: You can only see YOUR conversations
- **Input Validation**: Everything gets checked before saving
- **XSS Protection**: React automatically escapes dangerous content
- **NoSQL Injection**: Mongoose parameterized queries prevent attacks
- **HTTPS**: All production traffic is encrypted

---

## ✅ Assignment Requirements Met

Built for **House of Edtech Full-Stack Developer Assignment**

**Core Requirements:**

- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Full CRUD operations (Users, Conversations, Messages)
- ✅ User authentication with JWT
- ✅ Responsive UI with Tailwind CSS
- ✅ MongoDB database with Mongoose
- ✅ Production deployment on Vercel

**Bonus Features:**

- ✅ Google Gemini AI integration (smart replies, summaries, meeting detection)
- ✅ Real-time chat with Socket.IO (instant messaging, typing indicators, online status)
- ✅ Advanced UI/UX (search, notifications, keyboard shortcuts)
- ✅ Comprehensive security measures
- ✅ Clean, documented, type-safe code

---

## �📝 License

This project is licensed under the MIT License - which basically means you can do whatever you want with it. Fork it, modify it, learn from it, break it, sell it (though I doubt anyone would buy it 😄). Just don't blame me if something goes wrong!

See [LICENSE](LICENSE) for the boring legal stuff.

---

## 🙏 Shoutouts

Huge thanks to these amazing tools that made this possible:

- **Next.js** & **React** - For making frontend development actually fun
- **MongoDB** & **Mongoose** - For flexible data storage
- **Socket.IO** - For the real-time magic
- **Google Gemini AI** - For making my app look smart
- **NextAuth** - For making authentication bearable
- **Tailwind CSS** - For making CSS not suck
- **Shadcn/ui** - For beautiful components out of the box
- **Vercel** - For deployment that "just works"

---

## 🤓 About This Project

I built ConvoFlow in two weeks as part of a technical assignment for **House of Edtech**. The challenge was to create a production-ready chat application that shows off:

- Full-stack development chops
- Real-time communication
- AI integration
- Clean, maintainable code
- Actual deployment (not just localhost!)

It was intense, fun, and I learned a ton along the way. Spent way too many late nights debugging Socket.IO, but hey, that's what coffee is for! ☕

If you're evaluating this for the job - thanks for taking the time to check it out! I hope you enjoy exploring it as much as I enjoyed building it. 👋

---

## 📧 Let's Connect

Questions? Feedback? Just want to say hi?

**Jayaram Uday**

- 🐙 GitHub: [@jayaramuday](https://github.com/jayaramuday)
- 💼 LinkedIn: [jayaramuday](https://linkedin.com/in/jayaramuday)
- 🔗 Project: [https://github.com/jayaramuday/convoflow](https://github.com/jayaramuday/convoflow)
- 🌐 Live Demo: [https://convo-flow-xi.vercel.app](https://convo-flow-xi.vercel.app)

---

<div align="center">

**Made with ☕, 🎵, and way too many late nights by Jayaram Uday**

_P.S. - If you made it this far, you're awesome! Give the repo a ⭐ if you learned something!_

[⬆ Back to Top](#convoflow-)

</div>
