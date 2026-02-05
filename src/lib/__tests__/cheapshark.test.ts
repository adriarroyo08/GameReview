import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGames, CHEAPSHARK_BASE_URL } from '../cheapshark';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('cheapshark api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('getGames fetches games with correct url', async () => {
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

    const games = await getGames('Batman');

    expect(fetchMock).toHaveBeenCalledWith(`${CHEAPSHARK_BASE_URL}/games?title=Batman`);
    expect(games).toEqual(mockGames);
  });

  it('getGames throws error on failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    });

    await expect(getGames('Batman')).rejects.toThrow('Failed to fetch games: Internal Server Error');
  });
});
