import type { RenderOptions } from '@testing-library/react';
import { render as testingLibraryRender } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

// Add any providers here that components need to be wrapped with during testing
interface ProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: ProvidersProps) => {
  // Wrap children with any necessary providers here
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => testingLibraryRender(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
