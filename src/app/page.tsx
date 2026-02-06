"use client";

import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { ResultsGrid } from "../components/ResultsGrid";
import { CheapSharkGame } from "../services/cheapshark";

export default function Home() {
  const [games, setGames] = useState<CheapSharkGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    // Phase 4 will connect this to the real API.
    // For now, we simulate a search or show empty state.
    console.log("Searching for:", query);

    // Simulate delay
    setTimeout(() => {
        setGames([]);
        setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          GamePrice Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find the best deals for your favorite games across multiple stores.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {hasSearched && (
        <ResultsGrid games={games} isLoading={isLoading} />
      )}
    </main>
  );
}
