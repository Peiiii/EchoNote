# Debug: CollectionGroup Query Permission Issues

If you're still getting "Missing or insufficient permissions" after updating rules, follow these debugging steps.

## Step 1: Verify Rules Are Deployed

1. Go to Firebase Console → Firestore Database → Rules
2. Check that your rules match exactly what's in `firestore-security-v2.0.0.rules`
3. Make sure you clicked **Publish** after updating
4. Wait a few seconds for rules to propagate

## Step 2: Test Rules in Rules Playground

1. In Firebase Console, go to Firestore Database → Rules
2. Click **Rules Playground** tab
3. Test the following scenario:

**Test 1: Read Channel with shareToken (Anonymous)**
- Location: `users/{userId}/channels/{channelId}`
- Method: `get`
- Authentication: `unauthenticated`
- Resource data:
```json
{
  "shareToken": "some-token-value",
  "name": "Test Channel",
  "isDeleted": false
}
```
- Expected: ✅ **Allow**

**Test 2: Read Channel without shareToken (Anonymous)**
- Location: `users/{userId}/channels/{channelId}`
- Method: `get`
- Authentication: `unauthenticated`
- Resource data:
```json
{
  "name": "Test Channel",
  "isDeleted": false
}
```
- Expected: ❌ **Deny**

## Step 3: Check Collection Group Index

The `collectionGroup` query requires a composite index. Verify it exists:

1. Go to Firebase Console → Firestore Database → Indexes
2. Look for an index with:
   - Collection ID: `channels` (Collection group: Yes)
   - Fields: `shareToken` (Ascending), `isDeleted` (Ascending)
3. If missing, create it or use the link from the error message

## Step 4: Verify Channel Data

Check that your channel document actually has the `shareToken` field:

1. Go to Firebase Console → Firestore Database → Data
2. Navigate to `users/{userId}/channels/{channelId}`
3. Verify:
   - `shareToken` field exists
   - `shareToken` is a string (not null, not empty)
   - `isDeleted` is `false` or doesn't exist

## Step 5: Check Browser Console

Look for detailed error messages in the browser console. The error should tell you:
- Which rule failed
- What condition was not met
- The exact path that was accessed

## Step 6: Test with Simple Rule (Temporary)

If still not working, try this simplified rule temporarily to isolate the issue:

```javascript
match /users/{userId}/channels/{channelId} {
  // Temporary: Allow all reads for debugging
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

If this works, the issue is with the condition. If it doesn't, the issue is with rule deployment or collection group setup.

## Common Issues

### Issue 1: Rules Not Deployed
- **Symptom**: Rules look correct but still get permission errors
- **Solution**: Make sure you clicked "Publish" and wait for confirmation

### Issue 2: Index Missing
- **Symptom**: Error mentions index is required
- **Solution**: Create the collection group index (see Step 3)

### Issue 3: Field Doesn't Exist
- **Symptom**: Rules work in playground but not in real query
- **Solution**: Verify `shareToken` field exists in your channel documents

### Issue 4: Cached Rules
- **Symptom**: Rules updated but old behavior persists
- **Solution**: Clear browser cache, wait a few minutes, or try incognito mode

## Still Not Working?

If none of the above works, please provide:
1. The exact error message from browser console
2. A screenshot of your current Firestore rules
3. The result of Rules Playground test (Step 2)
4. Whether the index exists (Step 3)

