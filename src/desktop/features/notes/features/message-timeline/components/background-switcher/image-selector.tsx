import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { BackgroundOption, generateRandomImages } from './background-options';
import { Plus, RefreshCw, Loader2 } from 'lucide-react';

interface ImageSelectorProps {
  currentBackground?: string;
  onBackgroundSelect: (option: BackgroundOption) => void;
}

export const ImageSelector = ({ currentBackground, onBackgroundSelect }: ImageSelectorProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [currentImages, setCurrentImages] = useState<BackgroundOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentBackground = (option: BackgroundOption) => {
    return currentBackground === option.value;
  };

  const loadRandomImages = async () => {
    setIsLoading(true);
    try {
      const images = generateRandomImages(6);
      setCurrentImages(images);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshImages = () => {
    loadRandomImages();
  };

  const handleAddCustomImage = () => {
    if (!imageUrl.trim()) return;

    const customImageOption: BackgroundOption = {
      id: `custom-${Date.now()}`,
      name: 'Custom Image',
      type: 'image',
      value: imageUrl.trim(),
      preview: imageUrl.trim()
    };
    onBackgroundSelect(customImageOption);
    setImageUrl('');
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    loadRandomImages();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-muted-foreground">Random Images</h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleRefreshImages}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg border-2 border-border bg-muted animate-pulse"
              />
            ))
          ) : (
            currentImages.map((option) => (
              <button
                key={option.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBackgroundSelect(option);
                }}
                className={`relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden ${
                  isCurrentBackground(option)
                    ? 'border-primary'
                    : 'border-border hover:border-primary/50'
                }`}
                title={option.name}
              >
                <img
                  src={option.preview}
                  alt={option.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {isCurrentBackground(option) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Custom Image URL</h4>
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="Enter image URL (jpg, png, gif, webp, svg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-xs"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddCustomImage}
            disabled={!imageUrl.trim() || !isValidImageUrl(imageUrl)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
          {imageUrl && !isValidImageUrl(imageUrl) && (
            <p className="text-xs text-destructive">
              Please enter a valid image URL
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
