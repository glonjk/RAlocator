// Funktion zum Berechnen der Entfernung in Kilometern zwischen zwei geographischen Punkten
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Erdradius in Kilometern
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Entfernung in Kilometern

  return distance;
}

// Die feste Adresse: Sredzkistr. 2, 10435 Berlin
const originLat = 52.5377876;  // Latitude
const originLon = 13.4124408;  // Longitude

// Beispiel-URL für RA Events in Berlin (du musst die URL eventuell anpassen!)
fetch('https://www.residentadvisor.net/api/events?city=Berlin')
  .then(response => response.json())
  .then(events => {
    // Events nach Entfernung vom festen Standort sortieren
    events.sort((a, b) => {
      const distA = calculateDistance(originLat, originLon, a.venue.latitude, a.venue.longitude);
      const distB = calculateDistance(originLat, originLon, b.venue.latitude, b.venue.longitude);
      return distA - distB;  // Aufsteigend nach Entfernung sortieren
    });

    // Veranstaltungen in die Liste einfügen
    const eventList = document.getElementById('event-list');
    events.forEach(event => {
      const li = document.createElement('li');
      li.classList.add('event-item');
      li.innerHTML = `
        <h2>${event.name}</h2>
        <p>Location: ${event.venue.name}</p>
        <p>Entfernung: ${calculateDistance(originLat, originLon, event.venue.latitude, event.venue.longitude).toFixed(2)} km</p>
      `;
      eventList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Fehler beim Abrufen der Veranstaltungen:', error);
  });
