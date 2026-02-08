"use client";

import Link from "next/link";
import Image from "next/image";

interface GameCardProps {
    id: number;
    name: string;
    slug: string;
    coverUrl?: string;
    rating?: number;
    platforms?: { name: string; abbreviation?: string }[];
    genres?: { name: string }[];
    cheapestPrice?: string;
    releaseDate?: string;
}

function getRatingClass(rating: number): string {
    if (rating >= 85) return "rating-excellent";
    if (rating >= 70) return "rating-good";
    if (rating >= 50) return "rating-average";
    if (rating >= 30) return "rating-poor";
    return "rating-bad";
}

export default function GameCard({
    id,
    name,
    slug,
    coverUrl,
    rating,
    platforms,
    genres,
    cheapestPrice,
    releaseDate,
}: GameCardProps) {
    // Get unique platform abbreviations (max 3)
    const platformAbbreviations = platforms
        ?.slice(0, 3)
        .map((p) => p.abbreviation || p.name.substring(0, 3).toUpperCase());

    return (
        <Link href={`/game/${id}`} className="block">
            <article className="game-card overflow-hidden animate-fade-in">
                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full bg-[var(--card-hover)]">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1zm-1 10H4V8h16v8z" />
                                <path d="M8 10h2v4H8zm6 0h2v4h-2z" />
                            </svg>
                        </div>
                    )}

                    {/* Rating Badge */}
                    {rating && (
                        <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded-md text-sm font-bold bg-black/70 backdrop-blur-sm ${getRatingClass(rating)}`}
                        >
                            {Math.round(rating)}
                        </div>
                    )}

                    {/* Price Badge */}
                    {cheapestPrice && (
                        <div className="absolute bottom-2 right-2 price-tag">
                            ${cheapestPrice}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-base line-clamp-2 mb-2">{name}</h3>

                    {/* Release Date */}
                    {releaseDate && (
                        <p className="text-sm text-[var(--muted)] mb-2">
                            {new Date(releaseDate).getFullYear()}
                        </p>
                    )}

                    {/* Platforms */}
                    {platformAbbreviations && platformAbbreviations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {platformAbbreviations.map((abbr, i) => (
                                <span key={i} className="platform-badge">
                                    {abbr}
                                </span>
                            ))}
                            {platforms && platforms.length > 3 && (
                                <span className="platform-badge">+{platforms.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Genres */}
                    {genres && genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {genres.slice(0, 2).map((genre) => (
                                <span key={genre.name} className="genre-pill">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

// Skeleton loader for GameCard
export function GameCardSkeleton() {
    return (
        <div className="game-card overflow-hidden">
            <div className="aspect-[3/4] w-full skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 skeleton rounded" />
                <div className="h-4 w-1/4 skeleton rounded" />
                <div className="flex gap-1">
                    <div className="h-5 w-10 skeleton rounded" />
                    <div className="h-5 w-10 skeleton rounded" />
                </div>
            </div>
        </div>
    );
}
