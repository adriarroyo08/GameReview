import { searchGames, getGameDetails, getStores } from "../src/services/cheapshark";

async function main() {
  try {
    console.log("Fetching stores...");
    const stores = await getStores();
    const storeMap = new Map(stores.map((s) => [s.storeID, s.storeName]));
    console.log(`Loaded ${stores.length} stores.`);

    const query = "Batman";
    console.log(`\nSearching for "${query}"...`);
    const games = await searchGames(query);
    console.log(`Found ${games.length} games.`);

    if (games.length === 0) {
      console.log("No games found.");
      return;
    }

    const firstGame = games[0];
    console.log(`\nSelected game: ${firstGame.external} (ID: ${firstGame.gameID})`);

    console.log("Fetching game details...");
    const details = await getGameDetails(firstGame.gameID);

    console.log(`\nTitle: ${details.info.title}`);
    console.log(`Cheapest Price Ever: $${details.cheapestPriceEver.price} on ${new Date(details.cheapestPriceEver.date * 1000).toLocaleDateString()}`);

    console.log("\nCurrent Deals:");
    // Sort by price
    const deals = details.deals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    deals.forEach((deal) => {
      const storeName = storeMap.get(deal.storeID) || `Store ${deal.storeID}`;
      console.log(`- ${storeName}: $${deal.price} (Retail: $${deal.retailPrice}) - Savings: ${parseFloat(deal.savings).toFixed(2)}%`);
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
