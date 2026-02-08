import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    searchGames,
    getGameById,
    getGameBySlug,
    getPlatforms,
    getPopularGames,
    getImageUrl,
    WEBSITE_CATEGORIES,
    resetTokenCache,
} from "./igdb";

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock environment variables
const originalEnv = process.env;

describe("IGDB Service", () => {
    beforeEach(() => {
        fetchMock.mockReset();
        resetTokenCache();
        process.env = {
            ...originalEnv,
            TWITCH_CLIENT_ID: "test_client_id",
            TWITCH_CLIENT_SECRET: "test_client_secret",
        };
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.restoreAllMocks();
    });

    // Mock successful token response
    const mockTokenResponse = {
        access_token: "test_token_123",
        expires_in: 3600,
        token_type: "bearer",
    };

    describe("searchGames", () => {
        it("should authenticate and search games successfully", async () => {
            const mockGames = [
                {
                    id: 1,
                    name: "The Witcher 3",
                    slug: "the-witcher-3",
                    rating: 92.5,
                    platforms: [{ id: 6, name: "PC", abbreviation: "PC" }],
                },
            ];

            // First call: token request
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            // Second call: IGDB API
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockGames,
            });

            const games = await searchGames("witcher");

            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(fetchMock.mock.calls[1][0]).toBe("https://api.igdb.com/v4/games");
            expect(games).toEqual(mockGames);
        });

        it("should throw error when credentials are missing", async () => {
            process.env.TWITCH_CLIENT_ID = "";
            process.env.TWITCH_CLIENT_SECRET = "";

            await expect(searchGames("test")).rejects.toThrow(
                "TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set"
            );
        });

        it("should throw error if token request fails", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                statusText: "Unauthorized",
            });

            await expect(searchGames("test")).rejects.toThrow(
                "Failed to get access token"
            );
        });
    });

    describe("getGameById", () => {
        it("should fetch game by ID", async () => {
            const mockGame = {
                id: 1942,
                name: "The Witcher 3: Wild Hunt",
                slug: "the-witcher-3-wild-hunt",
                summary: "An action RPG",
                rating: 92.5,
                cover: { id: 123, image_id: "co1234" },
            };

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockGame],
            });

            const game = await getGameById(1942);

            expect(game).toEqual(mockGame);
        });

        it("should return null if game not found", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const game = await getGameById(99999999);

            expect(game).toBeNull();
        });
    });

    describe("getGameBySlug", () => {
        it("should fetch game by slug", async () => {
            const mockGame = {
                id: 1942,
                name: "The Witcher 3: Wild Hunt",
                slug: "the-witcher-3-wild-hunt",
            };

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockGame],
            });

            const game = await getGameBySlug("the-witcher-3-wild-hunt");

            expect(game).toEqual(mockGame);
        });
    });

    describe("getPlatforms", () => {
        it("should fetch all platforms", async () => {
            const mockPlatforms = [
                { id: 6, name: "PC (Microsoft Windows)", abbreviation: "PC" },
                { id: 48, name: "PlayStation 4", abbreviation: "PS4" },
            ];

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockPlatforms,
            });

            const platforms = await getPlatforms();

            expect(platforms).toEqual(mockPlatforms);
        });
    });

    describe("getPopularGames", () => {
        it("should fetch popular games", async () => {
            const mockGames = [
                { id: 1, name: "Game 1", total_rating: 95 },
                { id: 2, name: "Game 2", total_rating: 90 },
            ];

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockGames,
            });

            const games = await getPopularGames(10);

            expect(games).toEqual(mockGames);
        });
    });

    describe("getImageUrl", () => {
        it("should generate correct image URL", () => {
            const url = getImageUrl("co1234", "cover_big");
            expect(url).toBe(
                "https://images.igdb.com/igdb/image/upload/t_cover_big/co1234.jpg"
            );
        });

        it("should use cover_big as default size", () => {
            const url = getImageUrl("co1234");
            expect(url).toBe(
                "https://images.igdb.com/igdb/image/upload/t_cover_big/co1234.jpg"
            );
        });

        it("should support different sizes", () => {
            expect(getImageUrl("co1234", "screenshot_huge")).toBe(
                "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/co1234.jpg"
            );
        });
    });

    describe("WEBSITE_CATEGORIES", () => {
        it("should have correct category mappings", () => {
            expect(WEBSITE_CATEGORIES[13]).toBe("steam");
            expect(WEBSITE_CATEGORIES[16]).toBe("epicgames");
            expect(WEBSITE_CATEGORIES[17]).toBe("gog");
        });
    });
});
