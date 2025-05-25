// server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.static('public')); // Serves static files from the 'public' directory
// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ optionsSuccessStatus: 200 })); // Enables CORS for all routes
app.use(express.static('public')); // Serves static files from the 'public' directory (for style.css)

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
    // Requirement 7 & 8
    date = new Date();
  } else {
    // Check if the input is a string of numbers (potential Unix timestamp)
    // Requirement 4
    if (/^\d+$/.test(dateInput)) {
      date = new Date(parseInt(dateInput));
    } else {
      // Try to parse as a regular date string
      // Requirement 5
      date = new Date(dateInput);
    }
  }

  // Check if the constructed date is valid
  // Requirement 6
  if (isNaN(date.getTime())) { // or date.toString() === "Invalid Date"
    res.json({ error: "Invalid Date" });
  } else {
    // If valid, return the JSON response
    // Requirement 2 & 3
    res.json({
      unix: date.getTime(),       // Unix timestamp in milliseconds (Number)
      utc: date.toUTCString()     // UTC date string (e.g., "Thu, 01 Jan 1970 00:00:00 GMT")
    });
  }
});
// In views/index.html or linked script.js
function submitDate() {
    const dateValue = document.getElementById('dateInput').value;
    if (dateValue) {
        window.location.href = '/api/' + encodeURIComponent(dateValue);
    } else {
        // Optionally handle empty input or redirect to /api/ for current time
        window.location.href = '/api/';
    }
}

// Listen for requests
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
  console.log(`Access it at http://localhost:${port}`);
});