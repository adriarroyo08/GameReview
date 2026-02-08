"use client";

import { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import GameCard, { GameCardSkeleton } from "./components/GameCard";

interface GameResult {
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
  cheapestPrice?: string;
  cheapSharkGameId?: string;
}

export default function Home() {
  const [games, setGames] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/games/search?q=${encodeURIComponent(query)}&limit=20`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al buscar juegos");
      }

      const data = await response.json();
      setGames(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="relative py-20 px-6 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--accent)] to-[#6366f1] bg-clip-text text-transparent">
            GameReview
          </h1>
          <p className="text-lg text-[var(--muted)] mb-10 max-w-xl mx-auto">
            Busca cualquier videojuego, compara precios y encuentra las mejores
            ofertas en todas las plataformas.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>

      {/* Results Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && games.length > 0 && (
            <>
              <p className="text-[var(--muted)] mb-6">
                {games.length} resultado{games.length !== 1 ? "s" : ""} encontrado
                {games.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    slug={game.slug}
                    coverUrl={game.coverUrl}
                    rating={game.totalRating || game.aggregatedRating || game.rating}
                    platforms={game.platforms}
                    genres={game.genres}
                    cheapestPrice={game.cheapestPrice}
                    releaseDate={game.releaseDate}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && hasSearched && games.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--card-bg)] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-[var(--muted)]">
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[#6366f1]/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                ¡Busca tu próximo juego favorito!
              </h3>
              <p className="text-[var(--muted)] max-w-md mx-auto">
                Escribe el nombre de cualquier videojuego para ver información,
                valoraciones y los mejores precios disponibles.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
