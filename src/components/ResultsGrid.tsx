import { CheapSharkGame } from "../services/cheapshark";
import { GameCard } from "./GameCard";

interface ResultsGridProps {
  games: CheapSharkGame[];
  isLoading?: boolean;
}

export function ResultsGrid({ games, isLoading }: ResultsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No games found. Try searching for something else.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {games.map((game) => (
        <GameCard key={game.gameID} game={game} />
      ))}
    </div>
  );
}
