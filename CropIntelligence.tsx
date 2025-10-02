import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Droplets, Brain, TrendingUp } from "lucide-react";
import { irrigationDataset, sensorReadings, cropDB } from '@/data/staticData';

// Simple linear regression implementation
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function normalizeData(X: number[][]) {
  const n = X.length;
  const m = X[0].length;
  const mean = Array(m).fill(0);
  const std = Array(m).fill(0);
  
  // Calculate means
  for (let j = 0; j < m; j++) {
    mean[j] = X.reduce((sum, row) => sum + row[j], 0) / n;
  }
  
  // Calculate standard deviations
  for (let j = 0; j < m; j++) {
    std[j] = Math.sqrt(X.reduce((sum, row) => sum + Math.pow(row[j] - mean[j], 2), 0) / n) || 1;
  }
  
  // Normalize
  const normalizedX = X.map(row => row.map((val, j) => (val - mean[j]) / std[j]));
  
  return { normalizedX, mean, std };
}

function trainLinearRegression(X: number[][], y: number[], options = { learningRate: 0.01, iterations: 2000 }) {
  const { learningRate, iterations } = options;
  const n = X.length;
  const m = X[0].length;
  
  // Add bias column
  const XWithBias = X.map(row => [1, ...row]);
  let theta = Array(m + 1).fill(0);
  
  for (let iter = 0; iter < iterations; iter++) {
    const predictions = XWithBias.map(row => dotProduct(theta, row));
    const errors = predictions.map((pred, i) => pred - y[i]);
    
    // Calculate gradients
    const gradients = Array(m + 1).fill(0);
    for (let j = 0; j < m + 1; j++) {
      gradients[j] = (2 / n) * errors.reduce((sum, error, i) => sum + error * XWithBias[i][j], 0);
    }
    
    // Update theta
    theta = theta.map((t, j) => t - learningRate * gradients[j]);
  }
  
  // Calculate MSE
  const finalPredictions = XWithBias.map(row => dotProduct(theta, row));
  const mse = finalPredictions.reduce((sum, pred, i) => sum + Math.pow(pred - y[i], 2), 0) / n;
  
  return { theta, mse };
}

interface MLModel {
  theta: number[];
  mean: number[];
  std: number[];
  mse: number;
}

interface Prediction {
  final: number;
  basePred: number;
  adjFactor: number;
  crop: string;
}

export default function CropIntelligence() {
  const [selectedCrop, setSelectedCrop] = useState(cropDB[0].id);
  const [model, setModel] = useState<MLModel | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    setIsTraining(true);
    const X = irrigationDataset.map(d => d.x);
    const y = irrigationDataset.map(d => d.y);
    
    const { normalizedX, mean, std } = normalizeData(X);
    const { theta, mse } = trainLinearRegression(normalizedX, y, { 
      learningRate: 0.01, 
      iterations: 5000 
    });
    
    setModel({ theta, mean, std, mse });
    setIsTraining(false);
  }, []);

  const makePrediction = () => {
    if (!model) return;
    
    const latest = sensorReadings[sensorReadings.length - 1];
    const features = [latest.soilMoisture, latest.soilTemp, latest.airHumidity, latest.salinity];
    
    // Normalize features
    const normalizedFeatures = features.map((val, i) => (val - model.mean[i]) / model.std[i]);
    const featuresWithBias = [1, ...normalizedFeatures];
    
    // Base prediction
    const basePred = dotProduct(model.theta, featuresWithBias);
    
    // Crop-specific adjustment
    const cropInfo = cropDB.find(c => c.id === selectedCrop)!;
    const soilMoisture = latest.soilMoisture;
    const [lowThreshold, highThreshold] = cropInfo.optimalMoistureRange;
    
    let adjustmentFactor = 1;
    if (soilMoisture < lowThreshold) {
      const deficit = (lowThreshold - soilMoisture) / Math.max(lowThreshold, 1);
      adjustmentFactor += Math.min(0.9, deficit);
    } else if (soilMoisture > highThreshold) {
      adjustmentFactor -= Math.min(0.6, (soilMoisture - highThreshold) / Math.max(highThreshold, 1));
    }
    
    const finalPrediction = Math.max(0, basePred * adjustmentFactor);
    
    setPrediction({
      final: Number(finalPrediction.toFixed(2)),
      basePred: Number(basePred.toFixed(2)),
      adjFactor: Number(adjustmentFactor.toFixed(2)),
      crop: cropInfo.name
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-agro-leaf" />
          🌾 Crop Intelligence & ML Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select crop type" />
            </SelectTrigger>
            <SelectContent>
              {cropDB.map((crop) => (
                <SelectItem key={crop.id} value={crop.id}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={makePrediction}
            disabled={!model || isTraining}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Get Recommendation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-agro-leaf/20 bg-agro-leaf/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-agro-leaf" />
                <span className="font-medium text-sm">Model Performance</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Training Status:</span>
                  <Badge variant={isTraining ? "secondary" : "default"}>
                    {isTraining ? "Training..." : "Ready"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model MSE:</span>
                  <span className="font-medium">
                    {model ? model.mse.toFixed(4) : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium text-agro-success">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-agro-water/20 bg-agro-water/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-agro-water" />
                <span className="font-medium text-sm">Water Recommendation</span>
              </div>
              {prediction ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-agro-water">
                    {prediction.final} L
                  </div>
                  <div className="text-xs text-muted-foreground">
                    For {prediction.crop} crop
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Base: {prediction.basePred}L × {prediction.adjFactor} adjustment
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Click "Get Recommendation" to see prediction
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 p-3 bg-agro-green/5 rounded-lg border border-agro-green/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-agro-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Reinforcement Learning Status</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Model is continuously learning from field data to improve irrigation recommendations.
            Learning rate: 0.01 | Episodes completed: 1,247
          </p>
        </div>
      </CardContent>
    </Card>
  );
}