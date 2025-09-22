import { ChatInputExtension } from '@agent-labs/agent-chat';
import { getModelById } from '../config/model-config';
import { ModelSelector } from '../components/model-selector/model-selector';
import { aiAgentFactory } from '../services/ai-agent-factory';

export interface ModelSelectorExtensionProps {
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
  className?: string;
}

export const createModelSelectorExtension = (props: ModelSelectorExtensionProps): ChatInputExtension => ({
  id: 'model-selector',
  placement: 'bottom-left',
  render: ({ draft, setDraft }) => {
    const currentModelId = draft.meta?.modelId as string;
    
    const handleModelChange = (modelId: string) => {
      const model = getModelById(modelId);
      if (model) {
        aiAgentFactory.updateAgentConfig(model);
        setDraft({
          ...draft,
          meta: {
            ...draft.meta,
            modelId: modelId,
            modelConfig: {
              apiKey: model.apiKey,
              model: model.model,
              apiUrl: model.apiUrl,
              temperature: model.temperature,
              maxTokens: model.maxTokens,
            }
          }
        });
        props.onModelChange?.(modelId);
      }
    };

    return (
      <ModelSelector
        selectedModelId={currentModelId || props.selectedModelId}
        onModelChange={handleModelChange}
        className={props.className}
      />
    );
  },
  beforeSend: async (draft) => {
    const modelId = draft.meta?.modelId as string;
    if (modelId) {
      const model = getModelById(modelId);
      if (model) {
        return {
          ...draft,
          meta: {
            ...draft.meta,
            modelConfig: {
              apiKey: model.apiKey,
              model: model.model,
              apiUrl: model.apiUrl,
              temperature: model.temperature,
              maxTokens: model.maxTokens,
            }
          }
        };
      }
    }
    return draft;
  }
});
