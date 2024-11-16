async function getEvents() {
    const city = document.getElementById('city').value;  // Hole den Wert der Stadt aus dem Input-Feld
    const proxyUrl = 'https://thingproxy.freeboard.io/fetch/'; // Öffentlicher CORS-Proxy
    const targetUrl = `https://de.ra.co/events/de/${city}`; // URL der Resident Advisor-Seite

    try {
        const response = await fetch(proxyUrl + targetUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest', // Wichtig für den Proxy
            }
        });

        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Veranstaltungen');
        }

        const data = await response.json(); // Daten im JSON-Format

        // Anzeige der Veranstaltungen auf der Seite
        const eventsContainer = document.getElementById('events');
        eventsContainer.innerHTML = ''; // Leere den Container vor der Anzeige neuer Events

        if (data.events && data.events.length > 0) {
            data.events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.innerHTML = `
                    <h3>${event.name}</h3>
                    <p><strong>Datum:</strong> ${event.date}</p>
                    <p><strong>Ort:</strong> ${event.location}</p>
                `;
                eventsContainer.appendChild(eventDiv);
            });
        } else {
            eventsContainer.innerHTML = '<p>Keine Veranstaltungen gefunden.</p>';
        }
    } catch (error) {
        console.error(error);
        alert('Es gab ein Problem bei der Anfrage.');
    }
}
