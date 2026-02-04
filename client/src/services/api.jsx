import axios from 'axios';
import CONFIG from '../config';

export const fetchItems = async () => {
    const API_URL = CONFIG.API_URL;
    const res = await axios.get(`${API_URL}/items`);
    return res.data;
}