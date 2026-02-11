
export interface SpriteResult {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export enum GenerationStyle {
  CLASSIC_16BIT = '16-bit Classic',
  MODERN_HD = 'Modern HD Pixel',
  GAMEBOY = 'GameBoy Retro',
  FANTASY = 'Epic Fantasy',
  CYBERPUNK = 'Cyberpunk'
}

export interface GenerationSettings {
  style: GenerationStyle;
  frameCount: number;
  includeWalkCycle: boolean;
  backgroundColor: 'transparent' | 'white' | 'black' | 'green';
}
