import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import shortenUrl from "./src/routes/linksRoutes.js";
import Url from "./src/models/linksModel.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_DB_CONNECTION_STRING)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

    app.use("/shortUrl", shortenUrl);

// Routes
app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const data = await Url.findOneAndUpdate(
            { shortUrl: shortId },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!data) {
            console.log('URL not found:', shortId);
            return res.status(404).send('Short URL not found');
        }

        let redirectUrl = data.originalUrl;        

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error handling redirect:', error);
        return res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

