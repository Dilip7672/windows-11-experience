import React from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { 
  Sun, Moon, Palette, Monitor, Bell, Lock, Globe, 
  Wifi, Bluetooth, Battery, User, HardDrive, Info,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const settingsCategories = [
  { id: 'system', name: 'System', icon: Monitor, description: 'Display, notifications, power' },
  { id: 'personalization', name: 'Personalization', icon: Palette, description: 'Background, colors, themes' },
  { id: 'network', name: 'Network & Internet', icon: Wifi, description: 'Wi-Fi, Ethernet, VPN' },
  { id: 'bluetooth', name: 'Bluetooth & Devices', icon: Bluetooth, description: 'Bluetooth, printers, mouse' },
  { id: 'accounts', name: 'Accounts', icon: User, description: 'Your accounts, email, sync' },
  { id: 'privacy', name: 'Privacy & Security', icon: Lock, description: 'Location, camera, microphone' },
  { id: 'language', name: 'Time & Language', icon: Globe, description: 'Language, region, date' },
  { id: 'storage', name: 'Storage', icon: HardDrive, description: 'Storage, backup, recovery' },
  { id: 'about', name: 'About', icon: Info, description: 'Device specifications' },
];

export function ControlPanel() {
  const { isDarkMode, toggleDarkMode } = useDesktop();
  const [activeCategory, setActiveCategory] = React.useState('personalization');

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 p-4 overflow-y-auto hidden md:block">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">User</p>
            <p className="text-xs text-muted-foreground">Local Account</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Find a setting"
          className="w-full px-3 py-2 bg-secondary/50 rounded-lg text-sm mb-4 outline-none focus:ring-2 ring-primary/30"
        />

        <div className="space-y-1">
          {settingsCategories.map(category => (
            <button
              key={category.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeCategory === category.id 
                  ? "bg-primary/10 text-primary" 
                  : "hover-effect"
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="w-5 h-5" />
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeCategory === 'personalization' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Personalization</h2>
              <p className="text-sm text-muted-foreground">Customize your desktop experience</p>
            </div>

            {/* Theme Toggle */}
            <div className="glass rounded-xl p-4">
              <h3 className="font-medium mb-4">Theme</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => isDarkMode && toggleDarkMode()}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                    !isDarkMode ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50"
                  )}
                >
                  <div className="w-16 h-12 rounded-lg bg-white border shadow-sm flex items-center justify-center">
                    <Sun className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => !isDarkMode && toggleDarkMode()}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                    isDarkMode ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50"
                  )}
                >
                  <div className="w-16 h-12 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm">Dark</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="glass rounded-xl p-4">
              <h3 className="font-medium mb-4">Accent Color</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500',
                  'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
                ].map((color, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-10 h-10 rounded-full transition-transform hover:scale-110",
                      color,
                      i === 0 && "ring-2 ring-offset-2 ring-primary"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Settings List */}
            <div className="glass rounded-xl overflow-hidden">
              {[
                { label: 'Transparency effects', description: 'Enable acrylic effects', enabled: true },
                { label: 'Animation effects', description: 'Show animations in Windows', enabled: true },
                { label: 'Show accent color on title bars', description: 'Apply accent color to window borders', enabled: false },
              ].map((setting, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-4",
                    i > 0 && "border-t border-border/50"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCategory !== 'personalization' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {settingsCategories.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {settingsCategories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
            
            <div className="glass rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                {React.createElement(settingsCategories.find(c => c.id === activeCategory)?.icon || Info, { className: 'w-8 h-8' })}
              </div>
              <p className="text-muted-foreground">Settings panel coming soon</p>
            </div>
          </div>
        )}

        {/* Mobile Category List */}
        <div className="md:hidden space-y-2 mb-6">
          {settingsCategories.map(category => (
            <button
              key={category.id}
              className="w-full flex items-center gap-3 p-3 glass rounded-lg"
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="w-5 h-5" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
