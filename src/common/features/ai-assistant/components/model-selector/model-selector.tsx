import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/common/components/ui/dropdown-menu';
import { Badge } from '@/common/components/ui/badge';
import { PRESET_MODELS, getModelById, ModelConfig } from '../../config/model-config';
import { ModelSelectorProps } from '../../types/model-config.types';

const getModelBadgeVariant = (modelId: string): "default" | "secondary" | "destructive" | "outline" => {
  if (modelId.includes('qwen')) return 'default';
  if (modelId.includes('gemini')) return 'secondary';
  if (modelId.includes('grok')) return 'outline';
  if (modelId.includes('claude')) return 'secondary';
  if (modelId.includes('glm')) return 'outline';
  return 'default';
};

export function ModelSelector({ 
  selectedModelId, 
  onModelChange, 
  className = '' 
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedModel = selectedModelId ? getModelById(selectedModelId) : PRESET_MODELS[0];
  
  const handleModelSelect = (model: ModelConfig) => {
    onModelChange?.(model.id);
    setIsOpen(false);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 px-3 gap-2 bg-background/50 hover:bg-background/80 border-border/60"
          >
            <span className="text-sm font-medium">{selectedModel?.name || 'Select Model'}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-64 p-1"
          side="top"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
            Choose AI Model
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {PRESET_MODELS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => handleModelSelect(model)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent/50 rounded-md"
            >
              <span className="text-sm font-medium text-foreground">
                {model.name}
              </span>
              
              <div className="flex items-center gap-1">
                {model.isDefault && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Default
                  </Badge>
                )}
                {selectedModelId === model.id && (
                  <Badge variant={getModelBadgeVariant(model.id)} className="text-xs px-1.5 py-0.5">
                    Selected
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
