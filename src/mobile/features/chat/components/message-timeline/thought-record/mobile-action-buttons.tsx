import { Edit2, Lightbulb, Eye, Bookmark, MessageCircle, Trash2, Copy } from 'lucide-react';
import { MobileActionButton } from './mobile-action-button';
import { Button } from '@/common/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/common/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Message } from '@/core/stores/chat-data.store';

interface MobileActionButtonsProps {
    onToggleAnalysis: () => void;
    onReply?: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onCopy: () => void;
    message: Message;
    isEditing: boolean;
    hasSparks: boolean;
}

export function MobileActionButtons({ 
    onToggleAnalysis, 
    onReply, 
    onEdit, 
    onDelete, 
    onCopy,
    isEditing 
}: MobileActionButtonsProps) {
    const primaryActions = [
        { 
            icon: Edit2, 
            onClick: onEdit, 
            title: "Edit", 
            disabled: isEditing,
            variant: 'ghost' as const
        },
        { 
            icon: MessageCircle, 
            onClick: onReply, 
            title: "Reply", 
            disabled: isEditing,
            variant: 'ghost' as const
        },
    ];

    const secondaryActions = [
        { 
            icon: Lightbulb, 
            onClick: onToggleAnalysis, 
            title: "Sparks", 
            disabled: isEditing,
            variant: 'ghost' as const
        },
        { 
            icon: Eye, 
            onClick: () => {}, 
            title: "View", 
            disabled: isEditing,
            variant: 'ghost' as const
        },
        { 
            icon: Bookmark, 
            onClick: () => {}, 
            title: "Bookmark", 
            disabled: isEditing,
            variant: 'ghost' as const
        },
    ];

    return (
        <div className="flex items-center gap-1">
            {/* Primary Actions - Always visible */}
            {primaryActions.map(({ icon, onClick, title, disabled, variant }) => (
                <MobileActionButton
                    key={title}
                    icon={icon}
                    onClick={onClick}
                    title={title}
                    disabled={disabled}
                    variant={variant}
                />
            ))}
            
            {/* Secondary Actions - In dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                    >
                        <MoreHorizontal className="w-3 h-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {secondaryActions.map(({ icon: Icon, onClick, title, disabled }) => (
                        <DropdownMenuItem
                            key={title}
                            onClick={onClick}
                            disabled={disabled}
                            className="flex items-center gap-2"
                        >
                            <Icon className="w-3 h-3" />
                            {title}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                        onClick={onCopy}
                        className="flex items-center gap-2"
                    >
                        <Copy className="w-3 h-3" />
                        Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                        <Trash2 className="w-3 h-3" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
