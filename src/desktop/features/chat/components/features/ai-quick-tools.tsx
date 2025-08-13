import { BarChart3, Hash, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface AIQuickToolsProps {
  onAnalyze: (type: 'summary' | 'keywords' | 'topics') => void;
  onClear: () => void;
  isLoading: boolean;
}

export const AIQuickTools = ({ onAnalyze, onClear, isLoading }: AIQuickToolsProps) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Analysis</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isLoading}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAnalyze('summary')}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          <FileText className="w-3 h-3 mr-1" />
          Summary
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAnalyze('keywords')}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          <Hash className="w-3 h-3 mr-1" />
          Keywords
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAnalyze('topics')}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Topics
        </Button>
      </div>
    </div>
  );
};
