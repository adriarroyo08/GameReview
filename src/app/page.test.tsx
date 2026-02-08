import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';
import * as cheapshark from '../services/cheapshark';
import React from 'react';

// Mock the searchGames function
vi.mock('../services/cheapshark', () => ({
  searchGames: vi.fn(),
}));

const mockGames = [
  {
    gameID: '1',
    steamAppID: '100',
    cheapest: '5.00',
    cheapestDealID: 'deal1',
    external: 'Test Game 1',
    internalName: 'TESTGAME1',
    thumb: 'https://example.com/thumb1.jpg',
  },
  {
    gameID: '2',
    steamAppID: '200',
    cheapest: '10.00',
    cheapestDealID: 'deal2',
    external: 'Test Game 2',
    internalName: 'TESTGAME2',
    thumb: 'https://example.com/thumb2.jpg',
  },
];

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Home />);
    expect(screen.getByText('GamePrice Tracker')).toBeDefined();
    expect(screen.getByPlaceholderText('Search for a game...')).toBeDefined();
    expect(screen.getByText('Search for a game to see the best deals!')).toBeDefined();
  });

  it('performs search and displays results', async () => {
    // Setup mock return value
    vi.mocked(cheapshark.searchGames).mockResolvedValue(mockGames);

    render(<Home />);

    const input = screen.getByPlaceholderText('Search for a game...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test Game 1')).toBeDefined();
      expect(screen.getByText('Test Game 2')).toBeDefined();
    });

    expect(cheapshark.searchGames).toHaveBeenCalledWith('Test');
  });

  it('displays "No games found" when results are empty', async () => {
    vi.mocked(cheapshark.searchGames).mockResolvedValue([]);

    render(<Home />);

    const input = screen.getByPlaceholderText('Search for a game...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'NonExistent' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No games found. Try a different search.')).toBeDefined();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(cheapshark.searchGames).mockRejectedValue(new Error('API Error'));

    render(<Home />);

    const input = screen.getByPlaceholderText('Search for a game...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch games. Please try again.')).toBeDefined();
    });
  });
});
