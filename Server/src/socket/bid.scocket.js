import { placeBid, resetAuctions } from "../services/biddingService.js";

export default function registerBidSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("BID_PLACED", async (data) => {
      const result = await placeBid({
        ...data,
        userId: socket.id
      });

      if (!result.success) {
        socket.emit("BID_REJECTED", {
          error: result.message,
          itemId: data.itemId
        });
        return;
      }

      // broadcast updated bid to all clients
      io.emit("UPDATE_BID", {
        itemId: result.item.id,
        newBid: result.item.currentBid,
        highestBidderId: result.item.highestBidderId,
        highestBidderName: result.item.highestBidderName
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}