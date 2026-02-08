import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GameCard } from './GameCard';
import { CheapSharkGame } from '../services/cheapshark';
import React from 'react';

const mockGame: CheapSharkGame = {
  gameID: '123',
  steamAppID: '456',
  cheapest: '9.99',
  cheapestDealID: 'abc',
  external: 'Test Game',
  internalName: 'TESTGAME',
  thumb: 'https://example.com/thumb.jpg',
};

describe('GameCard', () => {
  it('renders game details', () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByText('Test Game')).toBeDefined();
    expect(screen.getByText('$9.99')).toBeDefined();
    const image = screen.getByRole('img');
    expect(image).toHaveProperty('alt', 'Test Game');
  });

  it('renders "No Image" when thumb is missing', () => {
    const gameWithoutThumb = { ...mockGame, thumb: '' };
    render(<GameCard game={gameWithoutThumb} />);
    expect(screen.getByText('No Image')).toBeDefined();
  });

  it('has a link to the deal', () => {
    render(<GameCard game={mockGame} />);
    const link = screen.getByRole('link', { name: /view deal/i });
    expect(link).toHaveProperty('href', 'https://www.cheapshark.com/redirect?dealID=abc');
  });
});
