import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, ExternalLink, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrowserAppProps {
  url: string;
  title: string;
}

export function BrowserApp({ url, title }: BrowserAppProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary/30 border-b border-border/50">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover-effect">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover-effect">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover-effect" onClick={() => setIsLoading(true)}>
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover-effect">
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 bg-background/50 rounded-full px-3 py-1.5 text-sm">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span className="text-muted-foreground truncate flex-1">{currentUrl}</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover-effect">
            <Star className="w-4 h-4" />
          </button>
          <a 
            href={currentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 rounded hover-effect"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading {title}...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          title={title}
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
        />

        {/* Fallback message for sites that block iframes */}
        <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">If the site doesn't load, click to open externally</span>
          <a 
            href={currentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
