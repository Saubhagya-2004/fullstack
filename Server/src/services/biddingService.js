import { getItemById, getItems } from "../models/item.model.js";
import { mutex as Mutex } from "../utils/mutex.js";
const mutex = new Mutex();

export const placeBid = async ({ itemId, bidAmount, userId }) => {
  await mutex.acquire();

  try {
    const item = getItemById(itemId);
    const now = Date.now();

    if (!item) {
      return { success: false, message: "Item not found" };
    }

    if (now > item.auctionEndTime) {
      return { success: false, message: "Auction ended" };
    }

    if (bidAmount <= item.currentBid) {
      return { success: false, message: "Bid too low" };
    }

    item.currentBid = bidAmount;
    item.highestBidderId = userId;

    return { success: true, item };
  } finally {
    mutex.release();
  }
};

export const resetAuctions = async () => {
  await mutex.acquire();
  try {
    const items = getItems();
    items.forEach(item => {
      item.currentBid = item.startingPrice;
      item.highestBidderId = null;
      item.highestBidderName = null;
      item.auctionEndTime = Date.now() + 5 * 60 * 1000; // Reset to 5 mins
    });
    return { success: true, items };
  } finally {
    mutex.release();
  }
};