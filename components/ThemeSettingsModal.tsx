import React, { useState } from 'react';
import { Palette, X, CheckCircle } from './Icons';
import { useToast } from './Toast';
import { hexToRgb, rgbToHex, mixColors, applyTheme } from '../utils/themeUtils';

export const ThemeSettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [color, setColor] = useState('#10b981'); // Default Emerald
  const [rgb, setRgb] = useState({ r: 16, g: 185, b: 129 });
  const { addToast } = useToast();

  const PREDEFINED_COLORS = [
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Indigo', hex: '#6366f1' },
  ];

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setColor(val);
    const newRgb = hexToRgb(val);
    if (newRgb) setRgb(newRgb);
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
    const num = parseInt(val) || 0;
    const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, num)) };
    setRgb(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleApply = () => {
    applyTheme(color);
    addToast('Theme updated successfully!', 'success');
    onClose();
  };

  if (!isOpen) return null;

  // Generate preview color for active state (approximation of 100 shade)
  const activeBgPreview = rgbToHex(mixColors(hexToRgb(color), {r:255,g:255,b:255}, 85).r, mixColors(hexToRgb(color), {r:255,g:255,b:255}, 85).g, mixColors(hexToRgb(color), {r:255,g:255,b:255}, 85).b);
  const activeTextPreview = rgbToHex(mixColors(hexToRgb(color), {r:0,g:0,b:0}, 50).r, mixColors(hexToRgb(color), {r:0,g:0,b:0}, 50).g, mixColors(hexToRgb(color), {r:0,g:0,b:0}, 50).b);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Palette size={20} className="text-emerald-600 dark:text-emerald-400" /> Theme Settings
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Color Preview & Picker */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-lg shadow-inner overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0">
              <input 
                type="color" 
                value={color}
                onChange={handleHexChange}
                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">HEX Code</label>
                <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700">
                  <span className="pl-3 text-slate-400 text-sm">#</span>
                  <input 
                    type="text" 
                    value={color.replace('#', '')}
                    onChange={(e) => handleHexChange({ target: { value: '#' + e.target.value } } as any)}
                    className="w-full px-2 py-2 text-sm font-mono text-slate-700 dark:text-slate-200 outline-none bg-transparent"
                    maxLength={6}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">RGB</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={rgb.r} 
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-center font-mono dark:bg-slate-700 dark:text-slate-200" 
                    placeholder="R"
                  />
                  <input 
                    type="number" 
                    value={rgb.g} 
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-center font-mono dark:bg-slate-700 dark:text-slate-200" 
                    placeholder="G"
                  />
                  <input 
                    type="number" 
                    value={rgb.b} 
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-center font-mono dark:bg-slate-700 dark:text-slate-200" 
                    placeholder="B"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Predefined Palettes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Predefined Colors</label>
            <div className="flex flex-wrap gap-3">
              {PREDEFINED_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => { setColor(c.hex); setRgb(hexToRgb(c.hex)); }}
                  className={`w-8 h-8 rounded-full shadow-sm border-2 transition-transform hover:scale-110 ${color.toLowerCase() === c.hex.toLowerCase() ? 'border-slate-900 dark:border-white ring-2 ring-offset-2 ring-slate-200 dark:ring-slate-700' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Preview Block */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Theme Preview</p>
             <div className="flex gap-3 items-center flex-wrap">
                <button className="px-4 py-2 rounded-lg text-white text-sm font-bold shadow-sm" style={{ backgroundColor: color }}>
                   Primary Button
                </button>
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold" 
                  style={{ backgroundColor: activeBgPreview, color: activeTextPreview }}
                >
                   <CheckCircle size={16} /> Selected
                </div>
                <button className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: color, color: color }}>
                   Outline
                </button>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">Cancel</button>
          <button onClick={handleApply} className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-colors text-sm shadow-sm">
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};
