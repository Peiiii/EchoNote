import { BackgroundOption, gradientOptions, colorOptions } from './background-options';

interface ColorSelectorProps {
  currentBackground?: string;
  onBackgroundSelect: (option: BackgroundOption) => void;
}

export const ColorSelector = ({ currentBackground, onBackgroundSelect }: ColorSelectorProps) => {
  const isCurrentBackground = (option: BackgroundOption) => {
    return currentBackground === option.value;
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Gradients</h4>
        <div className="grid grid-cols-3 gap-2">
          {gradientOptions.map((option) => (
            <button
              key={option.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBackgroundSelect(option);
              }}
              className={`relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                isCurrentBackground(option)
                  ? 'border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ background: option.preview }}
              title={option.name}
            >
              {isCurrentBackground(option) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Solid Colors</h4>
        <div className="grid grid-cols-3 gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBackgroundSelect(option);
              }}
              className={`relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                isCurrentBackground(option)
                  ? 'border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ background: option.preview }}
              title={option.name}
            >
              {isCurrentBackground(option) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
