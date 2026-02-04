import { io } from 'socket.io-client';
import CONFIG from '../config';

const API_URL = CONFIG.API_URL;
export const socket = io(API_URL);