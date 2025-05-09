import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

// This is just a simple example component to test
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('Counter component', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />);
    const countElement = screen.getByTestId('count');
    expect(countElement.textContent).toBe('0');
  });

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: /increment/i }));
    
    const countElement = screen.getByTestId('count');
    expect(countElement.textContent).toBe('1');
  });
}); 