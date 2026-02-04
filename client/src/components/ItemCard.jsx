import { useState, useEffect } from "react";
import CountdownTimer from "./countdown";
import BidButton from "./Bidbutton";

export default function ItemCard({ item, now, userId, isLoading, setIsLoading, userName }) {
  const [flash, setFlash] = useState(false);
  const [prevBid, setPrevBid] = useState(item.currentBid);

  const isAuctionEnded = now > item.auctionEndTime;

  // Determine user status
  const isWinning = item.highestBidderId === userId;
  const isOutbid = item.highestBidderId && item.highestBidderId !== userId && prevBid !== item.currentBid && !isAuctionEnded;

  // Trigger flash animation when bid changes
  useEffect(() => {
    if (item.currentBid !== prevBid) {
      setFlash(true);
      setPrevBid(item.currentBid);
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [item.currentBid, prevBid]);

  // Get winner display name
  const getWinnerDisplay = () => {
    if (!item.highestBidderId) {
      return "No Bids";
    }

    // If current user is winning, show their name
    if (isWinning && userName) {
      return `👤 ${userName}`;
    }

    // If item has winner name stored, show it
    if (item.highestBidderName) {
      return `👤 ${item.highestBidderName}`;
    }

    // Fallback to masked socket ID
    return `User ***${item.highestBidderId.slice(-1)}`;
  };

  return (
    <div className={`relative p-4 sm:p-5 rounded-3xl shadow-lg bg-white border-2 transition-all duration-300 hover:shadow-xl ${isAuctionEnded
        ? "border-gray-300 opacity-95 saturate-50"
        : isWinning
          ? "border-green-500 ring-4 ring-green-100 shadow-green-100"
          : isOutbid
            ? "border-red-400 ring-2 ring-red-50"
            : "border-gray-200 hover:border-indigo-200"
      }`}>

      {/* Status Badges Overlay */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
        {isAuctionEnded && (
          <span className="px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-lg text-xs tracking-wider shadow-md flex items-center gap-1">
            SOLD
          </span>
        )}
        {!isAuctionEnded && isWinning && (
          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg text-xs shadow-lg animate-pulse flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            WINNING
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 group">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isAuctionEnded && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-bold text-sm">Auction Ended</p>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
        {item.title}
      </h3>

      {isAuctionEnded ? (
        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
              Final Bid
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-3">
              ${item.currentBid}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-300">
            {isWinning ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>YOU WON!</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Congratulations, {userName}! 🎉
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Winner
                </p>
                <p className="text-base font-bold text-gray-700">
                  {getWinnerDisplay()}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Current Bid & Timer */}
          <div className="flex justify-between items-end mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                Current Bid
              </p>
              <p className={`text-2xl sm:text-3xl font-bold transition-all duration-300 ${flash ? "text-green-600 scale-110 origin-left" : "text-gray-800"
                }`}>
                ${item.currentBid}
              </p>
            </div>
            <div className="text-right">
              <CountdownTimer endTime={item.auctionEndTime} now={now} />
            </div>
          </div>

          {/* Outbid Warning */}
          {!isAuctionEnded && isOutbid && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-bold text-sm">
                  YOU'VE BEEN OUTBID!
                </span>
              </div>
            </div>
          )}

          {/* Current Leader */}
          {item.highestBidderId && (
            <div className="mb-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Current Leader</p>
              <p className="text-sm font-semibold text-gray-700">
                {getWinnerDisplay()}
              </p>
            </div>
          )}

          {/* Bid Button */}
          <div>
            <BidButton
              item={item}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              userName={userName}
            />
          </div>
        </>
      )}
    </div>
  );
}