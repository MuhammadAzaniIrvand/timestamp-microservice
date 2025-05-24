// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to process the date input and create the response object
const createTimestampResponse = (dateInput) => {
  let date;

  if (!dateInput) {
    // No date provided, use current time
    date = new Date();
  } else {
    // Check if input is a number (potential Unix timestamp in milliseconds)
    if (/^\d+$/.test(dateInput)) {
      date = new Date(parseInt(dateInput, 10)); // Added radix 10 for parseInt
    } else {
      // Try to parse as a date string
      date = new Date(dateInput);
    }
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return { error: "Invalid Date" };
  } else {
    return {
      unix: date.getTime(),
      utc: date.toUTCString()
    };
  }
};

// API endpoint for requests to /api/ (handles current time)
app.get('/api', (req, res) => { // Handles requests like localhost:3000/api or localhost:3000/api/
  const responseObject = createTimestampResponse(null); // Pass null to indicate current time
  res.json(responseObject);
});
// Note: some setups might require '/api/' to specifically match the trailing slash
// but Express is generally good at handling this. If you have issues, try app.get('/api/', ...)

// API endpoint for requests with a date parameter (e.g., /api/2015-12-25)
app.get('/api/:date_string', (req, res) => {
  const dateString = req.params.date_string;
  const responseObject = createTimestampResponse(dateString);
  res.json(responseObject);
});


// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Access the app at http://localhost:${port}`);
});