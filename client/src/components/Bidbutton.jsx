import { socket } from "../services/socket";

export default function Bidbutton({ item, isLoading, setIsLoading, userName }) {
  const handlebid = () => {
    setIsLoading(item.id);
    socket.emit("BID_PLACED", {
      itemId: item.id,
      bidAmount: item.currentBid + 10,
      userName: userName
    });
  };

  const isThisItemLoading = isLoading === item.id;

  return (
    <button
      onClick={handlebid}
      disabled={isThisItemLoading}
      className={`mt-3 w-full py-2 rounded-2xl relative overflow-hidden group transition-transform duration-1000 ${isThisItemLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 cursor-pointer text-white group-hover:scale-105"
        }`}
    >
      {!isThisItemLoading && (
        <span className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl pointer-events-none" />
      )}
      <span className="relative z-10">{isThisItemLoading ? "⏳ Bidding..." : "Bid +$10"}</span>
    </button>
  );
}