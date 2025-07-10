import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentSummaryPanel from '../agent/AgentSummaryPanel';

// Mock the Gemini service
jest.mock('../services/geminiService', () => ({
  geminiService: {
    analyzeTextReport: jest.fn(() => Promise.resolve({ 
      summary: 'Test AI summary',
      recommendations: ['Test recommendation 1', 'Test recommendation 2']
    })),
  },
}));

describe('AgentSummaryPanel', () => {
  const mockCityData = {
    name: 'Delhi',
    aqi: 150,
    temperature: 25,
    population: 20000000,
    weather: 'Sunny',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    expect(screen.getByText(/analyzing city data/i)).toBeInTheDocument();
  });

  test('renders AI summary after loading', async () => {
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/ai summary/i)).toBeInTheDocument();
    });
  });

  test('displays city name in summary', async () => {
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/delhi/i)).toBeInTheDocument();
    });
  });

  test('shows error state when AI analysis fails', async () => {
    // Mock the service to throw an error
    const { geminiService } = require('../services/geminiService');
    geminiService.analyzeTextReport.mockRejectedValue(new Error('AI service error'));
    
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/unable to generate summary/i)).toBeInTheDocument();
    });
  });

  test('displays recommendations when available', async () => {
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/test recommendation 1/i)).toBeInTheDocument();
      expect(screen.getByText(/test recommendation 2/i)).toBeInTheDocument();
    });
  });

  test('handles empty city data gracefully', async () => {
    render(<AgentSummaryPanel cityData={null} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no city data available/i)).toBeInTheDocument();
    });
  });

  test('shows refresh button', async () => {
    render(<AgentSummaryPanel cityData={mockCityData} />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });
  });
}); 