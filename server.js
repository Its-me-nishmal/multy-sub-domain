const express = require("express");
const exphbs = require("hbs");
const QRCode = require("qrcode");
const path = require("path");

const app = express();

// Set Handlebars as the template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware to extract subdomain
app.use((req, res, next) => {
    let host = req.hostname;
    let subdomain = host.split(".")[0]; // Extract subdomain
    req.subdomain = subdomain !== "yourdomain" ? subdomain : null; // Ignore main domain
    next();
});

// Route to generate QR code
app.get("/", async (req, res) => {
    if (req.subdomain) {
        const url = `https://${req.subdomain}.yourdomain.com`;
        const qrCode = await QRCode.toDataURL(url);
        res.render("index", { subdomain: req.subdomain, qrCode });
    } else {
        res.render("index", { subdomain: null, qrCode: null });
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
