import { getItemsController } from "../controllers/items.controller.js";
import express from "express";
const router = express.Router();

router.get("/", getItemsController);

export default router;