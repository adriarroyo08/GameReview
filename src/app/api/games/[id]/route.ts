import { NextRequest, NextResponse } from "next/server";
import { getGameById, getImageUrl, WEBSITE_CATEGORIES, IGDBGame } from "@/services/igdb";
import { searchGames, getGameDetails, getStores } from "@/services/cheapshark";
import { cache, createCacheKey } from "@/services/cache";

export interface GameDetails {
    // From IGDB
    id: number;
    name: string;
    slug: string;
    summary?: string;
    storyline?: string;
    rating?: number;
    ratingCount?: number;
    aggregatedRating?: number;
    aggregatedRatingCount?: number;
    totalRating?: number;
    totalRatingCount?: number;
    releaseDate?: string;
    coverUrl?: string;
    screenshots?: string[];
    platforms?: { id: number; name: string; abbreviation?: string }[];
    genres?: { id: number; name: string }[];
    developers?: string[];
    publishers?: string[];
    websites?: { url: string; category: string }[];
    // From CheapShark
    deals?: {
        storeName: string;
        storeIcon?: string;
        price: string;
        retailPrice: string;
        savings: string;
        dealUrl: string;
    }[];
    cheapestPriceEver?: {
        price: string;
        date: string;
    };
}

async function getStoreMap(): Promise<Map<string, { name: string; icon: string }>> {
    const cacheKey = "stores";
    let storeMap = cache.get<Map<string, { name: string; icon: string }>>(cacheKey);

    if (!storeMap) {
        const stores = await getStores();
        storeMap = new Map(
            stores.map((s) => [
                s.storeID,
                {
                    name: s.storeName,
                    icon: `https://www.cheapshark.com${s.images.icon}`,
                },
            ])
        );
        cache.set(cacheKey, storeMap, 24 * 60 * 60 * 1000); // Cache for 24 hours
    }

    return storeMap;
}

function transformIGDBGame(game: IGDBGame): GameDetails {
    const developers: string[] = [];
    const publishers: string[] = [];

    game.involved_companies?.forEach((ic) => {
        if (ic.developer) developers.push(ic.company.name);
        if (ic.publisher) publishers.push(ic.company.name);
    });

    return {
        id: game.id,
        name: game.name,
        slug: game.slug,
        summary: game.summary,
        storyline: game.storyline,
        rating: game.rating,
        ratingCount: game.rating_count,
        aggregatedRating: game.aggregated_rating,
        aggregatedRatingCount: game.aggregated_rating_count,
        totalRating: game.total_rating,
        totalRatingCount: game.total_rating_count,
        releaseDate: game.first_release_date
            ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
            : undefined,
        coverUrl: game.cover?.image_id
            ? getImageUrl(game.cover.image_id, "cover_big")
            : undefined,
        screenshots: game.screenshots?.map((s) =>
            getImageUrl(s.image_id, "screenshot_big")
        ),
        platforms: game.platforms,
        genres: game.genres,
        developers: developers.length > 0 ? developers : undefined,
        publishers: publishers.length > 0 ? publishers : undefined,
        websites: game.websites?.map((w) => ({
            url: w.url,
            category: WEBSITE_CATEGORIES[w.category as keyof typeof WEBSITE_CATEGORIES] || "other",
        })),
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
        return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const cacheKey = createCacheKey("game", gameId);
    const cachedResult = cache.get<GameDetails>(cacheKey);

    if (cachedResult) {
        return NextResponse.json({
            game: cachedResult,
            cached: true,
        });
    }

    try {
        // Fetch game from IGDB
        const igdbGame = await getGameById(gameId);

        if (!igdbGame) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const gameDetails = transformIGDBGame(igdbGame);

        // Try to find deals from CheapShark
        try {
            const cheapSharkGames = await searchGames(igdbGame.name);

            if (cheapSharkGames.length > 0) {
                // Find the best match by name
                const normalizedName = igdbGame.name.toLowerCase().replace(/[^a-z0-9]/g, "");
                const matchedGame = cheapSharkGames.find(
                    (g) => g.external.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedName
                ) || cheapSharkGames[0];

                const [details, storeMap] = await Promise.all([
                    getGameDetails(matchedGame.gameID),
                    getStoreMap(),
                ]);

                gameDetails.deals = details.deals
                    .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                    .map((deal) => {
                        const store = storeMap.get(deal.storeID);
                        return {
                            storeName: store?.name || `Store ${deal.storeID}`,
                            storeIcon: store?.icon,
                            price: deal.price,
                            retailPrice: deal.retailPrice,
                            savings: deal.savings,
                            dealUrl: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
                        };
                    });

                gameDetails.cheapestPriceEver = {
                    price: details.cheapestPriceEver.price,
                    date: new Date(details.cheapestPriceEver.date * 1000)
                        .toISOString()
                        .split("T")[0],
                };
            }
        } catch (error) {
            // CheapShark failed, but we still have IGDB data
            console.warn("CheapShark lookup failed:", error);
        }

        // Cache for 10 minutes
        cache.set(cacheKey, gameDetails, 10 * 60 * 1000);

        return NextResponse.json({
            game: gameDetails,
            cached: false,
        });
    } catch (error) {
        console.error("Game details error:", error);

        if (error instanceof Error && error.message.includes("TWITCH_CLIENT")) {
            return NextResponse.json(
                {
                    error: "IGDB API not configured. Please set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET.",
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch game details" },
            { status: 500 }
        );
    }
}
