# Quick Fix: Permission Error for Public Space Access

If you're seeing "Missing or insufficient permissions" error when accessing shared spaces, you need to update your Firestore security rules.

## Problem

The error occurs because:
1. Your Firestore rules may not be updated to v2.0.0
2. The `collectionGroup` query requires proper permissions for anonymous users

## Solution

### Step 1: Update Firestore Rules

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Copy the entire content from [`firestore-security-v2.0.0.rules`](./firestore-security-v2.0.0.rules)
5. Paste it into the rules editor
6. Click **Publish**

### Step 2: Verify Rules

After publishing, the rules should allow:
- Anonymous users to read channels with `shareToken`
- Anonymous users to create messages in `write-only` mode spaces
- Anonymous users to update channel stats (`lastMessageTime`, `messageCount`) in `write-only` mode

### Step 3: Test

1. Try accessing a shared space link again
2. If it's a `write-only` space, you should be able to:
   - View all messages
   - Add new messages
   - See the message input box

## Current Rules Status

Check which version you're using:
- **v1.0.0**: Only supports read-only publishing
- **v2.0.0**: Supports both read-only and write-only (collaborative) publishing

## Still Having Issues?

1. **Check Rules Playground**: Use Firebase Console's Rules Playground to test your rules
2. **Check Index**: Ensure the collection group index is created (see main documentation)
3. **Check Console**: Look for any error messages in Firebase Console

## Important Notes

- Always backup your current rules before updating
- Test in Rules Playground before deploying to production
- The rules file should be exactly as provided - don't modify unless you understand the implications

