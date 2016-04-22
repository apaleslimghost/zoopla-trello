var Trello = require('trello');
var zooplaScraper = require('zoopla-detail-scraper');

module.exports = function(property, options) {
	var trello = new Trello(options.applicationKey, options.userToken);

	return zooplaScraper(property)
	.then(details => trello.addCard(
			details.address,
			'#' + details.price + '\n##' + details.blurb + '\n\n' + details.description + '\n\n' + zooplaScraper.toZooplaUrl(property),
			options.listId
		).then(card => Promise.all(
			details.images
			.concat([details.floorplan])
			.filter(image => !!image)
			.map(image => trello.addAttachmentToCard(card.id, image))
		).then(() => card))
	);
}
