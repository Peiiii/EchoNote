import { Bookmark, Edit2, Eye, Lightbulb, MessageCircle } from "lucide-react";
import { ActionButton } from "./action-button";
import { MoreActionsMenu } from "../../more-actions-menu";
import { ActionButtonsProps } from "../types";

export function ActionButtons({ onToggleAnalysis, onReply, onEdit, message, onDelete, isEditing }: ActionButtonsProps) {
    const actionButtons = [
        { icon: Edit2, onClick: onEdit, title: "Edit thought", disabled: isEditing },
        { icon: Lightbulb, onClick: onToggleAnalysis, title: "Toggle sparks", disabled: isEditing },
        { icon: Eye, onClick: undefined, title: "View details", disabled: isEditing },
        { icon: Bookmark, onClick: undefined, title: "Bookmark", disabled: isEditing },
        { icon: MessageCircle, onClick: onReply, title: "Reply to thought", disabled: isEditing },
    ];

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {actionButtons.map(({ icon, onClick, title, disabled }) => (
                <ActionButton
                    key={title}
                    icon={icon}
                    onClick={onClick}
                    title={title}
                    disabled={disabled}
                />
            ))}
            <MoreActionsMenu
                message={message}
                onDelete={onDelete}
                onCopy={() => navigator.clipboard.writeText(message.content)}
            />
        </div>
    );
}
