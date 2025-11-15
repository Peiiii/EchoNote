# Firestore Security Rules Archive

This directory contains versioned Firestore security rules for the EchoNote application.

## Version History

### v2.0.0 (2025-01-27)
**Current Version** - Enhanced with write-only collaborative mode support

- **Features**:
  - All features from v1.0.0
  - **New**: Write-only mode support (`shareMode: "write-only"`)
  - **New**: Anonymous users can create messages in write-only spaces
  - **New**: Anonymous users can update channel stats (messageCount, lastMessageTime)
  - **New**: Proper separation of create/update/delete permissions
  - Removed temporary development rule

**File**: [`firestore-security-v2.0.0.rules`](./firestore-security-v2.0.0.rules)

### v1.0.0 (Before 2025-01-27)
**Initial Version** - Basic read-only publishing support

- **Features**:
  - Basic channel and message access control
  - Public read access for published channels (via `shareToken`)
  - Owner-only write access
  - Temporary development rule (expires 2025-13-15)

**File**: [`firestore-security-v1.0.0.rules`](./firestore-security-v1.0.0.rules)

## Migration Guide

### From v1.0.0 to v2.0.0

1. **Backup current rules**: Save your current Firestore rules before updating
2. **Update rules**: Copy the content from `firestore-security-v2.0.0.rules` to your Firestore console
3. **Test**: Verify that:
   - Existing read-only published spaces still work
   - New write-only spaces allow anonymous message creation
   - Owner permissions remain intact

### Key Changes in v2.0.0

1. **Channel Update Rule**: Added support for anonymous users to update `lastMessageTime` and `messageCount` in write-only mode
2. **Message Create Rule**: Added support for anonymous users to create messages in write-only published channels
3. **Helper Functions**: Added `getChannel()` and `getChannelForCreate()` functions for better code organization
4. **Removed Development Rule**: Removed the temporary `match /{document=**}` rule

## Usage

To apply these rules to your Firestore database:

1. Open Firebase Console
2. Navigate to Firestore Database → Rules
3. Copy the content from the desired `firestore-security-vX.X.X.rules` file
4. Paste into the rules editor
5. Click "Publish"

## Versioning Convention

- **Major version (X.0.0)**: Breaking changes or major feature additions
- **Minor version (0.X.0)**: New features that are backward compatible
- **Patch version (0.0.X)**: Bug fixes and minor improvements

## Notes

- Always test rules in the Rules Playground before deploying to production
- Keep backups of working rule configurations
- Document any custom modifications you make to these rules
- When creating a new version, update this README with version history
