import { useEffect, useState } from "react";
import { fetchItems } from "../services/api";
import { useServerTime } from "../hooks/useServerTime";
import { useSocket } from "../hooks/useSocket";
import { socket } from "../services/socket";
import ItemCard from "../components/ItemCard.jsx";
import ToastContainer from "../components/Toast";
import LoginModal from "../components/LoginModal";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [serverTime, setServerTime] = useState(Date.now());
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(() => !localStorage.getItem("userName"));
  const [isLoading, setIsLoading] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const now = useServerTime(serverTime);

  const handleLogin = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
    setIsLoginModalOpen(false);
    addToast(`Welcome, ${name}!`, "success");
  };

  // Toast Helper
  const addToast = (message, type = "info", duration = 1200) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Socket connection management
  useEffect(() => {
    const handleConnect = () => {
      setUserId(socket.id);
      setConnectionStatus("connected");
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
      addToast("Connection lost. Attempting to reconnect...", "warning");
    };

    const handleReconnect = () => {
      setConnectionStatus("connected");
      addToast("Reconnected to auction server!", "success");
    };

    if (socket.connected) {
      setUserId(socket.id);
      setConnectionStatus("connected");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, []);

  // Fetch initial items
  useEffect(() => {
    setInitialLoading(true);
    fetchItems()
      .then(data => {
        setItems(data.items);
        setServerTime(data.serverTime);
      })
      .catch(error => {
        addToast("Failed to load auction items", "error");
        console.error(error);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, []);

  // Socket updates
  useSocket(
    (data) => {
      if (isLoading && data.itemId === isLoading && data.highestBidderId === userId) {
        setIsLoading(null);
        addToast("Bid placed successfully! You are winning ", "success");
      }

      setItems(prev => {
        return prev.map(item => {
          if (item.id === data.itemId) {
            if (
              item.highestBidderId === userId &&
              data.highestBidderId !== userId
            ) {
              addToast(`You've been outbid on "${item.title}"`, "warning");
            }
            return {
              ...item,
              currentBid: data.newBid,
              highestBidderId: data.highestBidderId
            };
          }
          return item;
        });
      });
    },
    (error) => {
      setIsLoading(null);
      addToast(error.error || error.message || "Bid rejected", "error");
    }
  );

  // Connection status indicator
  const ConnectionIndicator = () => {
    const statusConfig = {
      connected: { color: "bg-green-500", text: "Live", pulse: false, ring: "ring-green-500/20" },
      connecting: { color: "bg-yellow-500", text: "Connecting", pulse: true, ring: "ring-yellow-500/20" },
      disconnected: { color: "bg-red-500", text: "Offline", pulse: true, ring: "ring-red-500/20" }
    };

    const config = statusConfig[connectionStatus];

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm ring-1 ${config.ring}`}>
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          {config.pulse && (
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.color} animate-ping opacity-75`} />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700">{config.text}</span>
      </div>
    );
  };

  // User Profile Card Component
  const UserProfile = () => {
    const yourBids = items.filter(item => item.highestBidderId === userId).length;
    const winning = items.filter(item => item.highestBidderId === userId && now < item.endTime).length;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex justify-between items-center">
        <div className="flex items-center justify-between">
          {/* Avatar & User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {userName ? userName.slice(0, 2).toUpperCase() : (userId ? userId.slice(-2).toUpperCase() : "??")}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {userName ? `Welcome, ${userName}` : "Guest Bidder"}
              </h3>
              {userId ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-gray-900">ID: ***{userId.slice(-6)}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(userId);
                      addToast("User ID copied to clipboard", "success");
                    }}
                    className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy full ID"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Connecting...</span>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <ConnectionIndicator />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{yourBids}</div>
            <div className="text-xs text-gray-500 mt-1">Active Bids</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{items.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total Items</div>
          </div>
        </div>
      </div>
    );
  };

  // Loading skeleton
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Header skeleton */}
        <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Live Auction
                </h1>
                <p className="text-xs text-gray-500">Real-time bidding platform</p>
              </div>
            </div>

            {/* Center Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Active Items</div>
                  <div className="text-sm font-semibold text-gray-900">{items.length}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Your Wins</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {items.filter(item => item.highestBidderId === userId && now < item.endTime).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status & User Menu */}
            <div className="flex items-center gap-4">
              <ConnectionIndicator />

              {/* User Avatar Button */}
              <button className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                  {userName ? userName.slice(0, 2).toUpperCase() : (userId ? userId.slice(-2).toUpperCase() : "??")}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <UserProfile />

        {/* Items grid */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🏺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Auctions</h3>
            <p className="text-gray-500">Check back soon for new items to bid on!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                userId={userId}
                userName={userName}
                isLoading={isLoading === item.id}
                setIsLoading={setIsLoading}
                now={now}
              />
            ))}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} />}
    </div>
  );
}