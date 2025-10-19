import express from "express";
import {handleShortUrl} from "../controllers/linksController.js";

const router = express.Router();

router.post("/", handleShortUrl);

export default router;