async function getEvents() {
    const city = document.getElementById('city').value;

    // Verwende den cors-anywhere Proxy mit deinem API-Key
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `https://de.ra.co/events/de/${city}`;
    
    const headers = {
        'X-Requested-With': 'XMLHttpRequest',  // Header, der den Proxy-Server anzeigt
        'Authorization': 'Bearer dein-api-key-hier' // Setze deinen API-Key hier ein
    };
    
    const response = await fetch(proxyUrl + targetUrl, { headers });

    if (!response.ok) {
        document.getElementById('events').innerHTML = 'Fehler beim Abrufen der Daten!';
        return;
    }

    const data = await response.json();

    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = ''; // Leere das Container vor der Anzeige

    data.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.date}</p>
            <p>${event.location}</p>
        `;
        eventsContainer.appendChild(eventDiv);
    });
}
