# 🚀 ConvoFlow - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup ✅

- [ ] All dependencies installed (`npm install`)
- [ ] Database schema migrated (`npm run prisma:migrate`)
- [ ] `.env` file configured with all required variables
- [ ] Prisma client generated (`npm run prisma:generate`)

### 2. Test Locally ✅

```bash
npm run dev
```

- [ ] Can access http://localhost:3000
- [ ] Can create an account
- [ ] Can sign in
- [ ] Can create conversations
- [ ] Can send/receive messages in real-time
- [ ] AI features work (if OpenAI configured)

---

## Deployment Options

### Option 1: Vercel (Recommended) 🌟

**Why Vercel?**

- Native Next.js support
- Automatic deployments from Git
- Free SSL certificates
- Global CDN
- Serverless functions
- Free tier available

**Steps:**

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit - ConvoFlow chat app"
   git branch -M main
   git remote add origin https://github.com/jayaramuday/convoflow.git
   git push -u origin main
   ```

2. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables** (Add in Vercel Dashboard)

   ```
   DATABASE_URL=your-production-db-url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   PUSHER_APP_ID=your-pusher-id
   PUSHER_SECRET=your-pusher-secret
   NEXT_PUBLIC_PUSHER_APP_KEY=your-pusher-key
   NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster
   OPENAI_API_KEY=your-openai-key
   ```

4. **Database Options for Production**

   - **Vercel Postgres** (Integrated)
   - **Supabase** (Free tier: supabase.com)
   - **Neon** (Free tier: neon.tech)
   - **Railway** (railway.app)
   - **PlanetScale** (planetscale.com)

5. **After Deployment**
   ```bash
   # Run migrations on production database
   npx prisma migrate deploy
   ```

---

### Option 2: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

---

### Option 3: Railway

1. Create new project
2. Connect GitHub repo
3. Add PostgreSQL database (automatically provisions)
4. Add environment variables
5. Deploy automatically

---

### Option 4: Docker + Any VPS

**Dockerfile** (create in root):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy:**

```bash
docker build -t convoflow .
docker run -p 3000:3000 --env-file .env convoflow
```

---

## Production Database Setup

### Using Supabase (Free Tier)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in production environment
5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Using Neon (Serverless Postgres)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to production environment
5. Run migrations

---

## Pusher Configuration for Production

1. Go to [pusher.com](https://pusher.com) dashboard
2. Select your app
3. Go to "App Settings"
4. Add your production domain to "Allowed Origins"
5. Enable CORS if needed

---

## Security Checklist for Production

- [ ] `NEXTAUTH_SECRET` is unique and secure (32+ characters)
- [ ] `NEXTAUTH_URL` matches your production domain
- [ ] Database password is strong
- [ ] All API keys are kept secret
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Environment variables are not committed to Git
- [ ] `.env` file is in `.gitignore`

---

## Post-Deployment Testing

### Test These Features:

1. **Authentication**

   - [ ] Sign up with new account
   - [ ] Sign in with credentials
   - [ ] Protected routes work
   - [ ] Session persists after refresh

2. **Chat Functionality**

   - [ ] Create new conversation
   - [ ] Send messages
   - [ ] Receive messages in real-time
   - [ ] Messages persist after refresh
   - [ ] Search users works

3. **Real-time Features**

   - [ ] Open app in two different browsers
   - [ ] Send message from one
   - [ ] Verify it appears instantly in the other

4. **AI Features** (if configured)

   - [ ] AI suggestions generate
   - [ ] Suggestions are relevant
   - [ ] Can use suggestions to send messages

5. **Responsive Design**
   - [ ] Test on mobile device
   - [ ] Test on tablet
   - [ ] Test on desktop
   - [ ] Sidebar toggles on mobile

---

## Monitoring & Maintenance

### Set Up Monitoring

- **Vercel Analytics**: Automatic with Vercel
- **Sentry**: Error tracking (sentry.io)
- **LogRocket**: Session replay
- **Uptime Robot**: Uptime monitoring

### Database Maintenance

```bash
# Backup database (production)
pg_dump $DATABASE_URL > backup.sql

# Monitor database size
npx prisma studio
```

### Performance Optimization

- Enable Vercel Analytics
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Optimize images if added later

---

## Troubleshooting Production Issues

### Issue: Database Connection Error

**Solution:**

- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure IP whitelist includes Vercel IPs
- Run `npx prisma migrate deploy`

### Issue: Real-time Messages Not Working

**Solution:**

- Verify Pusher credentials
- Check allowed origins in Pusher dashboard
- Ensure websockets are not blocked
- Check browser console for errors

### Issue: NextAuth Error

**Solution:**

- Verify `NEXTAUTH_URL` matches deployment URL
- Ensure `NEXTAUTH_SECRET` is set
- Check cookies are enabled
- Clear browser cache

### Issue: Build Fails

**Solution:**

- Check all imports are correct
- Verify TypeScript has no errors: `npm run build`
- Ensure all dependencies are in package.json
- Check Node version (18+)

---

## Scaling Considerations

### When You Grow:

1. **Database**: Upgrade to larger tier or use connection pooling
2. **Pusher**: Upgrade to Pro plan for more concurrent connections
3. **OpenAI**: Monitor API usage and costs
4. **Caching**: Add Redis for session storage
5. **CDN**: Use Vercel's global edge network

### Performance Tips:

- Enable Prisma connection pooling
- Add database indexes (already included)
- Use React.memo for expensive components
- Implement pagination for message history
- Add message rate limiting

---

## CI/CD Pipeline (Advanced)

**GitHub Actions** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql
```

### Code Backups

- GitHub already provides version control
- Tag releases: `git tag -a v1.0.0 -m "Initial release"`

---

## Success Metrics to Track

1. **User Metrics**

   - New signups per day
   - Daily active users
   - Messages sent per day
   - Average session duration

2. **Technical Metrics**

   - API response times
   - Error rates
   - Real-time connection stability
   - Database query performance

3. **Business Metrics**
   - User retention rate
   - Feature adoption (AI suggestions)
   - Support tickets
   - User satisfaction

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Production build
npm run build
npm start

# Database
npx prisma migrate deploy    # Run migrations
npx prisma generate           # Generate client
npx prisma studio            # Database GUI

# Testing
npm test                     # Run tests
npm run lint                 # Check code quality

# Deployment
vercel                       # Deploy to Vercel
vercel --prod                # Deploy to production
```

---

## Support Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Pusher Docs**: [pusher.com/docs](https://pusher.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

## 🎉 Congratulations!

Your ConvoFlow application is now ready for the world!

**Live URL**: https://your-app.vercel.app

Remember to:

- ✅ Update your GitHub profile with the live link
- ✅ Add screenshots to README
- ✅ Share on LinkedIn
- ✅ Submit for the assignment

---

**Built with ❤️ by Jayaram Uday**

Good luck with your deployment! 🚀
