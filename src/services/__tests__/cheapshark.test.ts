import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchGames } from '../cheapshark';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

const CHEAPSHARK_BASE_URL = "https://www.cheapshark.com/api/1.0";

describe('cheapshark api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('searchGames fetches games with correct url', async () => {
    const mockGames = [
      {
        gameID: '123',
        external: 'Batman',
        cheapest: '10.00'
      }
    ];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames,
    });

    const games = await searchGames('Batman');

    expect(fetchMock).toHaveBeenCalledWith(`${CHEAPSHARK_BASE_URL}/games?title=Batman`);
    expect(games).toEqual(mockGames);
  });

  it('searchGames throws error on failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    });

    await expect(searchGames('Batman')).rejects.toThrow('Failed to search games: Internal Server Error');
  });
});
