import http from 'http';
import {Server} from 'socket.io';
import app from './app.js';
import registerBidsocket from './socket/bid.scocket.js';
const server = http.createServer(app);
const port = 3000;
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});
registerBidsocket(io);
server.listen(port,()=>{
    console.log(`Server listen at PORT ${port}`)
})