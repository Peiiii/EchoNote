import { FooterItem } from "./footer-item";
import { ThreadIndicator } from "./thread-indicator";
import { TagSection } from "./tag-section";
import { MessageFooterProps } from "../types";

export function MessageFooter({ 
    message, 
    editingTags, 
    onTagsChange, 
    hasSparks, 
    aiAnalysis, 
    onToggleAnalysis, 
    threadCount
}: Omit<MessageFooterProps, 'onOpenThread'>) {
    return (
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-8">
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <FooterItem>
                    {message.content.length} characters
                </FooterItem>
                
                {hasSparks && (
                    <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <FooterItem onClick={onToggleAnalysis}>
                            {aiAnalysis!.insights.length} sparks
                        </FooterItem>
                    </>
                )}
                
                <TagSection 
                    tags={editingTags}
                    onTagsChange={onTagsChange}
                    maxTags={10}
                />
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <ThreadIndicator
                    threadCount={threadCount}
                    messageId={message.id}
                />
            </div>
        </div>
    );
}
