const express = require("express");
const exphbs = require("hbs");
const QRCode = require("qrcode");
const path = require("path");

const app = express();

// Set Handlebars as the template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware to extract subdomain and main domain dynamically
app.use((req, res, next) => {
    let host = req.hostname;
    let parts = host.split(".");
    
    if (parts.length > 2) { // Ensuring it's a subdomain
        req.subdomain = parts[0]; // First part is the subdomain
        req.mainDomain = parts.slice(1).join("."); // Remaining is the main domain
    } else {
        req.subdomain = null;
        req.mainDomain = host; // Fallback to full hostname
    }
    
    next();
});

// Route to generate QR code
app.get("/", async (req, res) => {
    if (req.subdomain) {
        const url = `https://${req.subdomain}.${req.mainDomain}`;
        const qrCode = await QRCode.toDataURL(url);
        res.render("index", { subdomain: req.subdomain, mainDomain: req.mainDomain, qrCode });
    } else {
        res.render("index", { subdomain: null, mainDomain: req.mainDomain, qrCode: null });
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
