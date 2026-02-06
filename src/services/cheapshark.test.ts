import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStores, searchGames, getGameDetails } from './cheapshark';

describe('CheapShark Service', () => {
  const fetchSpy = vi.spyOn(global, 'fetch');

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getStores', () => {
    it('should fetch stores successfully', async () => {
      const mockStores = [{ storeID: '1', storeName: 'Steam' }];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStores,
      } as Response);

      const result = await getStores();
      expect(fetchSpy).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/stores');
      expect(result).toEqual(mockStores);
    });

    it('should throw an error if fetch fails', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(getStores()).rejects.toThrow('Failed to fetch stores: Internal Server Error');
    });
  });

  describe('searchGames', () => {
    it('should search games with encoded title', async () => {
      const mockGames = [{ gameID: '1', external: 'Test Game' }];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGames,
      } as Response);

      const result = await searchGames('Test Game');
      expect(fetchSpy).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/games?title=Test%20Game');
      expect(result).toEqual(mockGames);
    });

    it('should throw an error if search fails', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(searchGames('Test')).rejects.toThrow('Failed to search games: Not Found');
    });
  });

  describe('getGameDetails', () => {
    it('should fetch game details', async () => {
      const mockDetails = { info: { title: 'Test Game' } };
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetails,
      } as Response);

      const result = await getGameDetails('123');
      expect(fetchSpy).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/games?id=123');
      expect(result).toEqual(mockDetails);
    });

    it('should throw an error if details fetch fails', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      } as Response);

      await expect(getGameDetails('123')).rejects.toThrow('Failed to get game details: Bad Request');
    });
  });
});
