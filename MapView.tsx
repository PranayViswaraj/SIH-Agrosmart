import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw } from "lucide-react";
import { roverPath } from '@/data/staticData';
import { cn } from '@/lib/utils';

export default function MapView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const currentPosition = roverPath[currentIndex];

  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(i => (i + 1) % roverPath.length);
    }, 2500);
    
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleRover = () => setIsRunning(!isRunning);
  const resetRover = () => setCurrentIndex(0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🗺️ Farm Map — Rover Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Position {currentIndex + 1}/{roverPath.length}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleRover}
              className="gap-2"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={resetRover}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-96 overflow-hidden rounded-b-lg">
          <img 
            src="/farm-map.jpg" 
            alt="Farm satellite view" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Rover position indicator */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
            style={{
              left: `${currentPosition.x}%`,
              top: `${currentPosition.y}%`,
            }}
          >
            {/* Rover icon with pulsing effect */}
            <div className="relative">
              <div className={cn(
                "w-6 h-6 bg-agro-warning rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg",
                isRunning && "animate-pulse"
              )}>
                🤖
              </div>
              {/* Signal rings */}
              <div className="absolute inset-0 -m-2">
                <div className="w-10 h-10 border-2 border-agro-warning/40 rounded-full animate-ping"></div>
              </div>
              <div className="absolute inset-0 -m-4">
                <div className="w-14 h-14 border border-agro-warning/20 rounded-full animate-ping animation-delay-75"></div>
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
              {new Date(currentPosition.ts).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          {/* Zone indicators */}
          <div className="absolute top-4 left-4 space-y-2">
            <Badge className="bg-agro-green text-white">Zone A</Badge>
            <div className="text-xs text-white bg-black/60 px-2 py-1 rounded">
              Active monitoring
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <Badge className="bg-agro-leaf text-white">Zone B</Badge>
            <div className="text-xs text-white bg-black/60 px-2 py-1 rounded">
              Irrigation scheduled
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}