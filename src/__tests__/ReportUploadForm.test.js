import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportUploadForm from '../reports/ReportUploadForm';

// Mock the Firebase service
jest.mock('../firebase/reportService', () => ({
  addReport: jest.fn(() => Promise.resolve({ id: 'test-id' })),
}));

// Mock the Gemini service
jest.mock('../services/geminiService', () => ({
  geminiService: {
    analyzeTextReport: jest.fn(() => Promise.resolve({ 
      summary: 'Test summary',
      recommendations: ['Test recommendation']
    })),
  },
}));

describe('ReportUploadForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements', () => {
    render(<ReportUploadForm />);
    
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByText(/upload media/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit report/i })).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<ReportUploadForm />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const locationInput = screen.getByLabelText(/location/i);
    
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(locationInput, { target: { value: 'Test location' } });
    
    expect(descriptionInput.value).toBe('Test description');
    expect(locationInput.value).toBe('Test location');
  });

  test('handles file upload', () => {
    render(<ReportUploadForm />);
    
    const fileInput = screen.getByLabelText(/upload media/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files[0]).toBe(file);
  });

  test('submits form successfully', async () => {
    const mockOnSubmit = jest.fn();
    render(<ReportUploadForm onSubmit={mockOnSubmit} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const locationInput = screen.getByLabelText(/location/i);
    const submitButton = screen.getByRole('button', { name: /submit report/i });
    
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(locationInput, { target: { value: 'Test location' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('shows validation error for empty description', async () => {
    render(<ReportUploadForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for empty location', async () => {
    render(<ReportUploadForm />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit report/i });
    
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });
  });
}); 