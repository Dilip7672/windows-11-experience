import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, CloudLightning, CloudFog, Loader2 } from 'lucide-react';
import { LocationPermissionDialog } from './LocationPermissionDialog';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
  humidity: number;
  wind: number;
  location: string;
  high: number;
  low: number;
}

const weatherConditions = [
  { condition: 'sunny' as const, icon: Sun, label: 'Sunny' },
  { condition: 'cloudy' as const, icon: Cloud, label: 'Cloudy' },
  { condition: 'rainy' as const, icon: CloudRain, label: 'Rainy' },
  { condition: 'snowy' as const, icon: CloudSnow, label: 'Snowy' },
  { condition: 'stormy' as const, icon: CloudLightning, label: 'Stormy' },
  { condition: 'foggy' as const, icon: CloudFog, label: 'Foggy' },
];

// Map weather codes to conditions
const getConditionFromCode = (code: number): WeatherData['condition'] => {
  if (code === 0 || code === 1) return 'sunny';
  if (code >= 2 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'cloudy';
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    try {
      // Use Open-Meteo API (free, no API key needed)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await response.json();

      // Reverse geocode to get location name
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const geoData = await geoResponse.json();
      const locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Unknown';

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        condition: getConditionFromCode(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        location: locationName,
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
      });
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Fallback data
      setWeather({
        temp: 22,
        condition: 'cloudy',
        humidity: 50,
        wind: 10,
        location: 'Unknown',
        high: 25,
        low: 18,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPermissionStatus('granted');
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setPermissionStatus('denied');
        // Fallback location (Dang, Nepal)
        fetchWeather(28.1, 82.3);
      }
    );
  }, [fetchWeather]);

  const handleAllowLocation = () => {
    setShowPermissionDialog(false);
    requestLocation();
  };

  const handleDenyLocation = () => {
    setShowPermissionDialog(false);
    setPermissionStatus('denied');
    // Use default location
    fetchWeather(28.1, 82.3);
  };

  // Check location permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (result.state === 'granted') {
            setPermissionStatus('granted');
            requestLocation();
          } else if (result.state === 'denied') {
            setPermissionStatus('denied');
            fetchWeather(28.1, 82.3);
          } else {
            // Show custom permission dialog
            setShowPermissionDialog(true);
          }
        } catch {
          setShowPermissionDialog(true);
        }
      } else {
        setShowPermissionDialog(true);
      }
    };

    checkPermission();
  }, [requestLocation, fetchWeather]);

  const getWeatherIcon = () => {
    if (!weather) return Sun;
    const found = weatherConditions.find(w => w.condition === weather.condition);
    return found?.icon || Sun;
  };

  const getWeatherLabel = () => {
    if (!weather) return 'Loading...';
    const found = weatherConditions.find(w => w.condition === weather.condition);
    return found?.label || 'Unknown';
  };

  const WeatherIcon = getWeatherIcon();

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <>
      <LocationPermissionDialog
        isOpen={showPermissionDialog}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />

      <div className="glass rounded-2xl p-4 w-[200px] cursor-default animate-fade-in window-shadow">
        {/* Location & Date */}
        <div className="mb-3">
          <p className="text-sm font-medium">{weather?.location || 'Loading...'}</p>
          <p className="text-xs text-muted-foreground">{formatDay(currentTime)}</p>
        </div>

        {/* Main Weather Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <WeatherIcon className="w-10 h-10 text-primary" />
            )}
            <div>
              <p className="text-3xl font-light">{weather?.temp ?? '--'}°</p>
              <p className="text-xs text-muted-foreground">{getWeatherLabel()}</p>
            </div>
          </div>
        </div>

        {/* High/Low */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span>H: {weather?.high ?? '--'}°</span>
          <span>L: {weather?.low ?? '--'}°</span>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="w-3.5 h-3.5" />
            <span>{weather?.humidity ?? '--'}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wind className="w-3.5 h-3.5" />
            <span>{weather?.wind ?? '--'} km/h</span>
          </div>
        </div>
      </div>
    </>
  );
}