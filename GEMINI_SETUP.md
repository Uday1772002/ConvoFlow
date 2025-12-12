`# 🤖 Getting Your Free Gemini API Key (1 minute)

## Quick Setup

1. **Go to Google AI Studio**

   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with Google Account**

   - Use your Gmail/Google account
   - Accept terms if prompted

3. **Create API Key**

   - Click **"Get API Key"** or **"Create API Key"**
   - Click **"Create API key in new project"** (or select existing project)
   - Copy your API key (starts with `AIza...`)

4. **Add to .env File**

   ```bash
   GEMINI_API_KEY="AIzaSyC..."  # Paste your key here
   ```

5. **Restart Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## Free Tier Limits

- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **1 million tokens per month**
- ✅ Perfect for development and testing

## Testing AI Features

Once you have the API key configured:

1. **Smart Replies**: Click the ✨ Sparkle icon while chatting
2. **AI Suggestions**: Get 3 AI-generated reply options
3. **Message Improvements**: AI helps write better messages

---

## No API Key? No Problem!

The chat app works perfectly fine without AI features:

- ✅ Real-time messaging works (Socket.io)
- ✅ Conversations work
- ✅ Multiple users work
- ❌ AI suggestions won't work (button will show error)

You can add the API key later anytime!

---

**Your app is now using:**

- ✅ Socket.io for real-time chat (instant delivery)
- ✅ Google Gemini AI for smart features
- ✅ PostgreSQL for data storage
- ✅ No external services needed (except optional AI)
