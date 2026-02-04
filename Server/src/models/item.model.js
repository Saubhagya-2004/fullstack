import { items } from "../data/item.js";
export const getItems = () => items;

export const getItemById = (id) =>
  items.find(item => item.id === id);