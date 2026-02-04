export const items = [
    {
        id: "1",
        title: "MacBook Pro",
        startingPrice: 100000,
        currentBid: 100000,
        highestBidderId: null,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        auctionEndTime: Date.now() + 4*30 *30* 1000 // 30 seconds
    },
    {
        id: "2",
        title: "iphone 14 Pro Max",
        startingPrice: 75000,
        currentBid: 75000,
        highestBidderId: null,
        imageUrl: "https://images.unsplash.com/photo-1679014539437-b925a3f95da3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGlwaG9uZSUyMDE0fGVufDB8MHwwfHx8MA%3D%3D",
        auctionEndTime: Date.now() + 1 * 60 * 60 * 1000
    },
    {
        id: "3",
        title: "iphone 15 Pro Max",
        startingPrice: 85000,
        currentBid: 85000,
        highestBidderId: null,
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D",
        auctionEndTime: Date.now() + 2 * 60 * 60 * 1000
    },
    {
        id: "4",
        title: "Samsung S22 Ultra",
        startingPrice: 80000,
        currentBid: 80000,
        highestBidderId: null,
        imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
        auctionEndTime: Date.now() + 3.5 * 60 * 60 * 1000 // 3.5 hours
    },
]