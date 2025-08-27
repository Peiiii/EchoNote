/**
 * Migration version definition
 * Each migration has a unique version number for tracking execution status
 */
export interface MigrationVersion {
  version: string;
  name: string;
  description: string;
  createdAt: Date;
}

/**
 * User migration state record
 * Stored in users/{userId}/migrations collection
 */
export interface UserMigrationState {
  userId: string;
  completedMigrations: string[];
  lastMigrationCheck: Date;
  version: string;
}

/**
 * Migration executor interface
 * Each specific migration must implement this interface
 */
export interface MigrationExecutor {
  version: string;
  name: string;
  description: string;
  createdAt: Date;
  execute(userId: string): Promise<void>;
}
