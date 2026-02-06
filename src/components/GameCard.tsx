import { CheapSharkGame } from "../services/cheapshark";
import Image from "next/image";

interface GameCardProps {
  game: CheapSharkGame;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-900">
        {game.thumb && (
          <Image
            src={game.thumb}
            alt={game.external}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate" title={game.external}>
          {game.external}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cheapest:
          </span>
          <span className="text-green-600 font-bold">
            ${game.cheapest}
          </span>
        </div>
        <a
          href={`https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-center w-full py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
        >
          View Deal
        </a>
      </div>
    </div>
  );
}
