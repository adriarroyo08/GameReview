import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStores, searchGames, getGameDetails } from './cheapshark';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('CheapShark Service', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getStores', () => {
    it('should fetch stores successfully', async () => {
      const mockStores = [
        {
          storeID: '1',
          storeName: 'Steam',
          isActive: 1,
          images: {
            banner: '/banner.png',
            logo: '/logo.png',
            icon: '/icon.png',
          },
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStores,
      });

      const stores = await getStores();

      expect(fetchMock).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/stores');
      expect(stores).toEqual(mockStores);
    });

    it('should throw an error if fetch fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(getStores()).rejects.toThrow('Failed to fetch from API: Internal Server Error');
    });
  });

  describe('searchGames', () => {
    it('should search for games successfully', async () => {
      const mockGames = [
        {
          gameID: '123',
          steamAppID: '456',
          cheapest: '10.00',
          cheapestDealID: 'deal123',
          external: 'Test Game',
          internalName: 'TESTGAME',
          thumb: '/thumb.png',
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGames,
      });

      const games = await searchGames('Test Game');

      expect(fetchMock).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/games?title=Test%20Game');
      expect(games).toEqual(mockGames);
    });

    it('should throw an error if fetch fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(searchGames('Test Game')).rejects.toThrow('Failed to fetch from API: Not Found');
    });
  });

  describe('getGameDetails', () => {
    it('should fetch game details successfully', async () => {
      const mockDetails = {
        info: {
          title: 'Test Game',
          steamAppID: '456',
          thumb: '/thumb.png',
        },
        cheapestPriceEver: {
          price: '5.00',
          date: 1600000000,
        },
        deals: [
          {
            storeID: '1',
            dealID: 'deal123',
            price: '10.00',
            retailPrice: '20.00',
            savings: '50.000000',
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetails,
      });

      const details = await getGameDetails('123');

      expect(fetchMock).toHaveBeenCalledWith('https://www.cheapshark.com/api/1.0/games?id=123');
      expect(details).toEqual(mockDetails);
    });

    it('should throw an error if fetch fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(getGameDetails('123')).rejects.toThrow('Failed to fetch from API: Bad Request');
    });
  });
});
