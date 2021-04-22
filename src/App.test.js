import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text when app loads', () => {
  render(<App />);
  const linkElement = screen.getByText(/investly/i);
  expect(linkElement).toBeInTheDocument();
});
