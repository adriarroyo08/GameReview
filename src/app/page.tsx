'use client';

import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { GameGrid } from '../components/GameGrid';
import { CheapSharkGame, searchGames } from '../services/cheapshark';

export default function Home() {
  const [games, setGames] = useState<CheapSharkGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const results = await searchGames(term);
      setGames(results);
    } catch (err) {
      setError('Failed to fetch games. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">GamePrice Tracker</h1>

      <div className="w-full flex justify-center mb-10">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {hasSearched && !loading && (
        <GameGrid games={games} />
      )}

      {!hasSearched && (
        <div className="text-center text-gray-500 mt-10">
            <p className="text-xl">Search for a game to see the best deals!</p>
        </div>
      )}
    </main>
  );
}
