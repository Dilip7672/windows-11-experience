import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  content: ReactNode;
  zIndex: number;
}

interface DesktopContextType {
  windows: WindowState[];
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isFocused'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  isStartMenuOpen: boolean;
  setIsStartMenuOpen: (open: boolean) => void;
  isControlPanelOpen: boolean;
  setIsControlPanelOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeWindowId: string | null;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

let zIndexCounter = 100;

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }, []);

  const openWindow = useCallback((window: Omit<WindowState, 'zIndex' | 'isFocused'>) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.id === window.id);
      if (existingWindow) {
        if (existingWindow.isMinimized) {
          return prev.map(w => 
            w.id === window.id 
              ? { ...w, isMinimized: false, isFocused: true, zIndex: ++zIndexCounter }
              : { ...w, isFocused: false }
          );
        }
        return prev.map(w => 
          w.id === window.id 
            ? { ...w, isFocused: true, zIndex: ++zIndexCounter }
            : { ...w, isFocused: false }
        );
      }
      return [
        ...prev.map(w => ({ ...w, isFocused: false })),
        { ...window, zIndex: ++zIndexCounter, isFocused: true }
      ];
    });
    setActiveWindowId(window.id);
    setIsStartMenuOpen(false);
    setIsControlPanelOpen(false);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(null);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ));
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, isFocused: true, zIndex: ++zIndexCounter, isMinimized: false }
        : { ...w, isFocused: false }
    ));
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
    setIsControlPanelOpen(false);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);

  return (
    <DesktopContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      isStartMenuOpen,
      setIsStartMenuOpen,
      isControlPanelOpen,
      setIsControlPanelOpen,
      isDarkMode,
      toggleDarkMode,
      activeWindowId,
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
}
