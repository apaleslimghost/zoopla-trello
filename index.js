var Trello = require('trello');
var zooplaScraper = require('zoopla-detail-scraper');

var getStaticMapUrl = (lat, lon, apiKey) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&markers=${lat},${lon}&size=640x640&scale=2&zoom=15&key=${apiKey}`;

var getGoogleMapsUrl = (addr, lat, lon) => `https://www.google.com/maps/place/${encodeURIComponent(addr)}/@${lat},${lon},15z`

module.exports = function(property, options) {
	var trello = new Trello(options.applicationKey, options.userToken);

	return zooplaScraper(property)
	.then(details => trello.addCard(
			details.address,
			`# ${details.price}
## [${details.blurb}](${zooplaScraper.toZooplaUrl(property)})

${details.description}

### Location
[![${details.address}](${getStaticMapUrl(details.location.lat, details.location.lon, options.googleMapsKey)})](${getGoogleMapsUrl(details.address, details.location.lat, details.location.lon)})

### Floorplan
![Floorplan](${details.floorplan})

`,
			options.listId
		).then(card => Promise.all(
			details.images
			.filter(image => !!image)
			.map(image => trello.addAttachmentToCard(card.id, image))
		).then(() => card))
	);
}
