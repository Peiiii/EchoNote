import { create } from 'zustand';
import { PRESET_MODELS, getDefaultModel, ModelConfig } from '../config/model-config';

interface ModelSelectionState {
  selectedModelId: string;
  selectedModel: ModelConfig;
  setSelectedModel: (modelId: string) => void;
  getSelectedModel: () => ModelConfig;
}

export const useModelSelectionStore = create<ModelSelectionState>((set, get) => {
  const defaultModel = getDefaultModel();
  
  return {
    selectedModelId: defaultModel.id,
    selectedModel: defaultModel,
    
    setSelectedModel: (modelId: string) => {
      const model = PRESET_MODELS.find(m => m.id === modelId);
      if (model) {
        set({
          selectedModelId: modelId,
          selectedModel: model,
        });
      }
    },
    
    getSelectedModel: () => {
      return get().selectedModel;
    },
  };
});
