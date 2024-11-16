const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const geolib = require('geolib');
const app = express();

app.use(express.json());

app.post('/api/events', async (req, res) => {
    const { city, location } = req.body;
    try {
        const url = `https://ra.co/events/de/${city}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const events = [];
        $('.event-title a').each((index, element) => {
            const name = $(element).text();
            const link = $(element).attr('href');
            const address = $(element).closest('.event').find('.event-location').text();
            events.push({ name, address, link });
        });

        const geocodedEvents = await Promise.all(events.map(async (event) => {
            const coords = await geocodeAddress(event.address);
            const distance = location
                ? geolib.getDistance(location, coords) / 1000
                : null;
            return { ...event, distance };
        }));

        const sortedEvents = geocodedEvents.sort((a, b) => a.distance - b.distance);
        res.json(sortedEvents);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Daten.' });
    }
});

const geocodeAddress = async (address) => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: { address, key: apiKey },
    });
    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
};

app.listen(3000, () => console.log('Server läuft auf Port 3000'));
