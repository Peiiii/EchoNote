export interface ModelSelectorProps {
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
  className?: string;
}