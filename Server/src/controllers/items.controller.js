import { getItems } from "../models/item.model.js";

export const getItemsController = (req, res) => {
  res.json({
    serverTime: Date.now(),
    items: getItems()
  });
};
