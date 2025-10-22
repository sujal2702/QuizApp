# Firebase Setup Instructions

## ⚠️ CRITICAL: Firebase Database Rules

Your app is getting **PERMISSION_DENIED** errors because the Firebase Realtime Database rules are too restrictive.

### Error Message:
```
FIREBASE WARNING: set at /rooms/1761110142439 failed: permission_denied
```

---

## 🔧 How to Fix

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **roomtracker-8855b**
3. Click **"Realtime Database"** in the left sidebar
4. Click the **"Rules"** tab at the top

### Step 2: Update Database Rules

Replace the existing rules with this:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    },
    "users": {
      "$userId": {
        ".read": true,
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

### Step 3: Publish Rules
Click the **"Publish"** button at the top

---

## 🔐 Security Considerations

### Current Rules (For Development):
- **Read**: Anyone can read room data
- **Write**: Anyone can write room data
- ✅ Good for testing and development
- ⚠️ Not secure for production

### For Production (More Secure):

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

This requires users to be authenticated (logged in) to create/modify rooms.

---

## 📝 What These Rules Mean

### `/rooms/{roomId}`:
- **".read": true** - Anyone can read room data (so students can join and see updates)
- **".write": true** - Anyone can create/update rooms (for development)

### `/users/{userId}`:
- Users can only read/write their own user data
- **$userId === auth.uid** means only the authenticated user can access their own data

---

## ✅ After Updating Rules

1. Your app will work immediately (no code changes needed)
2. Room creation will succeed
3. Students will be able to join
4. Real-time updates will work
5. Check browser console - the error should be gone

---

## 🧪 Testing Checklist

After updating Firebase rules:

✅ Create a quiz room → Should see "Room saved to Firebase successfully" in console
✅ Room code appears in lobby
✅ Open another browser tab as student
✅ Student can join with room code
✅ Student appears in admin's participant list
✅ No more "PERMISSION_DENIED" errors in console

---

## 🔍 Troubleshooting

### Still getting permission errors?
1. Make sure you clicked "Publish" after changing rules
2. Wait 5-10 seconds for rules to propagate
3. Refresh your app (Ctrl+R or Cmd+R)
4. Clear browser cache if needed

### Need help?
Check the Firebase Console → Realtime Database → Usage tab to see if data is being written.

