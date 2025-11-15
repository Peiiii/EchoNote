# Changes from v1.0.0 to v2.0.0 (Minimal Changes)

This document shows the minimal changes made to support write-only collaborative mode.

## Original Rules (v1.0.0)

```javascript
match /users/{userId}/channels/{channelId} {
  allow read: if request.auth != null && request.auth.uid == userId
           || resource.data.shareToken != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}	
match /users/{userId}/messages/{messageId} {
  allow read: if request.auth != null && request.auth.uid == userId
           || get(/databases/$(database)/documents/users/$(userId)/channels/$(resource.data.channelId)).data.shareToken != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## Updated Rules (v2.0.0)

### Change 1: Channels - Split write into create/delete/update

**Before:**
```javascript
allow write: if request.auth != null && request.auth.uid == userId;
```

**After:**
```javascript
// Allow owner to create and delete
allow create, delete: if request.auth != null && request.auth.uid == userId;

// Allow owner to update, OR anonymous users to update only message stats in write-only mode
allow update: if request.auth != null && request.auth.uid == userId
           || (resource.data.shareToken != null 
               && resource.data.shareMode == "write-only"
               && request.resource.data.diff(resource.data).affectedKeys()
                   .hasOnly(['lastMessageTime', 'messageCount']));
```

**What changed:**
- Split `allow write` into `create`, `delete`, and `update`
- Added condition for anonymous users to update channel stats in write-only mode

### Change 2: Messages - Split write into create/update/delete

**Before:**
```javascript
allow write: if request.auth != null && request.auth.uid == userId;
```

**After:**
```javascript
// Helper function to get channel for create operations
function getChannelForCreate() {
  return get(/databases/$(database)/documents/users/$(userId)/channels/$(request.resource.data.channelId));
}

// Allow owner to create, OR anonymous users to create in write-only published channels
allow create: if request.auth != null && request.auth.uid == userId
           || (getChannelForCreate().data.shareToken != null 
               && getChannelForCreate().data.shareMode == "write-only"
               && request.resource.data.sender == "user"
               && !request.resource.data.isDeleted);

// Only owner can update or delete
allow update, delete: if request.auth != null && request.auth.uid == userId;
```

**What changed:**
- Split `allow write` into `create`, `update`, and `delete`
- Added helper function `getChannelForCreate()` for create operations
- Added condition for anonymous users to create messages in write-only mode
- Kept update/delete restricted to owner only

## Summary

**Total changes:**
1. Channels: Split `write` → `create`, `delete`, `update` (with new update condition)
2. Messages: Split `write` → `create`, `update`, `delete` (with new create condition)
3. Added one helper function for messages

**What stays the same:**
- All read rules unchanged
- Temporary development rule unchanged
- Owner permissions unchanged
- Read-only published spaces work exactly the same

## Testing Checklist

After applying these rules, test:
- [ ] Read-only published spaces still work
- [ ] Write-only published spaces allow anonymous message creation
- [ ] Owner can still do everything (create, update, delete)
- [ ] Anonymous users cannot modify or delete messages
- [ ] Anonymous users cannot modify channels (except stats in write-only mode)

