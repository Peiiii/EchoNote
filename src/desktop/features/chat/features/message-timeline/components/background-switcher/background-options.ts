export interface BackgroundOption {
  id: string;
  name: string;
  type: 'color' | 'image' | 'gradient';
  value: string;
  preview: string;
}

export const gradientOptions: BackgroundOption[] = [
  {
    id: 'gradient-1',
    name: 'Ocean Breeze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'gradient-2',
    name: 'Sunset Glow',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'gradient-3',
    name: 'Forest Mist',
    type: 'gradient',
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'gradient-4',
    name: 'Warm Sand',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'gradient-5',
    name: 'Purple Haze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'gradient-6',
    name: 'Midnight Sky',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    preview: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
  }
];

export const colorOptions: BackgroundOption[] = [
  {
    id: 'color-1',
    name: 'Soft Blue',
    type: 'color',
    value: '#e3f2fd',
    preview: '#e3f2fd'
  },
  {
    id: 'color-2',
    name: 'Warm Gray',
    type: 'color',
    value: '#f5f5f5',
    preview: '#f5f5f5'
  },
  {
    id: 'color-3',
    name: 'Mint Green',
    type: 'color',
    value: '#e8f5e8',
    preview: '#e8f5e8'
  },
  {
    id: 'color-4',
    name: 'Lavender',
    type: 'color',
    value: '#f3e5f5',
    preview: '#f3e5f5'
  },
  {
    id: 'color-5',
    name: 'Peach',
    type: 'color',
    value: '#fff3e0',
    preview: '#fff3e0'
  },
  {
    id: 'color-6',
    name: 'Rose',
    type: 'color',
    value: '#fce4ec',
    preview: '#fce4ec'
  }
];

export const imageOptions: BackgroundOption[] = [
  {
    id: 'image-1',
    name: 'Abstract 1',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=1',
    preview: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'image-2',
    name: 'Abstract 2',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=2',
    preview: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 'image-3',
    name: 'Abstract 3',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=3',
    preview: 'https://picsum.photos/100/100?random=3'
  },
  {
    id: 'image-4',
    name: 'Abstract 4',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=4',
    preview: 'https://picsum.photos/100/100?random=4'
  },
  {
    id: 'image-5',
    name: 'Abstract 5',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=5',
    preview: 'https://picsum.photos/100/100?random=5'
  },
  {
    id: 'image-6',
    name: 'Abstract 6',
    type: 'image',
    value: 'https://picsum.photos/800/400?random=6',
    preview: 'https://picsum.photos/100/100?random=6'
  }
];

export const allBackgroundOptions = [
  ...gradientOptions,
  ...colorOptions,
  ...imageOptions
];
