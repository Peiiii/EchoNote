/**
 * Migration Logger - Professional logging with consistent prefixes
 */
export class MigrationLogger {
  private static readonly PREFIX = "[Migration]";
  private static readonly PREFIX_STATE = "[MigrationState]";
  private static readonly PREFIX_EXECUTOR = "[MigrationExecutor]";
  private static readonly PREFIX_SERVICE = "[MigrationService]";

  static printHeader(userId: string): void {
    console.log(`${this.PREFIX} 🚀 Starting migrations for user: ${userId}`);
  }

  static printOverview(total: number, completed: number, pending: number): void {
    console.log(
      `${this.PREFIX} 📊 Status: ${total} total, ${completed} completed, ${pending} pending`
    );
  }

  static printAllCompleted(skippedCount: number): void {
    console.log(`${this.PREFIX} ✅ All migrations completed (${skippedCount} skipped)`);
  }

  static printPendingMigrations(migrations: Array<{ version: string; name: string }>): void {
    console.log(`${this.PREFIX} 🚀 Pending migrations (${migrations.length}):`);
    migrations.forEach((migration, index) => {
      console.log(`${this.PREFIX}    ${index + 1}. [${migration.version}] ${migration.name}`);
    });
  }

  static printMigrationStart(progress: string, version: string, name: string): void {
    console.log(`${this.PREFIX} 🔄 ${progress} Executing: ${version} - ${name}`);
  }

  static printMigrationComplete(): void {
    console.log(`${this.PREFIX}    ✅ Completed`);
  }

  static printMigrationFailure(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`${this.PREFIX}    ❌ Failed: ${errorMessage}`);
  }

  static printExecutionSummary(
    successCount: number,
    failureCount: number,
    skippedCount: number
  ): void {
    console.log(
      `${this.PREFIX} 📈 Summary: ${successCount} executed, ${failureCount} failed, ${skippedCount} skipped`
    );
    if (failureCount === 0) {
      console.log(`${this.PREFIX} 🎉 All migrations completed successfully!`);
    }
  }

  static printCriticalError(error: unknown): void {
    console.error(`${this.PREFIX} 💥 Critical error:`, error);
  }

  // State management logs
  static printStateInfo(message: string): void {
    console.log(`${this.PREFIX_STATE} ℹ️  ${message}`);
  }

  static printStateError(message: string, error?: unknown): void {
    console.error(`${this.PREFIX_STATE} ❌ ${message}`, error || "");
  }

  // Executor logs
  static printExecutorInfo(message: string): void {
    console.log(`${this.PREFIX_EXECUTOR} ℹ️  ${message}`);
  }

  static printExecutorError(message: string, error?: unknown): void {
    console.error(`${this.PREFIX_EXECUTOR} ❌ ${message}`, error || "");
  }

  // Service logs
  static printServiceInfo(message: string): void {
    console.log(`${this.PREFIX_SERVICE} ℹ️  ${message}`);
  }

  static printServiceError(message: string, error?: unknown): void {
    console.error(`${this.PREFIX_SERVICE} ❌ ${message}`, error || "");
  }
}
