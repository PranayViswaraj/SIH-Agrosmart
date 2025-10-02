import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { sensorReadings } from '@/data/staticData';

export default function SensorChart() {
  const chartData = sensorReadings.map(reading => ({
    time: reading.ts,
    soilMoisture: reading.soilMoisture,
    waterLevel: reading.waterLevel,
    soilTemp: reading.soilTemp,
    airTemp: reading.airTemp,
    salinity: reading.salinity,
  }));

  const latest = chartData[chartData.length - 1];
  const pieData = [
    { name: 'Soil Moisture', value: latest.soilMoisture, color: '#3b82f6' },
    { name: 'Water Level', value: latest.waterLevel, color: '#06b6d4' },
    { name: 'Soil Temp', value: Math.round(latest.soilTemp * 3), color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sensor Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Moisture and Water Level Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="soilMoisture" 
                    stroke="hsl(var(--agro-water))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--agro-water))', strokeWidth: 2, r: 4 }}
                    name="Soil Moisture (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waterLevel" 
                    stroke="hsl(var(--agro-leaf))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--agro-leaf))', strokeWidth: 2, r: 4 }}
                    name="Water Level (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="soilTemp" 
                    fill="hsl(var(--agro-soil))"
                    name="Soil Temperature (°C)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="airTemp" 
                    fill="hsl(var(--agro-sun))"
                    name="Air Temperature (°C)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}${name.includes('Temp') ? '°C' : '%'}`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Time:</span>
              <span className="font-medium">{latest.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Salinity:</span>
              <span className="font-medium">{latest.salinity} ppt</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}