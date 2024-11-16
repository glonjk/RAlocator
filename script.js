// Funktion zum Berechnen der Entfernung zwischen zwei geographischen Punkten
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

// Beispiel: RA.co hat keine echte API, also holen wir uns die Veranstaltungen von der Webseite
fetch('https://de.ra.co/events/de/berlin')
  .then(response => response.text())
  .then(html => {
    // HTML-Inhalt der Seite analysieren (wird normalerweise mit einem HTML-Parser durchgeführt)
    // Da RA keine offizielle API hat, müssen wir den HTML-Inhalt parsen und extrahieren.
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extrahieren der Veranstaltungseinträge
    const events = Array.from(doc.querySelectorAll('.event-item')).map(item => {
      const name = item.querySelector('h3').innerText;
      const venue = item.querySelector('.venue').innerText;
      const lat = parseFloat(item.getAttribute('data-latitude'));
      const lon = parseFloat(item.getAttribute('data-longitude'));

      return { name, venue, lat, lon };
    });

    // Beliebte Veranstaltungen (die ersten 4)
    const popularEvents = events.slice(0, 4);
    const allEvents = events.slice(4);

    // Veranstaltungen in die HTML-Elemente einfügen
    const popularList = document.getElementById('popular-events-list');
    const allList = document.getElementById('all-events-list');

    popularEvents.forEach(event => {
      const li = document.createElement('li');
      li.classList.add('event-item');
      li.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.venue}</p>
        <p>Entfernung: ${calculateDistance(originLat, originLon, event.lat, event.lon).toFixed(2)} km</p>
      `;
      popularList.appendChild(li);
    });

    allEvents.forEach(event => {
      const li = document.createElement('li');
      li.classList.add('event-item');
      li.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.venue}</p>
        <p>Entfernung: ${calculateDistance(originLat, originLon, event.lat, event.lon).toFixed(2)} km</p>
      `;
      allList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Fehler beim Abrufen der Veranstaltungen:', error);
  });
