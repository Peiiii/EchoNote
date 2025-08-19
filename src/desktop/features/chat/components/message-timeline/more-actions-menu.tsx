import { MoreHorizontal, Trash2, Edit, Copy, Share2, Flag } from "lucide-react";
import { Message } from "@/core/stores/chat-data-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";

interface MoreActionsMenuProps {
  message: Message;
  onDelete: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

export function MoreActionsMenu({ 
  message, 
  onDelete, 
  onEdit, 
  onCopy, 
  onShare, 
  onReport 
}: MoreActionsMenuProps) {
  
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* 编辑选项 */}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit thought
          </DropdownMenuItem>
        )}
        
        {/* 复制选项 */}
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy content
        </DropdownMenuItem>
        
        {/* 分享选项 */}
        {onShare && (
          <DropdownMenuItem onClick={onShare} className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            Share thought
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* 举报选项 */}
        {onReport && (
          <DropdownMenuItem onClick={onReport} className="cursor-pointer">
            <Flag className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* 删除选项 - 放在最后，使用危险样式 */}
        <DropdownMenuItem 
          onClick={onDelete} 
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete thought
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
