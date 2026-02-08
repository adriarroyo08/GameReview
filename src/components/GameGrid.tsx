import React from 'react';
import { CheapSharkGame } from '../services/cheapshark';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: CheapSharkGame[];
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No games found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
      {games.map((game) => (
        <GameCard key={game.gameID} game={game} />
      ))}
    </div>
  );
}
