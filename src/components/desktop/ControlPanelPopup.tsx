import React from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Moon, Sun, Wifi, Bluetooth, Volume2, Battery, Plane, MapPin, Focus, Accessibility } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export function ControlPanelPopup() {
  const { isControlPanelOpen, setIsControlPanelOpen, isDarkMode, toggleDarkMode } = useDesktop();
  const { volume, setVolume, brightness, setBrightness } = useSettings();

  if (!isControlPanelOpen) return null;

  const quickActions = [
    { icon: Wifi, label: 'Wi-Fi', active: true },
    { icon: Bluetooth, label: 'Bluetooth', active: true },
    { icon: Plane, label: 'Airplane', active: false },
    { icon: Focus, label: 'Focus', active: false },
    { icon: MapPin, label: 'Location', active: true },
    { icon: Accessibility, label: 'Accessibility', active: false },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[900]" 
        onClick={() => setIsControlPanelOpen(false)}
      />
      
      {/* Control Panel */}
      <div className="fixed bottom-14 right-2 w-80 glass rounded-2xl overflow-hidden z-[950] animate-fade-in window-shadow p-4">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
                action.active 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-[10px]">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg mb-4 transition-colors",
            isDarkMode 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary/50 hover:bg-secondary"
          )}
        >
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className="text-sm font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Slider 
              value={[brightness]} 
              onValueChange={(val) => setBrightness(val[0])}
              max={100} 
              step={1} 
              className="flex-1" 
            />
            <span className="text-xs text-muted-foreground w-8">{brightness}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider 
              value={[volume]} 
              onValueChange={(val) => setVolume(val[0])}
              max={100} 
              step={1} 
              className="flex-1" 
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
          </div>
        </div>

        {/* Battery Status */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-green-500" />
            <span className="text-sm">85%</span>
          </div>
          <span className="text-xs text-muted-foreground">4h 32m remaining</span>
        </div>
      </div>
    </>
  );
}
