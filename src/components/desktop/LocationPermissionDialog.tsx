import React from 'react';
import { MapPin, X, Shield } from 'lucide-react';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionDialog({ isOpen, onAllow, onDeny }: LocationPermissionDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[2000] animate-fade-in" />
      
      {/* Dialog - Top center on mobile, center on desktop */}
      <div className="fixed left-1/2 -translate-x-1/2 z-[2001] animate-window-open w-[95%] max-w-[400px] px-2 sm:px-0 top-4 sm:top-1/2 sm:-translate-y-1/2">
        <div className="glass rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <span className="font-medium text-xs sm:text-sm">Location Access</span>
            </div>
            <button 
              onClick={onDeny}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">Allow location access?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Weather Widget wants to access your location to show local weather conditions. Your location data stays on your device.
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-secondary/30 rounded-lg p-2.5 sm:p-3 text-[10px] sm:text-xs text-muted-foreground">
              <p>This app will receive:</p>
              <ul className="mt-1.5 sm:mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  Your approximate location
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  Current weather data for your area
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
            <button
              onClick={onDeny}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              Don't Allow
            </button>
            <button
              onClick={onAllow}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
