import React from 'react';
import Image from 'next/image';
import { CheapSharkGame } from '../services/cheapshark';

interface GameCardProps {
  game: CheapSharkGame;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-200">
      <div className="relative w-full h-32 bg-gray-100 flex items-center justify-center">
        {game.thumb ? (
            <div className="relative w-full h-full">
                <Image
                  src={game.thumb}
                  alt={game.external}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-2"
                />
            </div>
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2" title={game.external}>
          {game.external}
        </h3>
        <div className="mt-auto flex justify-between items-center">
            <div className="text-sm text-gray-500">
                Best Price:
            </div>
            <div className="text-xl font-bold text-green-600">
                ${game.cheapest}
            </div>
        </div>
        <a
            href={`https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full text-center bg-blue-100 text-blue-700 py-2 rounded-md hover:bg-blue-200 transition-colors font-medium text-sm"
        >
            View Deal
        </a>
      </div>
    </div>
  );
}
