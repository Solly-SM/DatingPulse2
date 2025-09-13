import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DatingPulse app', () => {
  render(<App />);
  const titleElement = screen.getByText(/DatingPulse/i);
  expect(titleElement).toBeInTheDocument();
});
