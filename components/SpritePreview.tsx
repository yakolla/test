
import React, { useState, useEffect } from 'react';

interface SpritePreviewProps {
  imageUrl: string;
}

type AnimationKey = 'idle' | 'walk' | 'attack' | 'hit' | 'death' | 'jump';

interface AnimationConfig {
  label: string;
  row: number;
  frames: number;
}

const ANIMATIONS: Record<AnimationKey, AnimationConfig> = {
  idle: { label: '기본 (Idle)', row: 0, frames: 6 },
  walk: { label: '걷기 (Walk)', row: 1, frames: 6 },
  attack: { label: '공격 (Attack)', row: 2, frames: 6 },
  hit: { label: '피격 (Hit)', row: 3, frames: 6 },
  death: { label: '죽기 (Death)', row: 4, frames: 6 },
  jump: { label: '점프 (Jump)', row: 5, frames: 6 },
};

export const SpritePreview: React.FC<SpritePreviewProps> = ({ imageUrl }) => {
  const [activeAnim, setActiveAnim] = useState<AnimationKey>('idle');
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const config = ANIMATIONS[activeAnim];

  useEffect(() => {
    setFrame(0);
  }, [activeAnim]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % config.frames);
    }, 130); // Slightly faster for smoother pixel animation
    return () => clearInterval(interval);
  }, [isPlaying, config.frames]);

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Full Sprite Sheet */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">32x32 Sprite Sheet</h3>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">Centered & Anchored</span>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/50 group relative overflow-hidden flex items-center justify-center min-h-[300px]">
            <img 
              src={imageUrl} 
              alt="Generated Sprite Sheet" 
              className="max-w-full h-auto image-pixelated rounded-lg shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <a 
                href={imageUrl} 
                download="sprite-sheet.png"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all transform hover:scale-105 shadow-xl"
               >
                 Download Assets
               </a>
            </div>
          </div>
        </div>

        {/* Animation Preview */}
        <div className="w-full md:w-72 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider text-center">In-Game Preview</h3>
          
          <div className="w-full aspect-square bg-slate-950 rounded-2xl border-4 border-slate-700 flex items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-[length:16px_16px] relative mb-6 shadow-inner">
            <div className="w-48 h-48 relative overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt="Animation Preview"
                    className="absolute max-w-none"
                    style={{ 
                        imageRendering: 'pixelated',
                        // Since it's a 6 column x 6 row grid
                        // We shift by 1/6th of the image width per frame
                        // and 1/6th of the image height per row
                        left: `-${frame * (100 / 6)}%`,
                        top: `-${config.row * (100 / 6)}%`,
                        width: `600%`, 
                        height: `600%`,
                    }}
                />
            </div>
            
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-4 right-4 p-2.5 bg-slate-800/90 backdrop-blur rounded-xl hover:bg-slate-700 transition-all text-white shadow-lg border border-slate-600"
            >
                {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">State Switcher</label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(ANIMATIONS) as AnimationKey[]).map((key) => {
                const anim = ANIMATIONS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveAnim(key)}
                    className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      activeAnim === key 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                        {anim.label}
                        {activeAnim === key && (
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
