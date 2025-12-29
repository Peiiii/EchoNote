# Firebase Services - 数据迁移最佳实践

## 概述

这个目录包含了Firebase相关的服务，特别是智能数据迁移系统，它解决了传统迁移方法中"每次都执行迁移"的问题。

## 目录结构

```
src/common/services/firebase/
├── firebase-chat.service.ts           # 核心聊天服务
├── firebase-migrate.service.ts        # 迁移服务主入口
├── migrations/                        # 迁移目录
│   ├── types.ts                       # 迁移类型定义
│   ├── index.ts                       # 迁移导出索引
│   ├── add-is-deleted-to-messages.migration.ts      # 迁移1.0.0
│   ├── add-last-message-time-to-channels.migration.ts # 迁移1.0.1
│   └── example-new-migration.migration.ts           # 示例迁移
└── README.md                          # 本文档
```

## 核心问题

### 传统迁移的问题

```typescript
// ❌ 传统方式：每次都执行迁移
async function initApp() {
  await migrateData(); // 每次都执行，浪费资源
  // ... 其他初始化逻辑
}
```

### 智能迁移的解决方案

```typescript
// ✅ 智能方式：只执行必要的迁移
async function initApp() {
  await firebaseMigrateService.runAllMigrations(userId); // 智能判断，避免重复
  // ... 其他初始化逻辑
}
```

## 迁移系统架构

### 1. 版本控制

每个迁移都有唯一的版本号，用于跟踪执行状态：

```typescript
interface MigrationVersion {
  version: string; // 唯一版本号，如 "1.0.0"
  name: string; // 迁移名称
  description: string; // 迁移描述
  createdAt: Date; // 创建时间
}
```

### 2. 状态跟踪

在Firestore中维护每个用户的迁移状态：

```
users/{userId}/migrations/state
├── userId: string
├── completedMigrations: string[]    // 已完成的迁移版本
├── lastMigrationCheck: Date         // 最后检查时间
└── version: string                  // 当前版本
```

### 3. 智能执行

系统会：

- 检查已完成的迁移
- 只执行待执行的迁移
- 记录执行结果
- 避免重复执行

## 使用方法

### 基本使用

```typescript
import { firebaseMigrateService } from "@/common/services/firebase/firebase-migrate.service";

// 在应用启动时执行迁移
async function initializeApp(userId: string) {
  try {
    // 智能迁移：只执行必要的迁移
    await firebaseMigrateService.runAllMigrations(userId);
    console.log("迁移完成");
  } catch (error) {
    console.error("迁移失败:", error);
  }
}
```

### 检查迁移状态

```typescript
// 检查是否需要迁移
const status = await firebaseMigrateService.checkMigrationStatus(userId);
console.log("待执行迁移:", status.pendingMigrations);
console.log("需要迁移的消息:", status.messagesNeedMigration);
console.log("需要迁移的频道:", status.channelsNeedMigration);
```

### 强制重新执行（用于测试）

```typescript
// 强制重新执行所有迁移
await firebaseMigrateService.forceRerunAllMigrations(userId);
```

## 🚀 添加新迁移（超简单！）

### 步骤1：创建迁移文件

```bash
# 复制示例文件
cp src/common/services/firebase/migrations/example-new-migration.migration.ts \
   src/common/services/firebase/migrations/add-user-profile.migration.ts
```

### 步骤2：修改迁移类

```typescript
// 在 add-user-profile.migration.ts 中
export class AddUserProfileMigration implements MigrationExecutor {
  version = "1.0.3"; // 递增版本号
  name = "Add user profile fields";
  description = "为用户添加个人资料字段";
  createdAt = new Date("2025-01-29");

  async execute(userId: string): Promise<void> {
    // 实现迁移逻辑
    const userRef = doc(db, `users/${userId}`);
    await updateDoc(userRef, {
      profile: {
        displayName: "User",
        avatar: null,
        bio: "",
      },
    });
  }
}
```

### 步骤3：注册迁移

```typescript
// 在 migrations/index.ts 中添加导出
export { AddUserProfileMigration } from "./add-user-profile.migration";

// 在 firebase-migrate.service.ts 的 MigrationExecutorManager 中注册
private migrations: MigrationExecutor[] = [
  new AddIsDeletedToMessagesMigration(),
  new AddLastMessageTimeToChannelsMigration(),
  new AddUserProfileMigration(),  // 添加这一行
];
```

### 步骤4：完成！

系统会自动：

- 检测新版本
- 执行迁移
- 记录状态
- 避免重复执行

## 迁移版本历史

### 版本 1.0.0 - 消息isDeleted字段

- **目的**: 为所有消息添加`isDeleted`字段
- **影响**: 确保数据模型一致性，支持软删除功能
- **执行条件**: 消息缺少`isDeleted`字段

### 版本 1.0.1 - 频道lastMessageTime字段

- **目的**: 为所有频道添加`lastMessageTime`和`messageCount`字段
- **影响**: 支持按最后消息时间排序，显示消息数量
- **执行条件**: 频道缺少`lastMessageTime`字段

## 最佳实践

### 1. 迁移设计原则

#### 幂等性

```typescript
// ✅ 好的迁移：可以安全地多次执行
async function migrateExample() {
  const data = await getData();
  if (!data.newField) {
    await updateData({ newField: defaultValue });
  }
}

// ❌ 坏的迁移：重复执行会有问题
async function badMigration() {
  const data = await getData();
  await updateData({ count: data.count + 1 }); // 每次执行都会递增
}
```

#### 增量迁移

```typescript
// ✅ 好的迁移：只处理需要的数据
async function migrateMessages() {
  const messages = await getMessages();
  const needsMigration = messages.filter(m => !m.isDeleted);

  for (const message of needsMigration) {
    await updateMessage(message.id, { isDeleted: false });
  }
}
```

### 2. 错误处理

```typescript
// 迁移失败时继续执行其他迁移
for (const migration of pendingMigrations) {
  try {
    await executeMigration(migration);
    await markMigrationCompleted(migration.version);
  } catch (error) {
    console.error(`迁移 ${migration.version} 失败:`, error);
    // 继续执行其他迁移，不中断整个流程
  }
}
```

### 3. 性能优化

```typescript
// 批量操作而不是逐个更新
async function batchMigration() {
  const batch = db.batch();
  const items = await getItems();

  for (const item of items) {
    if (needsMigration(item)) {
      const ref = doc(db, "collection", item.id);
      batch.update(ref, { newField: defaultValue });
    }
  }

  await batch.commit(); // 一次性提交所有更改
}
```

## 架构优势

### 🎯 职责分离

- **MigrationStateManager**: 负责版本控制和状态跟踪
- **MigrationExecutorManager**: 负责管理和执行迁移
- **MigrationExecutor**: 每个迁移都是独立的类
- **FirebaseMigrateService**: 主服务，协调各个组件

### 🔧 易于扩展

- 添加新迁移只需创建新文件
- 无需修改核心逻辑
- 支持动态添加迁移
- 版本管理自动化

### 🚀 性能优化

- 智能判断，避免重复执行
- 增量迁移，只处理需要的数据
- 状态缓存，减少数据库查询
- 错误隔离，单个失败不影响整体

### 📁 模块化结构

- 每个迁移都是独立的文件
- 清晰的目录组织
- 易于维护和扩展
- 支持团队协作开发

## 监控和调试

### 日志输出

系统会输出详细的日志，包括：

- 迁移开始和完成
- 处理的文档数量
- 错误信息
- 迁移状态变化

### 常见问题排查

#### 迁移没有执行

1. 检查`users/{userId}/migrations/state`文档是否存在
2. 确认迁移版本号是否正确
3. 查看控制台日志

#### 迁移执行失败

1. 检查Firestore权限
2. 确认数据格式是否正确
3. 查看错误日志

## 总结

这个智能迁移系统解决了传统迁移方法的核心问题：

1. **避免重复执行**: 通过版本控制和状态跟踪
2. **提高性能**: 只执行必要的迁移
3. **增强可靠性**: 错误处理和状态管理
4. **易于维护**: 清晰的版本历史和迁移逻辑
5. **职责分离**: 版本控制、状态管理、迁移执行各司其职
6. **易于扩展**: 添加新迁移只需几行代码
7. **模块化**: 清晰的目录结构，每个迁移独立管理

通过遵循这些最佳实践，你可以构建一个健壮、高效的数据迁移系统。
