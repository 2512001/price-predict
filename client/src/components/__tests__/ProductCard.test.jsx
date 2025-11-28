import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import ProductCard from '../ProductCard';
import { predictPrice } from '../../Api/api';
import userSlice from '../../redux/slices/userSlice';

// Mock the API
jest.mock('../../Api/api', () => ({
  ...jest.requireActual('../../Api/api'),
  predictPrice: jest.fn(),
  addCart: jest.fn(),
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart">Chart</div>,
}));

const mockProduct = {
  _id: 'product-123',
  name: 'Test Product',
  price: 50000,
  images: ['https://example.com/image.jpg'],
  stock: 10,
  averageRating: 4.5,
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
      cart: (state = { items: [] }) => state,
    },
    preloadedState: {
      user: {
        user: { _id: 'user-123', ...initialState.user },
      },
    },
  });
};

describe('ProductCard', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
    jest.clearAllMocks();
  });

  it('renders product information', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
  });

  it('shows loading state when predicting', async () => {
    predictPrice.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const predictButton = screen.getByText('Predict Price');
    fireEvent.click(predictButton);

    await waitFor(() => {
      expect(screen.getByText('Predicting…')).toBeInTheDocument();
    });

    expect(predictButton).toBeDisabled();
  });

  it('displays chart on successful prediction', async () => {
    const mockPredictionData = {
      request_id: 'test-123',
      model_version: 'v1.0',
      predicted_at: '2025-11-28T12:34:56Z',
      horizon_days: 7,
      predictions: [
        { date: '2025-11-29', predicted_price: 103.1 },
        { date: '2025-11-30', predicted_price: 104.2 },
      ],
      confidence: 0.87,
      latency_ms: 123,
    };

    predictPrice.mockResolvedValueOnce(mockPredictionData);

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const predictButton = screen.getByText('Predict Price');
    fireEvent.click(predictButton);

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Price prediction generated!',
      expect.any(Object)
    );
  });

  it('shows error message on prediction failure', async () => {
    const errorMessage = 'Prediction failed';
    predictPrice.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const predictButton = screen.getByText('Predict Price');
    fireEvent.click(predictButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it('allows retry after error', async () => {
    const errorMessage = 'Prediction failed';
    predictPrice
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce({
        request_id: 'test-123',
        model_version: 'v1.0',
        predictions: [{ date: '2025-11-29', predicted_price: 103.1 }],
        latency_ms: 123,
      });

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const predictButton = screen.getByText('Predict Price');
    fireEvent.click(predictButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });
  });
});




