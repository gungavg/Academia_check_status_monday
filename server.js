import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.get("/resolve", async (req, res) => {
    try {
        const { url } = req.query;

        let currentUrl = url;
        let itemId = null;

        for (let i = 0; i < 5; i++) {
            const response = await fetch(currentUrl, {
                method: "GET",
                redirect: "manual",
            });

            const location = response.headers.get("location");
            if (!location) break;

            console.log("Redirect:", location);

            // 🔍 item_id
            let match = location.match(/item_id=(\d+)/);
            if (match) {
                itemId = match[1];
                break;
            }

            // 🔍 /items/
            match = location.match(/\/items\/(\d+)/);
            if (match) {
                itemId = match[1];
                break;
            }

            // 🔥 🔥 🔥 ESTE ES EL IMPORTANTE
            match = location.match(/\/pulses\/(\d+)/);
            if (match) {
                itemId = match[1];
                break;
            }

            currentUrl = location;
        }

        res.json({
            itemId,
            finalUrl: currentUrl,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Backend corriendo en http://localhost:3000");
});
