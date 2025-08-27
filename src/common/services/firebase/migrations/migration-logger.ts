/**
 * Migration Logger - Simplified logging for migrations
 */
export class MigrationLogger {
  static printHeader(userId: string): void {
    console.log(`🚀 Starting migrations for user: ${userId}`);
  }

  static printOverview(total: number, completed: number, pending: number): void {
    console.log(`📊 Migrations: ${total} total, ${completed} completed, ${pending} pending`);
  }

  static printAllCompleted(skippedCount: number): void {
    console.log(`✅ All migrations completed (${skippedCount} skipped)`);
  }

  static printPendingMigrations(migrations: Array<{ version: string; name: string }>): void {
    console.log(`🚀 Pending migrations (${migrations.length}):`);
    migrations.forEach((migration, index) => {
      console.log(`   ${index + 1}. [${migration.version}] ${migration.name}`);
    });
  }

  static printMigrationStart(progress: string, version: string, name: string): void {
    console.log(`🔄 ${progress} Executing: ${version} - ${name}`);
  }

  static printMigrationComplete(): void {
    console.log(`   ✅ Completed`);
  }

  static printMigrationFailure(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`   ❌ Failed: ${errorMessage}`);
  }

  static printExecutionSummary(successCount: number, failureCount: number, skippedCount: number): void {
    console.log(`\n📈 Summary: ${successCount} executed, ${failureCount} failed, ${skippedCount} skipped`);
    if (failureCount === 0) {
      console.log(`🎉 All migrations completed successfully!`);
    }
  }

  static printCriticalError(error: unknown): void {
    console.error(`💥 Critical error:`, error);
  }
}
