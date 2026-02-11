
import React, { useState, useRef } from 'react';
import { Button } from './components/ui/Button';
import { SpritePreview } from './components/SpritePreview';
import { generateSpriteSheet } from './services/geminiService';
import { GenerationStyle, GenerationSettings } from './types';

const App: React.FC = () => {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    style: GenerationStyle.CLASSIC_16BIT,
    frameCount: 24, // Increased default as we now have 5 animations
    includeWalkCycle: true,
    backgroundColor: 'transparent'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!referenceImage) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateSpriteSheet(referenceImage, settings);
      setGeneratedImage(result);
    } catch (err) {
      setError("Failed to generate sprite sheet. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center pixel-border">
              <span className="pixel-font text-white text-xs">PX</span>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">PixelChibi</h1>
              <p className="text-xs text-slate-500 font-medium">AI Sprite Sheet Generator</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <span className="text-indigo-400">32x32 Standard</span>
            <span className="border-l border-slate-700 h-4"></span>
            <a href="#" className="hover:text-white transition-colors">Library</a>
            <a href="#" className="hover:text-white transition-colors">Guide</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar / Controls */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Character Reference
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden relative group"
            >
              {referenceImage ? (
                <>
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-sm font-bold text-white">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-slate-500 text-center px-4">Upload your character design</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </section>

          <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 space-y-6">
            <h2 className="text-lg font-bold mb-2">Generation Settings</h2>
            
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
               <span className="text-xs font-bold text-indigo-400 uppercase">Fixed Output Format</span>
               <p className="text-xs text-slate-400 mt-1">Grid: 32x32px per tile</p>
               <p className="text-[10px] text-slate-500 mt-1">Includes: Idle, Walk, Attack, Hit, Death</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Art Style</label>
              <select 
                value={settings.style}
                onChange={(e) => setSettings({...settings, style: e.target.value as GenerationStyle})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(GenerationStyle).map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!referenceImage} 
              isLoading={isGenerating}
              className="w-full py-4 text-base font-bold shadow-lg shadow-indigo-500/20"
            >
              Generate 32x32 Sprite Sheet
            </Button>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}
          </section>
        </div>

        {/* Workspace / Output */}
        <div className="lg:col-span-8">
          {!generatedImage && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Workspace Empty</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Generate a full set of 32x32 animations: 기본, 걷기, 공격, 피격, 죽기.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center min-h-[500px] bg-slate-800/20 rounded-3xl p-12 text-center animate-pulse">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="pixel-font text-[8px] text-indigo-400">GENERATE</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Building 32x32 Animations...</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Mapping frames for Idle, Walk, Attack, Hit, and Death states.
              </p>
              <div className="mt-8 flex gap-2">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          {generatedImage && !isGenerating && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Generated 32x32 Assets</h2>
                <div className="flex gap-2">
                   <Button variant="outline" className="text-sm">Regenerate</Button>
                   <Button variant="pixel">Slicing Ready</Button>
                </div>
              </div>
              
              <SpritePreview imageUrl={generatedImage} />

              <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-indigo-600 rounded-xl text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold text-indigo-300">Slicing Information</h4>
                    <p className="text-sm text-slate-400 mt-1">
                        Each tile is 32x32 pixels. In your game engine (Unity/Godot), set the sprite import mode to 'Multiple' and slice by cell size 32x32.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-300">Row 1: Idle</span>
                        <span className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-300">Row 2: Walk</span>
                        <span className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-300">Row 3: Attack</span>
                        <span className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-300">Row 4: Hit</span>
                        <span className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-300">Row 5: Death</span>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-[10px] text-black font-bold">G</span>
            </div>
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>
          <p className="text-slate-600 text-sm">© 2024 PixelChibi Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
