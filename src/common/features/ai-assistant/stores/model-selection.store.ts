import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRESET_MODELS, getDefaultModel, ModelConfig } from "../config/model-config";

interface ModelSelectionState {
  selectedModelId: string;
  selectedModel: ModelConfig;
  setSelectedModel: (modelId: string) => void;
  getSelectedModel: () => ModelConfig;
}

export const useModelSelectionStore = create<ModelSelectionState>()(
  persist(
    (set, get) => {
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
    },
    {
      name: "model-selection-storage",
      partialize: state => ({ selectedModelId: state.selectedModelId }),
      onRehydrateStorage: () => state => {
        if (state) {
          const model = PRESET_MODELS.find(m => m.id === state.selectedModelId);
          if (model) {
            state.selectedModel = model;
          } else {
            const defaultModel = getDefaultModel();
            state.selectedModelId = defaultModel.id;
            state.selectedModel = defaultModel;
          }
        }
      },
    }
  )
);
