# ConvoFlow - Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory and add:

### 1. Database (PostgreSQL)

**Option A: Local PostgreSQL**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/convoflow"
```

**Option B: Docker**

```bash
docker run --name convoflow-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=convoflow -p 5432:5432 -d postgres
```

**Option C: Cloud (Supabase/Neon/Railway)**
Use the connection string from your provider.

### 2. NextAuth

Generate a secret:

```bash
openssl rand -base64 32
```

Add to `.env`:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-your-generated-secret-here"
```

### 3. Pusher (Real-time)

1. Sign up at [pusher.com](https://pusher.com) (free tier available)
2. Create a new Channels app
3. Copy credentials to `.env`:

```env
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_APP_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

### 4. OpenAI (AI Features - Optional)

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env`:

```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

## Step 3: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your First Account

1. Click "Sign Up" on the homepage
2. Fill in your details
3. Sign in and start chatting!

## Troubleshooting

### Database Connection Error

- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Try: `npm run prisma:migrate` again

### Pusher Error

- Verify all Pusher credentials are correct
- Check app is in same cluster
- Enable "Client Events" in Pusher dashboard

### AI Features Not Working

- Verify OPENAI_API_KEY is valid
- Check you have credits in OpenAI account
- AI features are optional - app works without them

## Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Important for Production

1. Set NEXTAUTH_URL to your production domain
2. Update Pusher allowed origins
3. Set up production database (not localhost)
4. Enable SSL/HTTPS

## Scripts Reference

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Contact: your.email@example.com

---

**Happy Chatting! 🚀**
