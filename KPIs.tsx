import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  Shield, 
  Clock, 
  TrendingUp, 
  Beaker, 
  AlertTriangle 
} from "lucide-react";
import { kpis } from '@/data/staticData';
import { cn } from '@/lib/utils';

const iconMap = {
  'Water Efficiency': Droplets,
  'Crop Health': Shield,  
  'System Uptime': Clock,
  'Model Accuracy': TrendingUp,
  'Water Usage': Beaker,
  'Alert Rate': AlertTriangle,
};

export default function KPIs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Key Performance Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = iconMap[kpi.title as keyof typeof iconMap] || TrendingUp;
            
            return (
              <Card 
                key={index}
                className={cn(
                  "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default",
                  "border-l-4",
                  kpi.color === 'agro-water' && "border-l-agro-water bg-agro-water/5",
                  kpi.color === 'agro-success' && "border-l-agro-success bg-agro-success/5",
                  kpi.color === 'agro-green-light' && "border-l-agro-green-light bg-agro-green-light/5",
                  kpi.color === 'agro-leaf' && "border-l-agro-leaf bg-agro-leaf/5",
                  kpi.color === 'agro-warning' && "border-l-agro-warning bg-agro-warning/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-lg",
                      kpi.color === 'agro-water' && "bg-agro-water/20 text-agro-water",
                      kpi.color === 'agro-success' && "bg-agro-success/20 text-agro-success",
                      kpi.color === 'agro-green-light' && "bg-agro-green-light/20 text-agro-green",
                      kpi.color === 'agro-leaf' && "bg-agro-leaf/20 text-agro-leaf",
                      kpi.color === 'agro-warning' && "bg-agro-warning/20 text-agro-warning"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}