import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/common/config/firebase.config";
import { MigrationExecutor, UserMigrationState } from "./migrations/types";
import {
  AddIsDeletedToMessagesMigration,
  AddLastMessageTimeToChannelsMigration,
  AddIsDeletedToChannelsMigration,
} from "./migrations";
import { MigrationLogger } from "./migrations/migration-logger";

class MigrationStateManager {
  private getMigrationsCollectionRef = (userId: string) =>
    collection(db, `users/${userId}/migrations`);

  async getUserMigrationState(userId: string): Promise<UserMigrationState> {
    try {
      const migrationDocRef = doc(this.getMigrationsCollectionRef(userId), "state");
      const migrationDoc = await getDoc(migrationDocRef);
      
      if (migrationDoc.exists()) {
        const data = migrationDoc.data();
        return {
          userId,
          completedMigrations: data.completedMigrations || [],
          lastMigrationCheck: data.lastMigrationCheck?.toDate() || new Date(),
          version: data.version || "1.0.0",
        };
      }
      
      return {
        userId,
        completedMigrations: [],
        lastMigrationCheck: new Date(),
        version: "1.0.0",
      };
    } catch (error) {
      MigrationLogger.printStateError("Failed to get migration state", error);
      return {
        userId,
        completedMigrations: [],
        lastMigrationCheck: new Date(),
        version: "1.0.0",
      };
    }
  }

  async updateUserMigrationState(
    userId: string, 
    completedMigrations: string[], 
    version: string
  ): Promise<void> {
    try {
      const migrationDocRef = doc(this.getMigrationsCollectionRef(userId), "state");
      await setDoc(migrationDocRef, {
        userId,
        completedMigrations,
        lastMigrationCheck: serverTimestamp(),
        version,
      });
      MigrationLogger.printStateInfo(`Updated migration state for user ${userId}`);
    } catch (error) {
      MigrationLogger.printStateError("Failed to update migration state", error);
      throw error;
    }
  }

  async markMigrationCompleted(userId: string, migrationVersion: string): Promise<void> {
    try {
      const currentState = await this.getUserMigrationState(userId);
      const updatedMigrations = [...new Set([...currentState.completedMigrations, migrationVersion])];
      await this.updateUserMigrationState(userId, updatedMigrations, currentState.version);
      MigrationLogger.printStateInfo(`Migration ${migrationVersion} marked as completed for user ${userId}`);
    } catch (error) {
      MigrationLogger.printStateError("Failed to mark migration as completed", error);
      throw error;
    }
  }

  async resetMigrationState(userId: string): Promise<void> {
    try {
      await this.updateUserMigrationState(userId, [], "1.0.0");
      MigrationLogger.printStateInfo(`Migration state reset for user ${userId}`);
    } catch (error) {
      MigrationLogger.printStateError("Failed to reset migration state", error);
      throw error;
    }
  }
}

class MigrationExecutorManager {
  private migrations: MigrationExecutor[] = [
    new AddIsDeletedToMessagesMigration(),
    new AddLastMessageTimeToChannelsMigration(),
    new AddIsDeletedToChannelsMigration(),
  ];

  getAllMigrations(): MigrationExecutor[] {
    return this.migrations;
  }

  getPendingMigrations(completedMigrations: string[]): MigrationExecutor[] {
    return this.migrations.filter(
      migration => !completedMigrations.includes(migration.version)
    );
  }

  async executeMigration(migration: MigrationExecutor, userId: string): Promise<void> {
    try {
      MigrationLogger.printExecutorInfo(`Starting migration ${migration.version}: ${migration.name}`);
      await migration.execute(userId);
      MigrationLogger.printExecutorInfo(`Migration ${migration.version} completed successfully`);
    } catch (error) {
      MigrationLogger.printExecutorError(`Migration ${migration.version} failed`, error);
      throw error;
    }
  }

  addMigration(migration: MigrationExecutor): void {
    this.migrations.push(migration);
    MigrationLogger.printExecutorInfo(`Added new migration: ${migration.version} - ${migration.name}`);
  }
}

class FirebaseMigrateService {
  private stateManager = new MigrationStateManager();
  private executorManager = new MigrationExecutorManager();

  async runAllMigrations(userId: string): Promise<void> {
    try {
      MigrationLogger.printHeader(userId);
      
      const currentState = await this.stateManager.getUserMigrationState(userId);
      const allMigrations = this.executorManager.getAllMigrations();
      const pendingMigrations = this.executorManager.getPendingMigrations(currentState.completedMigrations);
      const skippedMigrations = allMigrations.filter(m => 
        currentState.completedMigrations.includes(m.version)
      );
      
      MigrationLogger.printOverview(allMigrations.length, skippedMigrations.length, pendingMigrations.length);
      
      if (pendingMigrations.length === 0) {
        MigrationLogger.printAllCompleted(skippedMigrations.length);
        return;
      }
      
      MigrationLogger.printPendingMigrations(pendingMigrations);
      
      let successCount = 0;
      let failureCount = 0;
      
      for (let i = 0; i < pendingMigrations.length; i++) {
        const migration = pendingMigrations[i];
        const progress = `[${i + 1}/${pendingMigrations.length}]`;
        
        try {
          MigrationLogger.printMigrationStart(progress, migration.version, migration.name);
          await this.executorManager.executeMigration(migration, userId);
          await this.stateManager.markMigrationCompleted(userId, migration.version);
          MigrationLogger.printMigrationComplete();
          successCount++;
        } catch (error) {
          MigrationLogger.printMigrationFailure(error);
          failureCount++;
        }
      }
      
      MigrationLogger.printExecutionSummary(successCount, failureCount, skippedMigrations.length);
      
    } catch (error) {
      MigrationLogger.printCriticalError(error);
      throw error;
    }
  }

  async checkMigrationStatus(userId: string): Promise<{
    messagesNeedMigration: number;
    channelsNeedMigration: number;
    pendingMigrations: string[];
    lastMigrationCheck: Date;
    totalMigrations: number;
    completedMigrations: number;
    skippedMigrations: number;
  }> {
    try {
      const currentState = await this.stateManager.getUserMigrationState(userId);
      const allMigrations = this.executorManager.getAllMigrations();
      const pendingMigrations = this.executorManager.getPendingMigrations(currentState.completedMigrations);
      const skippedMigrations = allMigrations.filter(m => 
        currentState.completedMigrations.includes(m.version)
      );
      
      const messagesSnapshot = await getDocs(collection(db, `users/${userId}/messages`));
      const messagesNeedMigration = messagesSnapshot.docs.filter(
        doc => doc.data().isDeleted === undefined
      ).length;

      const channelsSnapshot = await getDocs(collection(db, `users/${userId}/channels`));
      const channelsNeedMigration = channelsSnapshot.docs.filter(
        doc => !doc.data().lastMessageTime
      ).length;

      MigrationLogger.printServiceInfo(`Status check: ${pendingMigrations.length} pending, ${messagesNeedMigration} messages, ${channelsNeedMigration} channels need migration`);

      return {
        messagesNeedMigration,
        channelsNeedMigration,
        pendingMigrations: pendingMigrations.map(m => m.version),
        lastMigrationCheck: currentState.lastMigrationCheck,
        totalMigrations: allMigrations.length,
        completedMigrations: skippedMigrations.length,
        skippedMigrations: skippedMigrations.length,
      };
    } catch (error) {
      MigrationLogger.printServiceError("Failed to check migration status", error);
      throw error;
    }
  }

  async forceRerunAllMigrations(userId: string): Promise<void> {
    try {
      MigrationLogger.printServiceInfo(`Force rerunning all migrations for user: ${userId}`);
      await this.stateManager.resetMigrationState(userId);
      await this.runAllMigrations(userId);
      MigrationLogger.printServiceInfo("Force rerun completed successfully");
    } catch (error) {
      MigrationLogger.printServiceError("Force rerun failed", error);
      throw error;
    }
  }

  addMigration(migration: MigrationExecutor): void {
    this.executorManager.addMigration(migration);
  }
}

export const firebaseMigrateService = new FirebaseMigrateService();