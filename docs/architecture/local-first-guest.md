# Local‑First Guest + Optional Account (Long‑Term Architecture)

## Summary
This architecture makes EchoNote usable immediately without login (Guest mode), while enabling a smooth upgrade path to an account for cloud features (sync, publishing, collaboration). The system is **local‑first**: the device is the primary source of truth; cloud services become an optional, value‑add replication layer.

## Goals
- **Zero‑friction start**: users can create/edit notes without signing in.
- **No blocking auth UI**: login appears only when required; it is always dismissible.
- **Offline‑first**: read/write works without network.
- **Upgradeable identity**: Guest can later become an account (Google/email) without losing data.
- **Sync‑ready**: support multi‑device over time with robust consistency semantics.
- **Backend portability**: avoid hard coupling domain logic to Firebase.

## Non‑Goals (for the first implementation iteration)
- Full CRDT/OT real‑time multi‑cursor collaboration UI.
- E2EE by default (can be layered in later).
- Multi‑tenant admin features, billing, or server‑side moderation workflows.

## User Experience Rules
- App always loads into the main UI.
- In Guest mode:
  - Create channels, add/edit/delete messages locally.
  - All changes persist on the device.
- When a feature requires a verified identity or cloud storage:
  - Show a **dismissible login modal** (not a full page).
  - If dismissed, the triggering operation is not performed; the rest of the app continues.

## Capability Matrix
| Feature | Guest (Local) | Signed‑in (Cloud) |
|---|---:|---:|
| Create/edit notes | ✅ | ✅ |
| Offline usage | ✅ | ✅ |
| Realtime updates | (local only) | ✅ |
| Publish space | ❌ (prompts login) | ✅ |
| Cross‑device sync | ❌ (prompts login) | ✅ |

## Architecture Overview
### Layers
1. **Domain/UI**: React views, stores, presenter logic.
2. **Workspace Session**: determines whether current session is Guest or Account.
3. **Storage Provider**: chooses the correct repository implementation (Local vs Cloud).
4. **Repositories (Ports)**: `NotesRepository`, `AuthRepository`.
5. **Adapters (Implementations)**:
   - Local adapter: IndexedDB/localStorage persistence.
   - Cloud adapter: Firebase (Firestore/Auth).

### Session Identity
- **Guest userId**: persisted on device, formatted as `guest:<uuid>`.
- **Account userId**: Firebase `user.uid`.
- A helper `isGuestUserId(userId)` is the single source of truth for determining mode.

## Data Model
### Channel
- `id`, `name`, `description`, `emoji`, `createdAt`, `updatedAt`, `messageCount`, `lastMessageTime`, optional publish fields.

### Message
- `id`, `channelId`, `sender`, `content`, `timestamp`, plus optional metadata (`tags`, `threadId`, soft delete fields, AI analysis, etc.).

## Storage Provider Strategy
### Hybrid Notes Repository
Expose a single `NotesRepository` that routes calls based on `userId`:
- `guest:*` → Local adapter
- otherwise → Firebase adapter

Benefits:
- Minimal changes to callers: they already pass `userId`.
- Easy to keep Guest and Account logic separated.
- Future backends can be added without touching the UI.

### Cloud‑Only Operations
Operations like `publishSpace` must reject Guest `userId`:
- UI should gate and open login modal.
- Repository also enforces server‑side invariants (defense in depth).

## Workspace Initialization
### Guest
- On app start (when Firebase auth resolves to `null`), initialize Guest workspace:
  - Ensure a default channel exists (e.g. “General”).
  - Load channels from local storage.
  - Messages are paginated from local store.

### Account
- On sign‑in, initialize Firebase listeners and (optionally) run migrations.

## Upgrade / Migration Plan (Guest → Account)
Long‑term best practice is a **one‑way migration** with idempotency:
1. User signs in.
2. App offers: “Migrate local notes to your account” (non‑blocking).
3. Migration uploads local channels/messages into the user namespace in cloud.
4. On success, mark local dataset as “migrated” (but keep as a backup until user confirms deletion).

### Conflict Handling (future)
When multi‑device is added, implement one of:
- **Event log + deterministic merge** (simpler).
- **CRDT** (best for concurrent edits, higher complexity).

## UI for Auth Prompts
### Login Modal
- Uses app modal infrastructure (single consistent modal system).
- Contains the existing email/password and Google auth flows.
- Must be dismissible.

### “Require Auth” Gate
Provide a small helper API:
- `requireAccount({ reason, onSuccess })`
  - If signed in: run `onSuccess`.
  - Else: open login modal and return.

## Observability & Quality
- Keep build/lint/typecheck green on every iteration.
- Log auth transitions and workspace initialization outcomes.
- Add lightweight analytics events (optional):
  - `guest_session_started`
  - `login_prompt_shown(reason)`
  - `login_success`
  - `guest_to_account_migration_started/completed/failed`

## Security & Privacy (future)
- At minimum: local data stays on device; cloud data governed by Firebase rules.
- Future: add optional local encryption, then E2EE for cloud replication.

## Implementation Milestones
1. Guest workspace initializes automatically; main UI always accessible.
2. Local notes repository supports core CRUD + pagination.
3. Login modal is dismissible; cloud‑only actions prompt login.
4. Optional: Guest → Account migration wizard.

