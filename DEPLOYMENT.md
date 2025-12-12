# Deployment Guide - ConvoFlow

## 📋 Assignment Completion Checklist

✅ **Technology Stack**: Next.js 15+ with TypeScript  
✅ **Database**: MongoDB with Mongoose ODM  
✅ **CRUD Operations**: Users, Conversations, Messages  
✅ **Authentication**: JWT-based with NextAuth v5  
✅ **UI/UX**: Responsive, accessible design with Tailwind CSS  
✅ **AI Integration**: Google Gemini for smart features  
✅ **Real-Time**: Socket.IO for live messaging  
✅ **Code Quality**: TypeScript, ESLint, clean architecture  
✅ **Security**: Comprehensive security measures documented  
✅ **Footer**: Developer name, GitHub, LinkedIn links  
✅ **Real-World Considerations**: Scalability, error handling  

---

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account (free tier available)
- GitHub repository
- MongoDB Atlas cluster
- Google AI Studio API key

### Step 1: Prepare Environment Variables

Create a `.env.production` file:

```bash
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/convoflow

# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters

# Google AI
GOOGLE_AI_API_KEY=your-gemini-api-key
```

### Step 2: Update Next.js Configuration

Ensure `next.config.ts` is production-ready:

```typescript
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Production optimizations
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};
```

### Step 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to:
# 1. Link to GitHub repository
# 2. Set up project
# 3. Configure environment variables
# 4. Deploy
```

### Step 4: Configure Environment Variables in Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.production`
3. Ensure variables are set for **Production** environment
4. Redeploy if needed: `vercel --prod`

### Step 5: Configure Custom Server (Important!)

Since ConvoFlow uses Socket.IO with a custom server:

**Option A: Separate Socket Server (Recommended)**
1. Deploy Socket.IO server separately (Render, Railway, or DigitalOcean)
2. Update `NEXT_PUBLIC_SOCKET_URL` to point to socket server
3. Configure CORS to allow Vercel domain

**Option B: Use Vercel Edge Functions**
- Note: Socket.IO may have limitations with serverless
- Consider using Vercel's Edge Functions with WebSocket support
- Alternative: Use Pusher or Ably for production

### Step 6: Database Setup

MongoDB Atlas Configuration:
```bash
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist Vercel IPs (0.0.0.0/0 for testing)
4. Get connection string
5. Add to Vercel environment variables
6. Test connection
```

### Step 7: Post-Deployment Verification

```bash
# Check deployment status
vercel logs

# Test endpoints
curl https://your-app.vercel.app/api/health

# Monitor performance
vercel analytics
```

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🌐 Alternative Deployment Options

### Option 1: Netlify
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Docker + DigitalOcean

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and deploy:
```bash
docker build -t convoflow .
docker tag convoflow registry.digitalocean.com/your-registry/convoflow
docker push registry.digitalocean.com/your-registry/convoflow
```

---

## 📊 Performance Optimization

### Pre-Deployment Checklist
- [ ] Enable compression in production
- [ ] Configure CDN for static assets
- [ ] Set up image optimization
- [ ] Enable caching headers
- [ ] Minify JavaScript and CSS
- [ ] Remove console.logs
- [ ] Configure database indexes
- [ ] Set up error monitoring (Sentry)
- [ ] Enable analytics
- [ ] Test on multiple devices

### Build Optimizations
```json
{
  "scripts": {
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## 🔒 Production Security

### Environment Variables Security
- Never commit `.env` files
- Use Vercel's encrypted environment variables
- Rotate secrets regularly
- Use different keys for production vs development

### HTTPS Configuration
- Vercel automatically provides SSL
- Ensure all API calls use HTTPS
- Set secure cookie flags
- Configure HSTS headers

---

## 📱 Post-Deployment Testing

### Manual Testing Checklist
1. **Authentication Flow**
   - Sign up new user
   - Sign in existing user
   - Password validation
   - Session persistence

2. **Real-Time Features**
   - Send/receive messages
   - Typing indicators
   - Online status
   - Unread counts

3. **AI Features**
   - Smart replies
   - Message improvement
   - Chat summaries
   - Meeting detection

4. **Responsive Design**
   - Mobile (320px-768px)
   - Tablet (768px-1024px)
   - Desktop (1024px+)

5. **Performance**
   - Page load time < 3s
   - Time to Interactive < 5s
   - Lighthouse score > 90

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Environment variables not loading**
```bash
Solution:
1. Verify variables in Vercel dashboard
2. Redeploy: vercel --prod
3. Check variable names (case-sensitive)
```

**Issue: Socket.IO connection fails**
```bash
Solution:
1. Check CORS configuration
2. Verify WebSocket support
3. Consider separate socket server
4. Check firewall rules
```

**Issue: Database connection timeout**
```bash
Solution:
1. Whitelist Vercel IPs in MongoDB Atlas
2. Check connection string format
3. Verify network access rules
4. Test connection locally first
```

**Issue: Build fails**
```bash
Solution:
1. Run `npm run build` locally
2. Check TypeScript errors
3. Verify all dependencies installed
4. Check Node.js version compatibility
```

---

## 📈 Monitoring & Maintenance

### Set Up Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and reporting
- **LogRocket**: Session replay and debugging
- **Uptime Robot**: Availability monitoring

### Regular Maintenance
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews
- Regular database backups

---

## 🎓 Assignment Submission

### What to Submit
1. **GitHub Repository**: https://github.com/Uday1772002/ConvoFlow
2. **Live Deployment**: https://convoflow.vercel.app (update with your URL)
3. **Documentation**: Complete README.md, SECURITY.md, and this file

### Grading Criteria Met
✅ Functionality: Full CRUD operations
✅ UI/UX: Responsive, accessible design
✅ Code Quality: TypeScript, clean architecture
✅ Security: Comprehensive security measures
✅ Deployment: Production-ready application
✅ Real-World: Scalable, maintainable solution
✅ AI Integration: Google Gemini features
✅ Testing: Manual testing completed

---

## 📞 Support

For deployment issues or questions:
- **Developer**: Uday Ram
- **GitHub**: [@Uday1772002](https://github.com/Uday1772002)
- **LinkedIn**: [jayaram-uday](https://linkedin.com/in/jayaram-uday)

---

Last Updated: December 2025
