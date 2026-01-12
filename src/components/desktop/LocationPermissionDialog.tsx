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
      <div className="fixed inset-0 bg-black/50 z-[100] animate-fade-in" />
      
      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] animate-window-open">
        <div className="glass rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-sm">Location Access</span>
            </div>
            <button 
              onClick={onDeny}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Allow location access?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Weather Widget wants to access your location to show local weather conditions. Your location data stays on your device.
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground">
              <p>This app will receive:</p>
              <ul className="mt-2 space-y-1">
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
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            <button
              onClick={onDeny}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              Don't Allow
            </button>
            <button
              onClick={onAllow}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </>
  );
}