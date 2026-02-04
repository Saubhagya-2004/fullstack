# 🎯 Live Bidding Platform - Backend

A production-ready real-time auction platform backend built with Node.js, Socket.io, MongoDB, and Redis.

## 🏗️ Architecture

### Tech Stack
- **Node.js** + **Express.js** - REST API server
- **Socket.io** - Real-time bidding communication
- **MongoDB** + **Mongoose** - Persistent data storage
- **Redis** - Race condition handling & distributed locking
- **Docker** + **Docker Compose** - Containerization

### Key Features
✅ **Race Condition Protection** - Redis distributed locks + MongoDB optimistic locking  
✅ **Real-Time Updates** - Instant bid broadcasting to all connected clients  
✅ **Server Time Sync** - Prevents client-side timer manipulation  
✅ **Background Jobs** - Automatic auction expiration detection  
✅ **Production Ready** - Docker containerization with health checks  

---

## 📁 Project Structure

```
Server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis client setup
│   ├── models/
│   │   ├── Item.js            # Auction item schema
│   │   └── Bid.js             # Bid history schema
│   ├── services/
│   │   └── biddingService.js  # Core bidding logic with race condition handling
│   ├── controllers/
│   │   └── itemController.js  # REST API controllers
│   ├── routes/
│   │   └── itemRoutes.js      # API route definitions
│   ├── socket/
│   │   └── socketHandler.js   # Socket.io event handlers
│   ├── jobs/
│   │   └── auctionScheduler.js # Background auction expiration checker
│   ├── utils/
│   │   └── seedData.js        # Database seeding utility
│   └── server.js              # Main application entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── Dockerfile                 # Docker build configuration
└── package.json
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Install Docker & Docker Compose**

2. **Clone and navigate to project**
   ```bash
   cd e:/fullstack
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Seed the database**
   ```bash
   docker exec -it auction_backend npm run seed
   ```

5. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

6. **Access the API**
   - REST API: `http://localhost:3000/api`
   - Socket.io: `ws://localhost:3000`
   - Health Check: `http://localhost:3000/health`

### Option 2: Local Development

1. **Install MongoDB and Redis locally**

2. **Update `.env` file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/auction_db
   REDIS_HOST=localhost
   ```

3. **Install dependencies**
   ```bash
   cd Server
   npm install
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all auction items |
| GET | `/api/items/active` | Get only active auctions |
| GET | `/api/items/:id` | Get single item by ID |
| GET | `/api/server-time` | Get server timestamp for sync |
| GET | `/health` | Health check |

**Example Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "title": "Vintage Rolex Submariner Watch",
      "currentBid": 5000,
      "highestBidder": "user123",
      "auctionEndTime": "2026-02-03T18:30:00Z",
      "status": "active"
    }
  ]
}
```

---

## 💬 Socket.io Events

### Client → Server

#### `BID_PLACED`
```javascript
socket.emit('BID_PLACED', {
  itemId: '65abc123...',
  userId: 'user123',
  bidAmount: 5100
});
```

#### `GET_BID_HISTORY`
```javascript
socket.emit('GET_BID_HISTORY', {
  itemId: '65abc123...'
});
```

### Server → Client

#### `UPDATE_BID` (Broadcast to all)
```javascript
socket.on('UPDATE_BID', (data) => {
  // data: { itemId, newBid, highestBidder, serverTime }
});
```

#### `BID_REJECTED` (To specific user)
```javascript
socket.on('BID_REJECTED', (data) => {
  // data: { itemId, error, reason, currentBid, minimumBid }
});
```

#### `AUCTION_ENDED` (Broadcast to all)
```javascript
socket.on('AUCTION_ENDED', (data) => {
  // data: { itemId, finalBid, winner, endTime, serverTime }
});
```

#### `SERVER_TIME` (Periodic sync)
```javascript
socket.on('SERVER_TIME', (data) => {
  // data: { serverTime }
});
```

---

## 🔐 Race Condition Solution

### The Problem
When two users bid $100 at the exact same millisecond, only ONE should succeed.

### The Solution
**Dual Locking Mechanism:**

1. **Redis Distributed Lock**
   - Acquires exclusive lock using `SET NX EX`
   - Prevents concurrent bid processing for same item
   - Auto-expires after 5 seconds

2. **MongoDB Optimistic Locking**
   - Uses `__v` version field
   - Ensures database state hasn't changed
   - Catches race conditions that slip through

**Flow:**
```
User A bids $100 → Redis Lock Acquired ✅
User B bids $100 → Redis Lock Failed ❌ (instant rejection)

User A's bid → Validated → MongoDB Update (version check) ✅
                        → Broadcast UPDATE_BID to all clients
                        → Release Redis lock
```

---

## 🕒 Server Time Synchronization

Prevents clients from manipulating countdown timers:

1. Client fetches `/api/server-time` on load
2. Calculates offset: `clientOffset = serverTime - Date.now()`
3. All countdowns use: `serverTime = Date.now() + clientOffset`
4. Periodic `SERVER_TIME` events keep clients in sync

---

## 🗄️ Database Models

### Item Schema
```javascript
{
  title: String,
  description: String,
  startingPrice: Number,
  currentBid: Number,
  highestBidder: String,
  auctionStartTime: Date,
  auctionEndTime: Date,
  status: 'active' | 'ended',
  imageUrl: String,
  __v: Number  // Optimistic locking version
}
```

### Bid Schema (Audit Trail)
```javascript
{
  itemId: ObjectId,
  userId: String,
  bidAmount: Number,
  timestamp: Date,
  status: 'accepted' | 'rejected',
  rejectionReason: String
}
```

---

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/auction_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Auction Settings
MIN_BID_INCREMENT=10
AUCTION_CHECK_INTERVAL=10000
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Seed database
docker exec -it auction_backend npm run seed

# Restart backend only
docker-compose restart backend

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

---

## 🧪 Testing Race Conditions

1. **Open multiple browser tabs**
2. **Connect Socket.io clients**
3. **Place simultaneous bids on same item**
4. **Expected behavior:**
   - Only ONE bid succeeds
   - Others receive instant `BID_REJECTED`
   - All clients see real-time `UPDATE_BID`

---

## 📊 Sample Auction Items

The seed script creates 6 sample auctions:
- Vintage Rolex Submariner Watch ($5,000)
- Limited Edition Nike Air Jordan 1 ($300)
- PlayStation 5 Console Bundle ($500)
- Original Abstract Painting ($800)
- iPhone 15 Pro Max 1TB ($1,000)
- MacBook Pro M3 Max 16-inch ($2,500)

---

## 🛠️ Production Deployment

1. **Set `NODE_ENV=production`**
2. **Use production Dockerfile target:**
   ```yaml
   build:
     target: production
   ```
3. **Configure MongoDB Atlas** (cloud database)
4. **Use Redis Cloud** or **AWS ElastiCache**
5. **Add authentication middleware**
6. **Enable HTTPS/WSS**
7. **Set up monitoring (PM2, New Relic, etc.)**

---

## 📝 Next Steps

- [ ] Add user authentication (JWT)
- [ ] Implement payment processing
- [ ] Add email notifications for auction end
- [ ] Create admin dashboard
- [ ] Add bid history UI
- [ ] Implement bid retraction rules
- [ ] Add image upload for auction items

---

## 🤝 Support

For issues or questions, check the logs:
```bash
docker-compose logs backend
```

---

**Built with ❤️ for production-grade real-time applications**
