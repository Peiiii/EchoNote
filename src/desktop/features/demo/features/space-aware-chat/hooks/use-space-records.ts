import { useMemo } from 'react';
import { SpaceRecord } from '@/desktop/features/demo/features/space-aware-chat/types';

// 模拟数据 - 实际项目中应该从store获取
const mockSpaceRecords: Record<string, SpaceRecord[]> = {
  'work': [
    { id: '1', content: '今天完成了用户管理模块的开发', timestamp: Date.now() - 3600000, type: 'text', tags: ['开发', '完成'] },
    { id: '2', content: '明天需要review代码', timestamp: Date.now() - 1800000, type: 'text', tags: ['代码review'] },
    { id: '3', content: '项目进度：70%', timestamp: Date.now() - 900000, type: 'text', tags: ['进度'] }
  ],
  'study': [
    { id: '4', content: '学习了React 19的新特性', timestamp: Date.now() - 7200000, type: 'text', tags: ['React', '学习'] },
    { id: '5', content: 'TypeScript高级类型练习', timestamp: Date.now() - 5400000, type: 'text', tags: ['TypeScript', '练习'] }
  ],
  'personal': [
    { id: '6', content: '健身计划：每周三次', timestamp: Date.now() - 86400000, type: 'text', tags: ['健身', '计划'] },
    { id: '7', content: '读书：《深入理解计算机系统》', timestamp: Date.now() - 172800000, type: 'text', tags: ['读书', '计算机'] }
  ]
};

export const useSpaceRecords = (spaceId: string) => {
  return useMemo(() => {
    const records = mockSpaceRecords[spaceId] || [];
    
    return {
      records,
      totalCount: records.length,
      summary: records.length > 0 
        ? `该空间共有 ${records.length} 条记录，包含：${records.map(r => r.content.substring(0, 20)).join('、')}...`
        : '该空间暂无记录'
    };
  }, [spaceId]);
};
