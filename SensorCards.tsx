import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Beaker,
  Gauge,
  TrendingUp
} from "lucide-react";
import { sensorReadings } from '@/data/staticData';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

function SensorCard({ icon, title, value, unit, color, trend }: SensorCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default",
      "border-l-4",
      color === 'water' && "border-l-agro-water bg-agro-water/5",
      color === 'temp' && "border-l-agro-sun bg-agro-sun/5", 
      color === 'soil' && "border-l-agro-soil bg-agro-soil/5",
      color === 'air' && "border-l-agro-leaf bg-agro-leaf/5",
      color === 'science' && "border-l-agro-warning bg-agro-warning/5",
      color === 'level' && "border-l-agro-success bg-agro-success/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              color === 'water' && "bg-agro-water/20 text-agro-water",
              color === 'temp' && "bg-agro-sun/20 text-agro-sun",
              color === 'soil' && "bg-agro-soil/20 text-agro-soil", 
              color === 'air' && "bg-agro-leaf/20 text-agro-leaf",
              color === 'science' && "bg-agro-warning/20 text-agro-warning",
              color === 'level' && "bg-agro-success/20 text-agro-success"
            )}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}{unit}</p>
            </div>
          </div>
          {trend && (
            <TrendingUp className={cn(
              "h-4 w-4",
              trend === 'up' && "text-agro-success",
              trend === 'down' && "text-destructive",
              trend === 'stable' && "text-muted-foreground"
            )} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SensorCards() {
  const [currentIndex, setCurrentIndex] = useState(sensorReadings.length - 1);
  const [heartbeat, setHeartbeat] = useState(true);
  const latest = sensorReadings[currentIndex];

  useEffect(() => {
    const hbTimer = setInterval(() => setHeartbeat(h => !h), 1000);
    return () => clearInterval(hbTimer);
  }, []);

  useEffect(() => {
    const dataTimer = setInterval(() => {
      setCurrentIndex(i => (i + 1) % sensorReadings.length);
    }, 4000);
    return () => clearInterval(dataTimer);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Rover Sensors</CardTitle>
            <div className="flex items-center gap-3">
              <Badge 
                variant={heartbeat ? "default" : "secondary"} 
                className={cn(
                  "transition-colors",
                  heartbeat ? "bg-agro-success" : "bg-muted"
                )}
              >
                {heartbeat ? "Online" : "Syncing..."}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated: {latest.ts}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorCard 
          icon={<Droplets className="h-5 w-5" />}
          title="Soil Moisture" 
          value={latest.soilMoisture} 
          unit="%" 
          color="water"
          trend="down"
        />
        <SensorCard 
          icon={<Thermometer className="h-5 w-5" />}
          title="Soil Temperature" 
          value={latest.soilTemp} 
          unit="°C" 
          color="temp"
          trend="up"
        />
        <SensorCard 
          icon={<Wind className="h-5 w-5" />}
          title="Air Temperature" 
          value={latest.airTemp} 
          unit="°C" 
          color="air"
          trend="up"
        />
        <SensorCard 
          icon={<Droplets className="h-5 w-5" />}
          title="Air Humidity" 
          value={latest.airHumidity} 
          unit="%" 
          color="water"
          trend="stable"
        />
        <SensorCard 
          icon={<Beaker className="h-5 w-5" />}
          title="Salinity" 
          value={latest.salinity} 
          unit=" ppt" 
          color="science"
          trend="up"
        />
        <SensorCard 
          icon={<Gauge className="h-5 w-5" />}
          title="Tank Level" 
          value={latest.waterLevel} 
          unit="%" 
          color="level"
          trend="down"
        />
      </div>
    </div>
  );
}