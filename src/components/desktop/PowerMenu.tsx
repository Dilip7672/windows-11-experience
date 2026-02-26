import React, { useState, useEffect } from 'react';
import { Power, Moon, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PowerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSleep?: () => void;
}

type PowerAction = 'sleep' | 'restart' | 'shutdown' | null;

export function PowerMenu({ isOpen, onClose, onSleep }: PowerMenuProps) {
  const [selectedAction, setSelectedAction] = useState<PowerAction>(null);
  const [countdown, setCountdown] = useState(3);
  const [isPerforming, setIsPerforming] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAction(null);
      setCountdown(3);
      setIsPerforming(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPerforming && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPerforming && countdown === 0) {
      performAction();
    }
  }, [isPerforming, countdown]);

  const performAction = () => {
    switch (selectedAction) {
      case 'sleep':
        // Trigger lock screen
        if (onSleep) {
          onSleep();
        }
        onClose();
        break;
      case 'restart':
        // Simulate restart - reload page
        window.location.reload();
        break;
      case 'shutdown':
        // Simulate shutdown - try to close tab, fallback to reload
        document.body.style.transition = 'filter 1s ease, opacity 1s ease';
        document.body.style.filter = 'brightness(0)';
        document.body.style.opacity = '0';
        setTimeout(() => {
          // Try to close the tab (works if opened by script)
          window.close();
          // Fallback: show a message if we can't close
          setTimeout(() => {
            // If still here, the tab couldn't be closed
            document.body.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: black; color: white; font-family: system-ui;">
                <h1 style="font-size: 24px; margin-bottom: 16px;">System has been shut down</h1>
                <p style="color: #888; margin-bottom: 24px;">Refresh the page to restart</p>
                <button onclick="window.location.reload()" style="padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                  Restart
                </button>
              </div>
            `;
          }, 500);
        }, 1500);
        break;
    }
  };

  const handleAction = (action: PowerAction) => {
    setSelectedAction(action);
    setIsPerforming(true);
  };

  const cancelAction = () => {
    setSelectedAction(null);
    setIsPerforming(false);
    setCountdown(3);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] animate-fade-in" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] animate-window-open w-[85%] max-w-[300px]">
        <div className="glass rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-2">
              <Power className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-xs">Power Options</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {isPerforming ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedAction === 'sleep' && <Moon className="w-6 h-6 text-primary" />}
                  {selectedAction === 'restart' && <RotateCcw className="w-6 h-6 text-primary animate-spin" />}
                  {selectedAction === 'shutdown' && <Power className="w-6 h-6 text-destructive" />}
                </div>
                <h3 className="text-sm font-semibold mb-1">
                  {selectedAction === 'sleep' && 'Locking screen...'}
                  {selectedAction === 'restart' && 'Restarting...'}
                  {selectedAction === 'shutdown' && 'Shutting down...'}
                </h3>
                <p className="text-muted-foreground text-xs mb-3">
                  {countdown > 0 ? `Starting in ${countdown}s` : 'Please wait...'}
                </p>
                <button
                  onClick={cancelAction}
                  className="px-3 py-1.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction('sleep')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Moon className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-medium">Sleep</span>
                </button>

                <button
                  onClick={() => handleAction('restart')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-xs font-medium">Restart</span>
                </button>

                <button
                  onClick={() => handleAction('shutdown')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Power className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-xs font-medium">Shut down</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
