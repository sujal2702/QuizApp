# 🔐 Firebase Admin Authentication Setup Guide

## Quick Setup Checklist

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] First admin user created in Firebase Console
- [ ] Service account key downloaded (`serviceAccountKey.json`)
- [ ] Admin claim granted via helper script
- [ ] Database security rules deployed
- [ ] Admin login tested

---

## 📋 Step-by-Step Instructions

### 1️⃣ Enable Authentication
**Firebase Console** → **Authentication** → **Get Started** → Enable **Email/Password**

### 2️⃣ Create Admin User
**Authentication** → **Users** → **Add user**
- Email: `admin@yourdomain.com`
- Password: (strong password)
- **Copy the UID!** (e.g., `kX9mP2nQ3rT4sU5vW6xY7z`)

### 3️⃣ Download Service Account
**Project Settings** → **Service Accounts** → **Generate new private key**
- Save as: `serviceAccountKey.json` in project root
- ⚠️ Keep this file secret (never commit to git)

### 4️⃣ Grant Admin Claim
```powershell
npm run set-admin kX9mP2nQ3rT4sU5vW6xY7z
```
✅ Success: `Successfully set admin claim for UID: ...`

### 5️⃣ Deploy Security Rules
```powershell
npm run firebase:deploy
```

### 6️⃣ Test Login
```powershell
npm run dev
```
- Navigate to Admin Login
- Enter admin email + password
- Should redirect to Dashboard ✨

---

## 🔧 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run firebase:login` | Login to Firebase CLI |
| `npm run firebase:emulator` | Start local emulator (dev) |
| `npm run firebase:deploy` | Deploy database rules |
| `npm run set-admin <UID>` | Grant admin privileges |

---

## 🔒 Security Notes

1. **Service Account Key**: Keep `serviceAccountKey.json` secure. Never commit to version control.

2. **Admin Claims**: Custom claims are set server-side and persist across sessions. They're verified by Firebase Auth.

3. **Database Rules**: The deployed `database.rules.json` enforces:
   - Authenticated users can read all data
   - Only admins can write to `rooms/{roomId}/meta`, `questions`, and `control`
   - Students can only write their own responses
   - `/admins` path is read-only (managed by admin script)

4. **First Login**: After running `set-admin`, the user must **log out and log back in** (or force token refresh) for the claim to take effect in the client.

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Verify credentials in Firebase Console → Authentication → Users
- Check if Email/Password provider is enabled

### "No admin account found"
- User must exist in Firebase Authentication first
- Run `set-admin` script AFTER creating the user

### "Access denied" in app
- Ensure admin claim was set: `npm run set-admin <UID>`
- User must log out and log back in for claim to refresh
- Check browser console for ID token claims

### Service account errors
- Verify `serviceAccountKey.json` exists in project root
- Check file permissions
- Ensure correct Firebase project

---

## 📚 Additional Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Custom Claims Guide](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Database Security Rules](https://firebase.google.com/docs/database/security)
