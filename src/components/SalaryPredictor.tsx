'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Hard-code the API URL to your Railway backend URL
const API_URL = 'https://salary-predictor-production.up.railway.app';

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
    
    const requestUrl = `${API_URL}/predict`;
    console.log('Making request to:', requestUrl);
    console.log('With data:', formData);

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.detail || 'Server error');
        } catch (e) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      setPrediction(data);
    } catch (error) {
      console.error('Full error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-8 border-b">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Salary Predictor
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Enter your details to predict your salary in USD
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Experience Level</label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({...prev, experience_level: value}))}
                value={formData.experience_level}
              >
                <SelectTrigger className="w-full bg-white/90 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                  <SelectItem value="EN" className="hover:bg-blue-50/50">Entry Level</SelectItem>
                  <SelectItem value="MI" className="hover:bg-blue-50/50">Mid Level</SelectItem>
                  <SelectItem value="SE" className="hover:bg-blue-50/50">Senior</SelectItem>
                  <SelectItem value="EX" className="hover:bg-blue-50/50">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Company Size</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, company_size: value}))}
                value={formData.company_size}
              >
                <SelectTrigger className="w-full bg-white/90 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                  <SelectItem value="S" className="hover:bg-blue-50/50">Small</SelectItem>
                  <SelectItem value="M" className="hover:bg-blue-50/50">Medium</SelectItem>
                  <SelectItem value="L" className="hover:bg-blue-50/50">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Employment Type</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, employment_type: value}))}
                value={formData.employment_type}
              >
                <SelectTrigger className="w-full bg-white/90 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                  <SelectItem value="FT" className="hover:bg-blue-50/50">Full Time</SelectItem>
                  <SelectItem value="PT" className="hover:bg-blue-50/50">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Job Title</label>
              <Select
                onValueChange={(value) => setFormData(prev => ({...prev, job_title: value}))}
                value={formData.job_title}
              >
                <SelectTrigger className="w-full bg-white/90 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                  <SelectItem value="Data Engineer" className="hover:bg-blue-50/50">Data Engineer</SelectItem>
                  <SelectItem value="Data Manager" className="hover:bg-blue-50/50">Data Manager</SelectItem>
                  <SelectItem value="Data Scientist" className="hover:bg-blue-50/50">Data Scientist</SelectItem>
                  <SelectItem value="Machine Learning Engineer" className="hover:bg-blue-50/50">Machine Learning Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-6">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Calculating...' : 'Predict Salary'}
            </Button>

            {error && (
              <Alert className="mt-4 bg-red-50/50 border border-red-200 text-red-800 backdrop-blur-sm">
                <AlertDescription className="text-red-800 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {prediction && (
              <div className="w-full p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-lg">
                <h3 className="font-semibold text-xl text-green-800">Predicted Salary</h3>
                <p className="text-4xl font-bold text-green-700 mt-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  ${prediction.salary_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-2 flex-grow rounded-full bg-green-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium text-green-700">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SalaryPredictor;