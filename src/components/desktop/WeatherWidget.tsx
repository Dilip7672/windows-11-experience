import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
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
];

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: NA,
    condition: 'NA',
    humidity: NA,
    wind: NA,
    location: 'Dang',
    high: NA,
    low: NA,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate weather changes
  useEffect(() => {
    const updateWeather = () => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const baseTemp = randomCondition === 'snowy' ? 0 : randomCondition === 'rainy' ? 15 : 22;
      
      setWeather({
        temp: baseTemp + Math.floor(Math.random() * 10),
        condition: randomCondition,
        humidity: 30 + Math.floor(Math.random() * 50),
        wind: 5 + Math.floor(Math.random() * 20),
        location: 'San Francisco',
        high: baseTemp + 8,
        low: baseTemp - 4,
      });
    };

    // Update every 30 seconds for demo purposes
    const interval = setInterval(updateWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    const found = weatherConditions.find(w => w.condition === weather.condition);
    if (!found) return Sun;
    return found.icon;
  };

  const getWeatherLabel = () => {
    const found = weatherConditions.find(w => w.condition === weather.condition);
    return found?.label || 'Unknown';
  };

  const WeatherIcon = getWeatherIcon();

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="glass rounded-2xl p-4 w-[200px] cursor-default animate-fade-in window-shadow">
      {/* Location & Date */}
      <div className="mb-3">
        <p className="text-sm font-medium">{weather.location}</p>
        <p className="text-xs text-muted-foreground">{formatDay(currentTime)}</p>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <WeatherIcon className="w-10 h-10 text-primary" />
          <div>
            <p className="text-3xl font-light">{weather.temp}°</p>
            <p className="text-xs text-muted-foreground">{getWeatherLabel()}</p>
          </div>
        </div>
      </div>

      {/* High/Low */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span>H: {weather.high}°</span>
        <span>L: {weather.low}°</span>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Droplets className="w-3.5 h-3.5" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wind className="w-3.5 h-3.5" />
          <span>{weather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}
