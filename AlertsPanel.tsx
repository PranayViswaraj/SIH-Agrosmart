import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Info, AlertCircle, MessageSquare } from "lucide-react";
import { alerts } from '@/data/staticData';
import { cn } from '@/lib/utils';

const iconMap = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

export default function AlertsPanel() {
  const { toast } = useToast();
  
  const sendMessage = (alert: typeof alerts[0]) => {
    toast({
      title: "Message Sent",
      description: `Alert notification sent to farmer: "${alert.text.slice(0, 40)}..."`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔔 Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = iconMap[alert.level];
          
          return (
            <div 
              key={index}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border-l-4 transition-all hover:shadow-md",
                alert.level === 'critical' && "border-l-destructive bg-destructive/5",
                alert.level === 'warning' && "border-l-agro-warning bg-agro-warning/5", 
                alert.level === 'info' && "border-l-agro-water bg-agro-water/5"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                alert.level === 'critical' && "bg-destructive/20 text-destructive",
                alert.level === 'warning' && "bg-agro-warning/20 text-agro-warning",
                alert.level === 'info' && "bg-agro-water/20 text-agro-water"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-sm font-medium">{alert.text}</p>
                  <p className="text-xs text-muted-foreground">{alert.ts}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={alert.level === 'critical' ? 'destructive' : 'secondary'}
                    className={cn(
                      alert.level === 'warning' && "bg-agro-warning text-white",
                      alert.level === 'info' && "bg-agro-water text-white"
                    )}
                  >
                    {alert.level.toUpperCase()}
                  </Badge>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => sendMessage(alert)}
                    className="h-7 gap-1 text-xs"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Alert Summary (24h)</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                1 Critical
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-agro-warning rounded-full"></div>
                1 Warning
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-agro-water rounded-full"></div>
                1 Info
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}