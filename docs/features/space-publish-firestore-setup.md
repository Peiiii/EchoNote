# Firestore Setup for Space Publishing Feature

This document describes the required Firestore security rules and index configuration for the space publishing feature.

## Security Rules

Update your Firestore security rules to allow public read access to published channels and their messages, and allow anonymous users to create messages in append-only published spaces.

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

Add or update the rule for messages collection to allow:
- Reading messages from published channels (read-only or append-only mode)
- Creating messages in append-only published channels (anonymous users)
- Only owners can update or delete messages

```javascript
match /users/{userId}/messages/{messageId} {
  // Helper function to get channel for read/update/delete (uses resource)
  function getChannel() {
    return get(/databases/$(database)/documents/users/$(userId)/channels/$(resource.data.channelId));
  }
  
  // Helper function to get channel for create (uses request.resource)
  function getChannelForCreate() {
    return get(/databases/$(database)/documents/users/$(userId)/channels/$(request.resource.data.channelId));
  }
  
  // Allow read if:
  // 1. User is the owner, OR
  // 2. The message's channel is published (has shareToken)
  allow read: if request.auth != null && request.auth.uid == userId
           || getChannel().data.shareToken != null;
  
  // Allow create if:
  // 1. User is the owner, OR
  // 2. Channel is published in append-only mode and message is being created (not updated)
  allow create: if request.auth != null && request.auth.uid == userId
              || (getChannelForCreate().data.shareToken != null 
                  && getChannelForCreate().data.shareMode == "append-only"
                  && request.resource.data.sender == "user"
                  && !request.resource.data.isDeleted);
  
  // Only owner can update or delete
  allow update, delete: if request.auth != null && request.auth.uid == userId;
}
```

### Channel Update Rule for Message Count

Allow updating channel's `lastMessageTime` and `messageCount` when messages are created in append-only spaces:

```javascript
match /users/{userId}/channels/{channelId} {
  // ... existing read rule ...
  
  // Allow owner to write
  allow write: if request.auth != null && request.auth.uid == userId;
  
  // Allow anonymous users to update only lastMessageTime and messageCount
  // when the channel is in append-only mode
  allow update: if request.auth != null && request.auth.uid == userId
              || (resource.data.shareToken != null 
                  && resource.data.shareMode == "append-only"
                  && request.resource.data.diff(resource.data).affectedKeys()
                      .hasOnly(['lastMessageTime', 'messageCount']));
}
```

### Complete Example

The complete security rules are available in separate files for easy deployment:

- **Current Version (v2.0.0 - with append-only support)**: See [`firestore-rules/firestore-security-v2.0.0.rules`](./firestore-rules/firestore-security-v2.0.0.rules)
- **Previous Version (v1.0.0 - read-only only)**: See [`firestore-rules/firestore-security-v1.0.0.rules`](./firestore-rules/firestore-security-v1.0.0.rules)

For detailed information about rule versions and migration, see [`firestore-rules/README.md`](./firestore-rules/README.md).

Here's the complete security rules section:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/channels/{channelId} {
      // Allow read if owner or published
      allow read: if request.auth != null && request.auth.uid == userId
               || resource.data.shareToken != null;
      
      // Allow owner to write
      allow create, delete: if request.auth != null && request.auth.uid == userId;
      
      // Allow owner to update, or anonymous users to update only message stats in append-only mode
      allow update: if request.auth != null && request.auth.uid == userId
                 || (resource.data.shareToken != null 
                     && resource.data.shareMode == "append-only"
                     && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['lastMessageTime', 'messageCount']));
    }
    
    match /users/{userId}/messages/{messageId} {
      // Helper function to get channel for read/update/delete (uses resource)
      function getChannel() {
        return get(/databases/$(database)/documents/users/$(userId)/channels/$(resource.data.channelId));
      }
      
      // Helper function to get channel for create (uses request.resource)
      function getChannelForCreate() {
        return get(/databases/$(database)/documents/users/$(userId)/channels/$(request.resource.data.channelId));
      }
      
      // Allow read if owner or channel is published
      allow read: if request.auth != null && request.auth.uid == userId
               || getChannel().data.shareToken != null;
      
      // Allow create if owner or channel is append-only published
      allow create: if request.auth != null && request.auth.uid == userId
                 || (getChannelForCreate().data.shareToken != null 
                     && getChannelForCreate().data.shareMode == "append-only"
                     && request.resource.data.sender == "user"
                     && !request.resource.data.isDeleted);
      
      // Only owner can update or delete
      allow update, delete: if request.auth != null && request.auth.uid == userId;
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

## Publish Modes

The space publishing feature supports two modes:

### Read-Only Mode (`shareMode: "read-only"`)
- Anyone with the share link can **view** messages
- No one except the owner can add, modify, or delete messages
- Perfect for sharing content publicly

### Append-Only Mode (`shareMode: "append-only"`)
- Anyone with the share link can **view** and **add** messages
- Anonymous users can create new messages but **cannot modify or delete** them
- Only the owner can modify or delete messages
- Perfect for collaborative discussions and group chats

## Notes

- The index is required because we're querying across all user collections using `collectionGroup`
- The `isDeleted` field is included in the index to ensure we only query non-deleted channels
- In read-only mode, public access is view-only; only the owner can modify published spaces
- In append-only mode, anonymous users can create messages but cannot modify or delete them
- The security rules check the channel's `shareToken` and `shareMode` fields to determine access permissions
- Anonymous users can only update channel's `lastMessageTime` and `messageCount` when creating messages in append-only spaces

