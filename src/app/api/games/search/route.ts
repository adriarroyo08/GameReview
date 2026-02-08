import { NextRequest, NextResponse } from "next/server";
import {
    searchGames as searchIGDB,
    getImageUrl,
    IGDBGame,
} from "@/services/igdb";
import {
    searchGames as searchCheapShark,
    CheapSharkGame,
} from "@/services/cheapshark";
import { cache, createCacheKey } from "@/services/cache";

export interface GameSearchResult {
    // From IGDB
    id: number;
    name: string;
    slug: string;
    summary?: string;
    rating?: number;
    aggregatedRating?: number;
    totalRating?: number;
    releaseDate?: string;
    coverUrl?: string;
    platforms?: { id: number; name: string; abbreviation?: string }[];
    genres?: { id: number; name: string }[];
    // From CheapShark (if available)
    cheapestPrice?: string;
    cheapSharkGameId?: string;
}

function transformIGDBGame(game: IGDBGame): GameSearchResult {
    return {
        id: game.id,
        name: game.name,
        slug: game.slug,
        summary: game.summary,
        rating: game.rating,
        aggregatedRating: game.aggregated_rating,
        totalRating: game.total_rating,
        releaseDate: game.first_release_date
            ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
            : undefined,
        coverUrl: game.cover?.image_id
            ? getImageUrl(game.cover.image_id, "cover_big")
            : undefined,
        platforms: game.platforms,
        genres: game.genres,
    };
}

function enrichWithCheapShark(
    igdbGames: GameSearchResult[],
    cheapSharkGames: CheapSharkGame[]
): GameSearchResult[] {
    // Create a map of CheapShark games by normalized name
    const cheapSharkMap = new Map<string, CheapSharkGame>();
    for (const game of cheapSharkGames) {
        const normalizedName = game.external.toLowerCase().replace(/[^a-z0-9]/g, "");
        cheapSharkMap.set(normalizedName, game);
    }

    // Enrich IGDB games with CheapShark data
    return igdbGames.map((game) => {
        const normalizedName = game.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cheapSharkGame = cheapSharkMap.get(normalizedName);

        if (cheapSharkGame) {
            return {
                ...game,
                cheapestPrice: cheapSharkGame.cheapest,
                cheapSharkGameId: cheapSharkGame.gameID,
            };
        }

        return game;
    });
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    if (!query || query.trim().length < 2) {
        return NextResponse.json(
            { error: "Query parameter 'q' is required and must be at least 2 characters" },
            { status: 400 }
        );
    }

    const cacheKey = createCacheKey("search", query.toLowerCase(), limit);
    const cachedResult = cache.get<GameSearchResult[]>(cacheKey);

    if (cachedResult) {
        return NextResponse.json({
            results: cachedResult,
            cached: true,
        });
    }

    try {
        // Fetch from both APIs in parallel
        const [igdbGames, cheapSharkGames] = await Promise.all([
            searchIGDB(query, limit),
            searchCheapShark(query).catch(() => [] as CheapSharkGame[]), // Don't fail if CheapShark is down
        ]);

        // Transform and enrich results
        const transformedGames = igdbGames.map(transformIGDBGame);
        const enrichedGames = enrichWithCheapShark(transformedGames, cheapSharkGames);

        // Cache for 5 minutes
        cache.set(cacheKey, enrichedGames, 5 * 60 * 1000);

        return NextResponse.json({
            results: enrichedGames,
            cached: false,
        });
    } catch (error) {
        console.error("Search error:", error);

        // Check if it's a credentials error
        if (error instanceof Error && error.message.includes("TWITCH_CLIENT")) {
            return NextResponse.json(
                {
                    error: "IGDB API not configured. Please set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET.",
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Failed to search games" },
            { status: 500 }
        );
    }
}
