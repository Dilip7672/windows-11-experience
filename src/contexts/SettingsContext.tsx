import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  transparencyEffects: boolean;
  setTransparencyEffects: (enabled: boolean) => void;
  animationEffects: boolean;
  setAnimationEffects: (enabled: boolean) => void;
  accentOnTitleBars: boolean;
  setAccentOnTitleBars: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const ACCENT_COLORS = {
  'blue': '207 90% 54%',
  'purple': '271 91% 65%',
  'pink': '330 81% 60%',
  'red': '0 84% 60%',
  'orange': '25 95% 53%',
  'yellow': '48 96% 53%',
  'green': '142 76% 36%',
  'teal': '172 66% 50%',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState(() => {
    const saved = localStorage.getItem('accent-color');
    return saved || 'blue';
  });
  
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('system-volume');
    return saved ? parseInt(saved) : 50;
  });
  
  const [brightness, setBrightnessState] = useState(() => {
    const saved = localStorage.getItem('system-brightness');
    return saved ? parseInt(saved) : 100;
  });

  const [transparencyEffects, setTransparencyEffectsState] = useState(() => {
    const saved = localStorage.getItem('transparency-effects');
    return saved !== 'false';
  });

  const [animationEffects, setAnimationEffectsState] = useState(() => {
    const saved = localStorage.getItem('animation-effects');
    return saved !== 'false';
  });

  const [accentOnTitleBars, setAccentOnTitleBarsState] = useState(() => {
    const saved = localStorage.getItem('accent-on-title-bars');
    return saved === 'true';
  });

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    localStorage.setItem('accent-color', color);
    
    // Apply accent color to CSS variables
    const hslValue = ACCENT_COLORS[color as keyof typeof ACCENT_COLORS] || ACCENT_COLORS.blue;
    document.documentElement.style.setProperty('--primary', hslValue);
    document.documentElement.style.setProperty('--accent', hslValue);
    document.documentElement.style.setProperty('--ring', hslValue);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    localStorage.setItem('system-volume', vol.toString());
  }, []);

  const setBrightness = useCallback((val: number) => {
    setBrightnessState(val);
    localStorage.setItem('system-brightness', val.toString());
  }, []);

  const setTransparencyEffects = useCallback((enabled: boolean) => {
    setTransparencyEffectsState(enabled);
    localStorage.setItem('transparency-effects', enabled.toString());
  }, []);

  const setAnimationEffects = useCallback((enabled: boolean) => {
    setAnimationEffectsState(enabled);
    localStorage.setItem('animation-effects', enabled.toString());
  }, []);

  const setAccentOnTitleBars = useCallback((enabled: boolean) => {
    setAccentOnTitleBarsState(enabled);
    localStorage.setItem('accent-on-title-bars', enabled.toString());
  }, []);

  // Apply saved accent color on mount
  useEffect(() => {
    const hslValue = ACCENT_COLORS[accentColor as keyof typeof ACCENT_COLORS] || ACCENT_COLORS.blue;
    document.documentElement.style.setProperty('--primary', hslValue);
    document.documentElement.style.setProperty('--accent', hslValue);
    document.documentElement.style.setProperty('--ring', hslValue);
  }, [accentColor]);

  return (
    <SettingsContext.Provider value={{
      accentColor,
      setAccentColor,
      volume,
      setVolume,
      brightness,
      setBrightness,
      transparencyEffects,
      setTransparencyEffects,
      animationEffects,
      setAnimationEffects,
      accentOnTitleBars,
      setAccentOnTitleBars,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export { ACCENT_COLORS };
