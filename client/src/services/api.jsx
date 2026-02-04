import axios from 'axios'
export const fetchItems = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await axios.get(`${API_URL}/items`);
    return res.data;
}