document.getElementById('getLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            fetchEvents(null, { latitude, longitude });
        });
    } else {
        alert('Geolocation wird von deinem Browser nicht unterstützt.');
    }
});

document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchEvents(city, null);
    } else {
        alert('Bitte eine Stadt eingeben.');
    }
});

const fetchEvents = (city, location) => {
    fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, location }),
    })
        .then((response) => response.json())
        .then((events) => {
            const resultsList = document.getElementById('results');
            resultsList.innerHTML = '';
            events.forEach((event) => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${event.name} (${event.distance} km entfernt)`;
                resultsList.appendChild(li);
            });
        });
};
