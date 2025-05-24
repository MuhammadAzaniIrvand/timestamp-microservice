// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    const submitBtn = document.getElementById('submitBtn');
    const responseArea = document.getElementById('responseArea').querySelector('code');

    const fetchTimestamp = async () => {
        const inputValue = dateInput.value.trim();
        // Construct the API URL. If input is empty, just '/api/'. Otherwise, '/api/<inputValue>'
        const apiUrl = `/api/${inputValue ? encodeURIComponent(inputValue) : ''}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                // If server returns an error status, try to parse error JSON or throw generic error
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            responseArea.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Fetch error:', error);
            responseArea.textContent = JSON.stringify({ error: error.message }, null, 2);
        }
    };

    submitBtn.addEventListener('click', fetchTimestamp);

    // Optional: Allow pressing Enter in the input field to submit
    dateInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it were in a form
            fetchTimestamp();
        }
    });

    // Initial load with current time (optional, but good for demo)
    // Or just leave it empty like: responseArea.textContent = '{}';
    (async () => {
        const initialUrl = '/api/'; // Fetch current time on load
        try {
            const response = await fetch(initialUrl);
            const data = await response.json();
            // For initial load, maybe don't show it, or show a placeholder
            // responseArea.textContent = JSON.stringify(data, null, 2); 
            // Or just keep it as {} initially
        } catch (error) {
            console.error('Initial fetch error:', error);
            // responseArea.textContent = JSON.stringify({ error: "Could not fetch initial time" }, null, 2);
        }
    })();
});