import { nanoid } from "nanoid";
import Url from "../models/linksModel.js";

async function handleShortUrl(req, res) {
    try {
        const { url: originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        const shortUrl = nanoid(8);

        await Url.create({
            originalUrl,
            shortUrl,
            clicks: 0,
        });

        return res.status(201).json({ id: shortUrl });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {handleShortUrl};