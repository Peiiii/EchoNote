export interface BackgroundOption {
  id: string;
  name: string;
  type: "color" | "image" | "gradient";
  value: string;
  preview: string;
}

export const gradientOptions: BackgroundOption[] = [
  {
    id: "gradient-1",
    name: "Ocean Breeze",
    type: "gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "gradient-2",
    name: "Sunset Glow",
    type: "gradient",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    preview: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "gradient-3",
    name: "Forest Mist",
    type: "gradient",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    preview: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "gradient-4",
    name: "Warm Sand",
    type: "gradient",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    preview: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "gradient-5",
    name: "Purple Haze",
    type: "gradient",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    preview: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: "gradient-6",
    name: "Midnight Sky",
    type: "gradient",
    value: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    preview: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
  },
];

export const colorOptions: BackgroundOption[] = [
  {
    id: "color-1",
    name: "Soft Blue",
    type: "color",
    value: "#e3f2fd",
    preview: "#e3f2fd",
  },
  {
    id: "color-2",
    name: "Warm Gray",
    type: "color",
    value: "#f5f5f5",
    preview: "#f5f5f5",
  },
  {
    id: "color-3",
    name: "Mint Green",
    type: "color",
    value: "#e8f5e8",
    preview: "#e8f5e8",
  },
  {
    id: "color-4",
    name: "Lavender",
    type: "color",
    value: "#f3e5f5",
    preview: "#f3e5f5",
  },
  {
    id: "color-5",
    name: "Peach",
    type: "color",
    value: "#fff3e0",
    preview: "#fff3e0",
  },
  {
    id: "color-6",
    name: "Rose",
    type: "color",
    value: "#fce4ec",
    preview: "#fce4ec",
  },
];

export const generateRandomImages = (count: number = 6): BackgroundOption[] => {
  const images: BackgroundOption[] = [];
  const usedIds = new Set<number>();

  while (images.length < count) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    if (usedIds.has(randomId)) continue;

    usedIds.add(randomId);
    images.push({
      id: `random-${randomId}`,
      name: `Image ${images.length + 1}`,
      type: "image",
      value: `https://picsum.photos/id/${randomId}/800/400`,
      preview: `https://picsum.photos/id/${randomId}/100/100`,
    });
  }

  return images;
};

export const allBackgroundOptions = [...gradientOptions, ...colorOptions];
