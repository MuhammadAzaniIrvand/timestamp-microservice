// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ optionsSuccessStatus: 200 })); // Enables CORS for all routes
app.use(express.static('public')); // Serves static files from the 'public' directory

// Route for the landing page
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint for date processing
// The '?' makes the 'date' parameter optional
app.get("/api/:date?", (req, res) => {
  let dateInput = req.params.date;
  let date;

  if (!dateInput) {
    // If no date parameter is provided, use the current time
    date = new Date();
  } else {
    // Check if the input is a string of numbers (potential Unix timestamp)
    if (/^\d+$/.test(dateInput)) {
      date = new Date(parseInt(dateInput));
    } else {
      // Try to parse as a regular date string
      date = new Date(dateInput);
    }
  }

  // Check if the constructed date is valid
  if (isNaN(date.getTime())) { // or date.toString() === "Invalid Date"
    res.json({ error: "Invalid Date" });
  } else {
    // If valid, return the JSON response
    res.json({
      unix: date.getTime(),       // Unix timestamp in milliseconds (Number)
      utc: date.toUTCString()     // UTC date string (e.g., "Thu, 01 Jan 1970 00:00:00 GMT")
    });
  }
});

// Listen for requests
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
  console.log(`Access it at http://localhost:${port}`);
});