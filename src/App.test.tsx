import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders a button', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText(/add/i);
  expect(buttonElement).toBeInTheDocument();
});
