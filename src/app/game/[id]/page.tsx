import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Deal {
    storeName: string;
    storeIcon?: string;
    price: string;
    retailPrice: string;
    savings: string;
    dealUrl: string;
}

interface GameDetails {
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
    deals?: Deal[];
    cheapestPriceEver?: {
        price: string;
        date: string;
    };
}

function getRatingClass(rating: number): string {
    if (rating >= 85) return "rating-excellent";
    if (rating >= 70) return "rating-good";
    if (rating >= 50) return "rating-average";
    if (rating >= 30) return "rating-poor";
    return "rating-bad";
}

function getRatingLabel(rating: number): string {
    if (rating >= 85) return "Excelente";
    if (rating >= 70) return "Bueno";
    if (rating >= 50) return "Regular";
    if (rating >= 30) return "Malo";
    return "Muy Malo";
}

async function getGame(id: string): Promise<GameDetails | null> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
        const response = await fetch(`${baseUrl}/api/games/${id}`, {
            next: { revalidate: 600 }, // Cache for 10 minutes
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.game;
    } catch {
        return null;
    }
}

export default async function GamePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const game = await getGame(id);

    if (!game) {
        notFound();
    }

    const mainRating = game.totalRating || game.aggregatedRating || game.rating;

    return (
        <main className="min-h-screen pb-20">
            {/* Back Button */}
            <div className="px-6 py-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Volver a búsqueda
                </Link>
            </div>

            {/* Hero Section */}
            <header className="px-6 pb-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cover Image */}
                        <div className="flex-shrink-0">
                            <div className="relative w-64 aspect-[3/4] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-2xl">
                                {game.coverUrl ? (
                                    <Image
                                        src={game.coverUrl}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]">
                                        <svg
                                            className="w-16 h-16"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1zm-1 10H4V8h16v8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {game.name}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-[var(--muted)]">
                                {game.releaseDate && (
                                    <span>
                                        📅 {new Date(game.releaseDate).toLocaleDateString("es-ES")}
                                    </span>
                                )}
                                {game.developers && game.developers.length > 0 && (
                                    <span>🎮 {game.developers.join(", ")}</span>
                                )}
                                {game.publishers && game.publishers.length > 0 && (
                                    <span>📦 {game.publishers.join(", ")}</span>
                                )}
                            </div>

                            {/* Rating */}
                            {mainRating && (
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className={`text-5xl font-bold ${getRatingClass(mainRating)}`}
                                    >
                                        {Math.round(mainRating)}
                                    </div>
                                    <div>
                                        <div
                                            className={`text-lg font-semibold ${getRatingClass(mainRating)}`}
                                        >
                                            {getRatingLabel(mainRating)}
                                        </div>
                                        <div className="text-sm text-[var(--muted)]">
                                            {game.totalRatingCount || game.aggregatedRatingCount || game.ratingCount || 0} valoraciones
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Platforms */}
                            {game.platforms && game.platforms.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[var(--muted)] mb-2">
                                        Plataformas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {game.platforms.map((platform) => (
                                            <span key={platform.id} className="platform-badge">
                                                {platform.abbreviation || platform.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Genres */}
                            {game.genres && game.genres.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[var(--muted)] mb-2">
                                        Géneros
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {game.genres.map((genre) => (
                                            <span key={genre.name} className="genre-pill">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Left Column - Description & Screenshots */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Summary */}
                        {game.summary && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    {game.summary}
                                </p>
                            </section>
                        )}

                        {/* Storyline */}
                        {game.storyline && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Historia</h2>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    {game.storyline}
                                </p>
                            </section>
                        )}

                        {/* Screenshots */}
                        {game.screenshots && game.screenshots.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Capturas</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {game.screenshots.slice(0, 4).map((screenshot, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-video rounded-lg overflow-hidden bg-[var(--card-bg)]"
                                        >
                                            <Image
                                                src={screenshot}
                                                alt={`${game.name} screenshot ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Prices */}
                    <div className="space-y-6">
                        {/* Best Price */}
                        {game.deals && game.deals.length > 0 && (
                            <section className="game-card p-6">
                                <h2 className="text-lg font-semibold mb-4">Mejores Precios</h2>

                                {game.cheapestPriceEver && (
                                    <div className="mb-4 p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                                        <div className="text-sm text-[var(--muted)]">
                                            Precio más bajo histórico
                                        </div>
                                        <div className="text-xl font-bold text-[var(--accent)]">
                                            ${game.cheapestPriceEver.price}
                                        </div>
                                        <div className="text-xs text-[var(--muted)]">
                                            {new Date(game.cheapestPriceEver.date).toLocaleDateString("es-ES")}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {game.deals.slice(0, 5).map((deal, index) => (
                                        <a
                                            key={index}
                                            href={deal.dealUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--card-hover)] hover:bg-[var(--border)] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {deal.storeIcon && (
                                                    <Image
                                                        src={deal.storeIcon}
                                                        alt={deal.storeName}
                                                        width={24}
                                                        height={24}
                                                        className="rounded"
                                                        unoptimized
                                                    />
                                                )}
                                                <span className="font-medium">{deal.storeName}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-[var(--success)]">
                                                    ${deal.price}
                                                </div>
                                                {parseFloat(deal.savings) > 0 && (
                                                    <div className="text-xs text-[var(--muted)] line-through">
                                                        ${deal.retailPrice}
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* External Links */}
                        {game.websites && game.websites.length > 0 && (
                            <section className="game-card p-6">
                                <h2 className="text-lg font-semibold mb-4">Enlaces</h2>
                                <div className="space-y-2">
                                    {game.websites
                                        .filter((w) =>
                                            ["official", "steam", "epicgames", "gog", "wikipedia"].includes(
                                                w.category
                                            )
                                        )
                                        .slice(0, 5)
                                        .map((website, index) => (
                                            <a
                                                key={index}
                                                href={website.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[var(--accent)] hover:underline"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                                {website.category.charAt(0).toUpperCase() +
                                                    website.category.slice(1)}
                                            </a>
                                        ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
