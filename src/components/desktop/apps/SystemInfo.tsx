import React, { useState, useEffect } from 'react';
import { Monitor, Globe, MapPin, Cpu, HardDrive, Wifi, Clock, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemInfoData {
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  language: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  ip?: string;
  location?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  };
}

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = '';

      if (ua.includes('Firefox/')) {
        browser = 'Firefox';
        version = ua.split('Firefox/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Edg/')) {
        browser = 'Microsoft Edge';
        version = ua.split('Edg/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Chrome/')) {
        browser = 'Chrome';
        version = ua.split('Chrome/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
        browser = 'Safari';
        version = ua.split('Version/')[1]?.split(' ')[0] || '';
      }

      return { browser, version };
    };

    const getOSInfo = () => {
      const ua = navigator.userAgent;
      if (ua.includes('Windows NT 10')) return 'Windows 10/11';
      if (ua.includes('Windows')) return 'Windows';
      if (ua.includes('Mac OS X')) return 'macOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
      return 'Unknown OS';
    };

    const collectSystemInfo = async () => {
      const { browser, version } = getBrowserInfo();
      
      const info: SystemInfoData = {
        browser,
        browserVersion: version,
        os: getOSInfo(),
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width} × ${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
      };

      // Try to get IP and location info
      try {
        const response = await fetch('https://ipapi.co/json/', { 
          signal: AbortSignal.timeout(5000) 
        });
        if (response.ok) {
          const data = await response.json();
          info.ip = data.ip;
          info.location = {
            city: data.city,
            country: data.country_name,
            region: data.region,
            latitude: data.latitude,
            longitude: data.longitude,
          };
        }
      } catch (error) {
        console.log('Could not fetch IP info');
      }

      setSystemInfo(info);
      setLoading(false);
    };

    collectSystemInfo();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Gathering system information...</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value, className }: { icon: any; label: string; value: string | number | boolean | undefined; className?: string }) => (
    <div className={cn("glass rounded-xl p-4 flex items-start gap-3", className)}>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">
          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || 'N/A')}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">System Information</h2>
        <p className="text-sm text-muted-foreground">Device and browser details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoCard icon={Globe} label="Browser" value={`${systemInfo?.browser} ${systemInfo?.browserVersion}`} />
        <InfoCard icon={Monitor} label="Operating System" value={systemInfo?.os} />
        <InfoCard icon={Smartphone} label="Platform" value={systemInfo?.platform} />
        <InfoCard icon={Monitor} label="Screen Resolution" value={systemInfo?.screenResolution} />
        <InfoCard icon={Clock} label="Timezone" value={systemInfo?.timezone} />
        <InfoCard icon={Globe} label="Language" value={systemInfo?.language} />
        <InfoCard icon={Wifi} label="Online Status" value={systemInfo?.onlineStatus ? 'Connected' : 'Offline'} />
        <InfoCard icon={HardDrive} label="Color Depth" value={`${systemInfo?.colorDepth} bit`} />
        
        {systemInfo?.hardwareConcurrency && (
          <InfoCard icon={Cpu} label="CPU Cores" value={systemInfo.hardwareConcurrency} />
        )}
        {systemInfo?.deviceMemory && (
          <InfoCard icon={HardDrive} label="Device Memory" value={`${systemInfo.deviceMemory} GB`} />
        )}
      </div>

      {systemInfo?.ip && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Network Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard icon={Globe} label="IP Address" value={systemInfo.ip} />
            {systemInfo.location?.city && (
              <InfoCard 
                icon={MapPin} 
                label="Location" 
                value={`${systemInfo.location.city}, ${systemInfo.location.region}, ${systemInfo.location.country}`} 
              />
            )}
            {systemInfo.location?.latitude && (
              <InfoCard 
                icon={MapPin} 
                label="Coordinates" 
                value={`${systemInfo.location.latitude?.toFixed(4)}, ${systemInfo.location.longitude?.toFixed(4)}`} 
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-6 glass rounded-xl p-4">
        <p className="text-xs text-muted-foreground">
          Note: Location information is approximate and based on your IP address. 
          Using a VPN may show a different location.
        </p>
      </div>
    </div>
  );
}
