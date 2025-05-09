// GenerateFlashcardsForm.test.tsx
import { GenerateFlashcardsForm } from '@/components/GenerateFlashcardsForm.tsx';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mockowanie modułów zewnętrznych
vi.mock('@/components/ui/Toast', () => ({
  Toast: vi.fn(({ title }) => <div data-testid="toast">{title}</div>),
}));

vi.mock('@/components/ui/LoadingIndicator', () => ({
  LoadingIndicator: vi.fn(() => <div data-testid="loading">Loading...</div>),
}));

// Przygotowanie danych testowych
const mockFlashcardResponse = {
  generation_id: 'test-gen-1',
  flashcards: [
    {
      front: 'Test Front',
      back: 'Test Back',
      source: 'ai-generated'
    }
  ]
};

describe('GenerateFlashcardsForm', () => {
  beforeEach(() => {
    // Reset wszystkich mocków przed każdym testem
    vi.clearAllMocks();
    // Reset fetch mocka
    global.fetch = vi.fn();
  });

  describe('Text Validation', () => {
    it('should show error when text is less than 1000 characters', async () => {
      render(<GenerateFlashcardsForm />);
      const textarea = screen.getByPlaceholderText(/Enter your text here/i);
      const generateButton = screen.getByText(/Generate Flashcards/i);

      await userEvent.type(textarea, 'a'.repeat(999));

      expect(generateButton).toBeDisabled();
      expect(screen.getByText(/999 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Text must be between 1,000 and 10,000 characters/)).toBeInTheDocument();
    });

    it('should show error when text exceeds 10000 characters', async () => {
      render(<GenerateFlashcardsForm />);
      const textarea = screen.getByPlaceholderText(/Enter your text here/i);
      
      fireEvent.change(textarea, { target: { value: 'a'.repeat(10001) } });

      expect(screen.getByText(/10001 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Text must be between 1,000 and 10,000 characters/)).toBeInTheDocument();
    });

    it('should enable generate button for valid text length', async () => {
      render(<GenerateFlashcardsForm />);
      const textarea = screen.getByPlaceholderText(/Enter your text here/i);
      const generateButton = screen.getByText(/Generate Flashcards/i);

      await userEvent.type(textarea, 'a'.repeat(1000));

      expect(generateButton).not.toBeDisabled();
      expect(screen.getByText(/1000 characters/)).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should handle successful flashcard generation', async () => {
      // Przygotowanie mocka dla fetch
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockFlashcardResponse),
            });
          }, 100); // Small delay to ensure loading state is visible
        })
      );

      render(<GenerateFlashcardsForm />);
      const textarea = screen.getByPlaceholderText(/Enter your text here/i);
      const generateButton = screen.getByText(/Generate Flashcards/i);

      await userEvent.type(textarea, 'a'.repeat(1000));
      await userEvent.click(generateButton);

      // Sprawdzenie czy loader się pojawił
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument();
      });

      // Sprawdzenie czy fetch został wywołany z odpowiednimi parametrami
      expect(global.fetch).toHaveBeenCalledWith('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_text: 'a'.repeat(1000) }),
      });

      // Sprawdzenie czy fiszki zostały wyrenderowane
      await waitFor(() => {
        expect(screen.getByText('Test Front')).toBeInTheDocument();
        expect(screen.getByText('Test Back')).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      // Przygotowanie mocka dla nieudanego żądania
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));

      render(<GenerateFlashcardsForm />);
      const textarea = screen.getByPlaceholderText(/Enter your text here/i);
      const generateButton = screen.getByText(/Generate Flashcards/i);

      await userEvent.type(textarea, 'a'.repeat(1000));
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });
  });

  describe('Flashcard Management', () => {
    it('should handle flashcard acceptance correctly', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFlashcardResponse),
      });

      render(<GenerateFlashcardsForm />);
      
      // Generowanie fiszek
      await userEvent.type(screen.getByPlaceholderText(/Enter your text here/i), 'a'.repeat(1000));
      await userEvent.click(screen.getByText(/Generate Flashcards/i));

      // Oczekiwanie na wyrenderowanie fiszek
      await waitFor(() => {
        expect(screen.getByText('Test Front')).toBeInTheDocument();
      });

      // Akceptacja fiszki
      const acceptButton = screen.getByText('Accept');
      await userEvent.click(acceptButton);

      // Sprawdzenie czy status się zmienił
      expect(screen.getByText('Accepted')).toBeInTheDocument();
    });

    it('should handle flashcard rejection correctly', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFlashcardResponse),
      });

      render(<GenerateFlashcardsForm />);
      
      await userEvent.type(screen.getByPlaceholderText(/Enter your text here/i), 'a'.repeat(1000));
      await userEvent.click(screen.getByText(/Generate Flashcards/i));

      await waitFor(() => {
        expect(screen.getByText('Test Front')).toBeInTheDocument();
      });

      const rejectButton = screen.getByText('Reject');
      await userEvent.click(rejectButton);

      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
  });

  describe('Edit Modal', () => {
    it('should open edit modal with correct data', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFlashcardResponse),
      });

      render(<GenerateFlashcardsForm />);
      
      // Generowanie i oczekiwanie na fiszki
      await userEvent.type(screen.getByPlaceholderText(/Enter your text here/i), 'a'.repeat(1000));
      await userEvent.click(screen.getByText(/Generate Flashcards/i));

      await waitFor(() => {
        expect(screen.getByText('Test Front')).toBeInTheDocument();
      });

      // Otwieranie modalu edycji
      const editButton = screen.getByText('Edit');
      await userEvent.click(editButton);

      // Sprawdzenie czy modal zawiera odpowiednie dane
      expect(screen.getByLabelText(/Front Side/i)).toHaveValue('Test Front');
      expect(screen.getByLabelText(/Back Side/i)).toHaveValue('Test Back');
    });

    it('should validate edited content', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFlashcardResponse),
      });

      render(<GenerateFlashcardsForm />);
      
      // Setup
      await userEvent.type(screen.getByPlaceholderText(/Enter your text here/i), 'a'.repeat(1000));
      await userEvent.click(screen.getByText(/Generate Flashcards/i));
      await waitFor(() => {
        expect(screen.getByText('Test Front')).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText('Edit'));

      // Próba zapisania pustych pól
      await userEvent.clear(screen.getByLabelText(/Front Side/i));
      await userEvent.click(screen.getByText('Save Changes'));

      expect(screen.getByText('Front side cannot be empty')).toBeInTheDocument();
    });
  });
});