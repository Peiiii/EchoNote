import { Message } from "@/core/stores/chat-data-store";
import { Copy, Edit, Flag, Share2, Trash2 } from "lucide-react";
import { ActionMenu, ActionMenuItem, ActionMenuGroup } from "@/common/components/ui/action-menu";

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
        <ActionMenu>
            {/* 主要操作组 */}
            <ActionMenuGroup showSeparator={false}>
                {/* 编辑选项 */}
                {onEdit && (
                    <ActionMenuItem
                        icon={<Edit />}
                        title="Edit thought"
                        description="Modify this thought"
                        onClick={onEdit}
                        variant="default"
                    />
                )}

                {/* 复制选项 */}
                <ActionMenuItem
                    icon={<Copy />}
                    title="Copy content"
                    description="Copy to clipboard"
                    onClick={handleCopy}
                    variant="default"
                />

                {/* 分享选项 */}
                {onShare && (
                    <ActionMenuItem
                        icon={<Share2 />}
                        title="Share thought"
                        description="Share with others"
                        onClick={onShare}
                        variant="default"
                    />
                )}
            </ActionMenuGroup>

            {/* 高级操作组 */}
            <ActionMenuGroup title="Advanced" variant="default">
                {/* 举报选项 */}
                {onReport && (
                    <ActionMenuItem
                        icon={<Flag />}
                        title="Report"
                        description="Report inappropriate content"
                        onClick={onReport}
                        variant="warning"
                    />
                )}
            </ActionMenuGroup>

            {/* 危险操作组 */}
            <ActionMenuGroup title="Danger Zone" variant="danger">
                {/* 删除选项 */}
                <ActionMenuItem
                    icon={<Trash2 />}
                    title="Delete thought"
                    description="Move to trash (reversible)"
                    onClick={onDelete}
                    variant="destructive"
                />
            </ActionMenuGroup>
        </ActionMenu>
    );
}
