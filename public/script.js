// public/script.js

async function getTimestamp() {
    const dateInputValue = document.getElementById('dateInput').value;
    const resultElement = document.getElementById('result');

    // Clear previous results and show loading state
    resultElement.textContent = 'Loading...';

    let apiUrl = '/api/'; // Default to current time if input is empty

    if (dateInputValue.trim() !== "") {
        apiUrl += encodeURIComponent(dateInputValue); // Append input value if not empty
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json(); // The API always returns JSON

        // Display the JSON data nicely formatted
        resultElement.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error('Error fetching timestamp:', error);
        resultElement.textContent = 'Error: Could not fetch data. See console for details.';
    }
}