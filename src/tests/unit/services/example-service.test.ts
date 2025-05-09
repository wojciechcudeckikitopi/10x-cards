import { beforeEach, describe, expect, it } from 'vitest';
import type { FlashcardDTO } from '../../../types';
import { createMockSupabaseClient } from '../../mocks/supabase.mock';

// This is a simple example service we're testing
// In a real app, you would import the actual service
const FlashcardService = {
  async getFlashcards(supabaseClient: any, status?: string): Promise<FlashcardDTO[]> {
    try {
      let query = supabaseClient.from('flashcards').select('*');
        
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as FlashcardDTO[];
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  }
};

describe('FlashcardService', () => {
  let mockSupabaseClient: any;
  let mocks: any;
  
  beforeEach(() => {
    // Create a new mock client for each test to avoid cross-test pollution
    const mockResult = createMockSupabaseClient();
    mockSupabaseClient = mockResult.mockSupabaseClient;
    mocks = mockResult.mocks;
  });
  
  it('should fetch all flashcards', async () => {
    // Setup mock return values
    const mockFlashcards = [
      {
        id: '1',
        front: 'Test Question 1',
        back: 'Test Answer 1',
        status: 'accepted',
        source: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generation_id: null
      },
      {
        id: '2',
        front: 'Test Question 2',
        back: 'Test Answer 2',
        status: 'pending',
        source: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generation_id: null
      }
    ];
    
    // Configure the mock chain to return our test data
    mocks.select.mockReturnValueOnce({
      eq: mocks.eq,
      then: (callback: any) => callback({ data: mockFlashcards, error: null })
    });
    
    // Call the service method
    const result = await FlashcardService.getFlashcards(mockSupabaseClient);
    
    // Verify the correct Supabase queries were made
    expect(mocks.from).toHaveBeenCalledWith('flashcards');
    expect(mocks.select).toHaveBeenCalledWith('*');
    
    // Verify the result matches our mock data
    expect(result).toEqual(mockFlashcards);
  });
  
  it('should fetch flashcards with status filter', async () => {
    // Setup mock return values for filtered results
    const mockFilteredFlashcards = [
      {
        id: '1',
        front: 'Test Question 1',
        back: 'Test Answer 1',
        status: 'accepted',
        source: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generation_id: null
      }
    ];
    
    // Configure the mock chain to return our test data
    mocks.select.mockReturnValueOnce({
      eq: mocks.eq
    });
    
    // Configure the eq mock to return filtered data
    mocks.eq.mockReturnValueOnce({
      then: (callback: any) => callback({ data: mockFilteredFlashcards, error: null })
    });
    
    // Call the service method with a status filter
    const result = await FlashcardService.getFlashcards(mockSupabaseClient, 'accepted');
    
    // Verify the correct Supabase queries were made, including the filter
    expect(mocks.from).toHaveBeenCalledWith('flashcards');
    expect(mocks.select).toHaveBeenCalledWith('*');
    expect(mocks.eq).toHaveBeenCalledWith('status', 'accepted');
    
    // Verify the result matches our filtered mock data
    expect(result).toEqual(mockFilteredFlashcards);
  });
});