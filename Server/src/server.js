import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import http from 'http';
import { Server } from 'socket.io';
import expressApp from './app.js';
import registerBidsocket from './socket/bid.scocket.js';
const app = http.createServer(expressApp);
const port = process.env.PORT;
const io = new Server(app, {
    cors: {
        origin: '*'
    }
});
registerBidsocket(io);
app.listen(port, () => {
    console.log(`Server listen at PORT ${port}`)
})