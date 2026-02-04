import { useEffect } from "react";
import { socket } from "../services/socket";
export const useSocket = (onupdate, onerror) => {
    useEffect(() => {
        socket.on('UPDATE_BID', onupdate);
        socket.on('BID_REJECTED', onerror);
        return () => {
            socket.off('UPDATE_BID', onupdate);
            socket.off('BID_REJECTED', onerror);
        }
    }, [onupdate, onerror])
}