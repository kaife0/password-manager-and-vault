# 🔐 Privacy-First Password Manager & Vault

A minimal, fast, privacy-first password manager built with **Next.js 15**, **TypeScript**, and **MongoDB**. Features complete client-side encryption, responsive design, and modern UI with light/dark themes.

## ✨ Features

### 🔒 Security & Privacy
- **Client-side encryption** - All encryption/decryption happens in your browser using Web Crypto API
- **Zero-knowledge architecture** - Server never sees your plaintext passwords or data
- **Strong cryptography** - PBKDF2 (200,000 iterations) + AES-GCM for military-grade encryption
- **Secure session management** - JWT tokens with httpOnly cookies
- **Auto-clearing clipboard** - Passwords automatically clear from clipboard after 15 seconds

### � User Experience
- **Responsive design** - Perfect for phones, tablets, and laptops
- **Light/Dark themes** - Theme toggle available on all pages (including login/signup)
- **Manual vault unlock** - Login first, generate passwords, then unlock vault when needed
- **Real-time search** - Search your vault instantly (searches decrypted data client-side)
- **Modern UI** - Clean interface with Lucide React icons and Tailwind CSS

### 🔧 Technical Features
- **Secure password generator** - Cryptographically secure random generation with customizable options
- **Vault management** - Add, edit, delete, and organize password entries
- **Copy protection** - One-click password copying with automatic clipboard clearing
- **Form paste support** - Paste passwords directly into vault forms
- **Mobile optimization** - Touch-friendly interface with responsive tables
- **Performance optimized** - Fast loading and smooth interactions

## How to Run Locally

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/kaife0/password-manager-and-vault
   cd password-manager
   npm install
   ```

2. **Create environment file:**
   
   Create `.env.local` in the project root:
   ```bash
   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/password-manager
   
   # JWT Configuration (generate a strong secret)
   JWT_SECRET=your_super_strong_jwt_secret_here_replace_this_with_random_string
   JWT_EXPIRES_IN=7d
   
   # API Configuration  
   NEXT_PUBLIC_API_BASE=/api
   
   # Cookie Configuration
   COOKIE_NAME=token
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to `http://localhost:3000`

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with Pages Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Responsive Design** - Mobile-first approach

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database (Atlas cloud or local)
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Security
- **Web Crypto API** - Browser-native cryptography
- **PBKDF2** - Key derivation (200,000 iterations)
- **AES-GCM** - Authenticated encryption
- **httpOnly Cookies** - Secure session management

## 🔐 Security Architecture

### Encryption Flow
1. **User Registration**: Password hashed with bcrypt, encryption salt generated
2. **Login**: Derive encryption key from password + salt (client-side only)
3. **Data Storage**: Vault items encrypted with AES-GCM before sending to server
4. **Data Retrieval**: Encrypted data decrypted client-side using derived key

### Key Security Features
- **Zero-knowledge**: Server never sees plaintext passwords or vault data
- **Client-side encryption**: All crypto operations happen in browser
- **Salt per user**: Unique encryption salt for each user account
- **Secure sessions**: JWT tokens in httpOnly cookies
- **Auto-logout**: Sessions expire after 7 days
- **Clipboard security**: Auto-clear clipboard after 15 seconds

## 📱 User Interface

### Theme System
- **Dark mode default**: Professional dark theme as default
- **Light/Dark toggle**: Available on all pages including login/signup
- **Persistent choice**: Theme preference saved in localStorage
- **System integration**: Respects system color scheme preferences

### Responsive Design
- **Mobile (320px+)**: Compact layout, stacked elements, touch-friendly
- **Tablet (640px+)**: Optimized spacing, selective column visibility
- **Laptop (1024px+)**: Full layout with all features visible
- **Desktop (1280px+)**: Spacious design with optimal user experience

### User Experience
- **Manual vault unlock**: Login → Generate passwords → Manually unlock vault
- **Form paste support**: Paste passwords directly into vault item forms
- **Real-time search**: Instant filtering of vault items
- **Visual feedback**: Loading states, hover effects, smooth transitions

## 🚀 Deployment Guide

### Vercel (Recommended for Next.js)
1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Import to Vercel**: Connect your GitHub repo at [vercel.com](https://vercel.com)
3. **Configure Environment Variables**: Add production environment variables
4. **Deploy**: Vercel automatically builds and deploys your app

### Environment Variables for Production
Add these in your deployment platform (Vercel/Netlify):

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_BASE=/api
COOKIE_NAME=token
NODE_ENV=production
```

### MongoDB Setup
- **Local Development**: Use local MongoDB or MongoDB Atlas free tier
- **Production**: Recommended to use MongoDB Atlas cloud database
- **Same Database**: Your deployed app can use the same database as local development
- **Data Persistence**: All existing vault items and user accounts work immediately

### Deployment Verification
After deployment, test:
- ✅ User registration and login
- ✅ Password generation with all options
- ✅ Vault unlock and data access
- ✅ Add, edit, delete vault items
- ✅ Theme toggle functionality
- ✅ Responsive design on mobile/tablet
- ✅ Data encryption (check network tab)

## 🧪 Testing & Verification

### Security Verification
1. **Database Check**: Connect to MongoDB and verify only encrypted `ciphertext` and `iv` are stored
2. **Network Analysis**: Use browser DevTools to confirm no plaintext data in API calls
3. **Encryption Test**: Add a vault item, check database shows encrypted data only
4. **Session Security**: Verify JWT tokens are httpOnly and secure

### Browser Compatibility
- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📋 Usage Guide

### Getting Started
1. **Sign Up**: Create account with email and strong master password
2. **Login**: Access dashboard with password generator
3. **Generate Passwords**: Use customizable password generator
4. **Unlock Vault**: Click "Unlock Vault" when needed
5. **Add Items**: Store website credentials securely

### Best Practices
- **Master Password**: Use a strong, unique master password
- **Generated Passwords**: Use the built-in generator for maximum security
- **Regular Updates**: Update stored passwords periodically
- **Backup**: Export vault data or maintain backup of MongoDB

## 🤝 Contributing

### Project Structure
```
src/
├── components/          # React components
│   ├── AuthForm.tsx     # Login/signup form
│   ├── VaultList.tsx    # Vault items display
│   ├── VaultItemRow.tsx # Individual vault item
│   └── PasswordGenerator.tsx # Password generation
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Main dashboard
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── models/             # Database models
├── styles/             # CSS styles
└── utils/              # Helper functions
```

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make changes and test thoroughly
6. Submit pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **GitHub Repository**: https://github.com/kaife0/password-manager-and-vault
- **Documentation**: See `DEPLOYMENT.md` for detailed deployment guide

---

**Built with ❤️ using Next.js, TypeScript, and client-side encryption for maximum privacy and security.**

## Security Notes

- Never log or console.log sensitive data in production
- Use strong, randomly generated JWT secrets  
- Ensure HTTPS in production (handled by Vercel)
- Consider rate limiting for auth endpoints
- The application is designed to be zero-knowledge - server never sees plaintext

## Contributing

This is a minimal implementation focused on security and privacy. Contributions should maintain these principles.
