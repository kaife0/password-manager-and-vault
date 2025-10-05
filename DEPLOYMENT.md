# Password Manager Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via GitHub (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_from_env_local
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_BASE=/api
COOKIE_NAME=token
NODE_ENV=production
```

### Step 4: Deploy
- Vercel will automatically build and deploy
- Your app will be available at: `https://your-project-name.vercel.app`

## 🌐 Deploy to Netlify (Alternative)

### Step 1: Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Step 2: Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables, add the same variables as Vercel.

## ✅ Post-Deployment Checklist

1. **Test Authentication**: Login/signup functionality
2. **Test Vault**: Add/edit/delete vault items
3. **Test Encryption**: Verify passwords are encrypted
4. **Test Theme Toggle**: Light/dark mode switching
5. **Test Responsive**: Mobile/tablet/desktop layouts
6. **Test MongoDB**: Data persistence across sessions

## 🔒 Security Notes

- ✅ Environment variables are secure on both platforms
- ✅ Your MongoDB credentials are encrypted
- ✅ JWT secrets remain server-side only
- ✅ Client-side encryption keys never leave the browser
- ✅ HTTPS is enforced automatically

## 📊 Expected Performance

- **Build Time**: 1-3 minutes
- **Cold Start**: < 1 second
- **Response Time**: 100-300ms
- **Database Queries**: 50-200ms
- **Encryption/Decryption**: < 10ms

## 🚨 Important Notes

1. **Same Database**: Your deployed app uses the SAME MongoDB database as local development
2. **Data Persistence**: All existing vault items will be available
3. **User Accounts**: Existing user accounts work immediately
4. **No Migration**: No data migration needed
5. **Environment Separation**: Use different databases for production if desired

## 🔧 Troubleshooting

If deployment fails:
1. Check environment variables are set correctly
2. Ensure MongoDB connection string is accessible from internet
3. Verify all dependencies are in package.json
4. Check build logs for specific errors

## 📱 Domain Configuration (Optional)

After deployment, you can:
1. Use provided subdomain (e.g., `my-password-manager.vercel.app`)
2. Add custom domain in platform settings
3. SSL certificates are automatic