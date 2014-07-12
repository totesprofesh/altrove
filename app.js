var http = require('http');
var restify = require('restify');
var fetchr = require('./lib/fetchr');
var searches = require('./lib/recentSearches');
var picture_route = require('./routes/picture');
var PouchDB = require('pouchdb');
var db = new PouchDB(process.env.COUCHDB || 'local');

fetchr.fetchEvery('http://trove.nla.gov.au/recentSearches', 3000, function (err, html) {
  if (err) return console.error(err);
  searches.jsonFromHtml(html, function (err, json) {
    var timeStamp = new Date();
    db.put({
       _id: timeStamp.toISOString(),
       searches: json
    });
  });
});


var server = restify.createServer();

server.get('/random/pictures.json', picture_route.get_random_pictures);

server.listen(process.env.PORT, function start_server() {
	console.log('%s listening at %s', server.name, server.url);
});
