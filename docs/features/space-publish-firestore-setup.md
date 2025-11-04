# Firestore Setup for Space Publishing Feature

This document describes the required Firestore security rules and index configuration for the space publishing feature.

## Security Rules

Update your Firestore security rules to allow public read access to published channels and their messages.

### Channels Access Rule

Add or update the rule for channels collection to allow reading channels with `shareToken`:

```javascript
match /users/{userId}/channels/{channelId} {
  // Allow read if:
  // 1. User is the owner, OR
  // 2. Channel has a shareToken (published)
  allow read: if request.auth != null && request.auth.uid == userId
           || resource.data.shareToken != null;
  
  // Only owner can write
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### Messages Access Rule

Add or update the rule for messages collection to allow reading messages from published channels:

```javascript
match /users/{userId}/messages/{messageId} {
  // Allow read if:
  // 1. User is the owner, OR
  // 2. The message's channel is published (has shareToken)
  // Note: This requires checking the parent channel's shareToken
  allow read: if request.auth != null && request.auth.uid == userId
           || get(/databases/$(database)/documents/users/$(userId)/channels/$(resource.data.channelId)).data.shareToken != null;
  
  // Only owner can write
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### Complete Example

Here's a complete example of the security rules section:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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
  }
}
```

## Index Configuration

The space publishing feature uses a **collection group query** to find channels by `shareToken`. Firestore requires a composite index for this query.

### Required Index

When you first execute the `findChannelByShareToken` query, Firestore will automatically detect the need for an index and provide a link to create it. The index should have the following configuration:

**Collection Group**: `channels`
**Fields to Index**:
1. `shareToken` (Ascending)
2. `isDeleted` (Ascending)

### Manual Index Creation

If you prefer to create the index manually:

1. Go to Firebase Console
2. Navigate to Firestore Database → Indexes
3. Click "Create Index"
4. Set:
   - Collection ID: `channels` (with "Collection group" enabled)
   - Fields:
     - `shareToken` - Ascending
     - `isDeleted` - Ascending
5. Click "Create"

### Automatic Index Creation

Firestore will automatically prompt you to create the index when the query is first executed. The error message will include a direct link to create the required index.

## Testing

After configuring the rules and index:

1. **Test Publishing**: Publish a space and verify the `shareToken` is set
2. **Test Public Access**: Access the space via `/space/{shareToken}` without authentication
3. **Test Unpublishing**: Unpublish the space and verify public access is revoked
4. **Test Index**: Verify the collection group query works correctly

## Notes

- The index is required because we're querying across all user collections using `collectionGroup`
- The `isDeleted` field is included in the index to ensure we only query non-deleted channels
- Public access is read-only; only the owner can modify published spaces
- The security rules check the channel's `shareToken` field to determine if public access is allowed

