import { Button } from '@/common/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface MobileActionButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
    variant?: 'default' | 'ghost' | 'destructive';
    size?: 'sm' | 'default';
}

export function MobileActionButton({ 
    icon: Icon, 
    onClick, 
    title, 
    disabled = false,
    variant = 'ghost',
    size = 'sm'
}: MobileActionButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className="h-8 px-2 text-xs transition-all duration-200"
            title={title}
        >
            <Icon className="w-3 h-3 mr-1" />
            {title}
        </Button>
    );
}
