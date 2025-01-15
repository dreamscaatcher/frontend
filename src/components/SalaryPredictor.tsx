'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface PredictionResponse {
  salary_usd: number;
  confidence: number;
}

const SalaryPredictor = () => {
  const [formData, setFormData] = useState({
    experience_level: '',
    company_size: '',
    employment_type: '',
    job_title: ''
  });
  
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Prediction request failed');
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Salary Predictor</CardTitle>
            <CardDescription className="text-center">
              Enter your details to predict your salary in USD
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Experience Level</label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({...prev, experience_level: value}))}
                value={formData.experience_level}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">Entry Level</SelectItem>
                  <SelectItem value="MI">Mid Level</SelectItem>
                  <SelectItem value="SE">Senior</SelectItem>
                  <SelectItem value="EX">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Size</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, company_size: value}))}
                value={formData.company_size}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Employment Type</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, employment_type: value}))}
                value={formData.employment_type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FT">Full Time</SelectItem>
                  <SelectItem value="PT">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Title</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, job_title: value}))}
                value={formData.job_title}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                  <SelectItem value="Data Manager">Data Manager</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg"
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Calculating...' : 'Predict Salary'}
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {prediction && (
              <div className="w-full p-6 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-semibold text-lg text-green-800">Predicted Salary</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ${prediction.salary_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SalaryPredictor;