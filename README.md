# Privacy-First Password Manager

A minimal, fast, client-side encrypted password manager built with Next.js, TypeScript, and MongoDB. All encryption and decryption happens in your browser - the server only stores encrypted data.

## Features

- 🔒 **Client-side encryption** - All encryption/decryption happens in your browser using Web Crypto API
- 🔑 **Strong crypto** - PBKDF2 (200,000 iterations) + AES-GCM for encryption
- 🚀 **Fast & minimal** - Built with Next.js and Tailwind CSS
- 📱 **Responsive design** - Works on desktop and mobile
- 🎲 **Secure password generator** - Cryptographically secure random generation
- 📋 **Auto-clearing clipboard** - Passwords auto-clear from clipboard after 15 seconds
- 🔍 **Real-time search** - Search your vault instantly (on decrypted data)
- 💾 **Zero-knowledge** - Server never sees your plaintext passwords

## How to Run Locally

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
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
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Cryptography

This application uses industry-standard cryptography for maximum security:

- **Key Derivation:** PBKDF2 with SHA-256, 200,000 iterations
- **Encryption:** AES-GCM with 256-bit keys and 96-bit random IVs  
- **Salt:** 16 random bytes per user, stored server-side but used client-side

The combination provides strong protection against brute-force attacks while ensuring data remains encrypted even if the server is compromised.

## Security Verification

### Database Verification

Connect to your MongoDB and verify encrypted storage:

```bash
# Connect to your MongoDB
mongo mongodb://localhost:27017/password-manager

# Check that passwords are encrypted
db.vaultitems.find().pretty()
```

You should see only `ciphertext` and `iv` fields - no plaintext passwords.

### Network Verification  

1. Open browser Developer Tools → Network tab
2. Perform actions (add/edit passwords)
3. Verify that requests to `/api/items` contain only encrypted `ciphertext` and `iv` fields
4. Confirm no plaintext passwords are transmitted

### Acceptance Checklist

- ✅ Signup creates user with `passwordHash` and `encryptionSalt` in database
- ✅ Login sets httpOnly cookie and returns `encryptionSaltBase64`  
- ✅ Adding items sends only `ciphertext` and `iv` to server
- ✅ Database contains only encrypted data (no plaintext)
- ✅ Network traffic shows no plaintext passwords
- ✅ Clipboard auto-clears after 15 seconds
- ✅ Search works on decrypted data client-side
- ✅ Edit/Delete operations maintain encryption

## Demo Script (60-90 seconds)

Record a screen demo following these steps:

1. **Signup** (10s)
   - Navigate to signup page
   - Create account with email/password
   - Show success message

2. **Login** (10s)  
   - Login with credentials
   - Show redirect to dashboard

3. **Generate Password** (15s)
   - Adjust length slider (e.g., 20 characters)
   - Toggle character types (uppercase, symbols, etc.)
   - Click "Generate Password"
   - Click "Copy" and show countdown timer

4. **Add Vault Item** (20s)
   - Click "Add Item"
   - Fill form: Title="Gmail", Username="user@example.com", paste generated password
   - Add URL="https://gmail.com"
   - Click "Save"

5. **Search & Edit** (15s)
   - Type "Gmail" in search box
   - Show filtered results  
   - Click "Edit" on the item
   - Modify the title to "Gmail Account"
   - Save changes

6. **Verify Security** (15s)
   - Open browser Developer Tools → Network tab
   - Edit an item again
   - Show network request contains only encrypted data
   - Open Application tab → Cookies, show httpOnly token

7. **Delete** (5s)
   - Click "Delete" on an item
   - Confirm deletion

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-manager
JWT_SECRET=<generate-strong-32-char-secret>
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_BASE=/api
COOKIE_NAME=token
```

## Security Notes

- Never log or console.log sensitive data in production
- Use strong, randomly generated JWT secrets  
- Ensure HTTPS in production (handled by Vercel)
- Consider rate limiting for auth endpoints
- The application is designed to be zero-knowledge - server never sees plaintext

## Contributing

This is a minimal implementation focused on security and privacy. Contributions should maintain these principles.
