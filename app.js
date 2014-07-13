var http = require('http');
var fetchr = require('./lib/fetchr');
var searches = require('./lib/recentSearches');

var PouchDB = require('pouchdb');
var db = new PouchDB(process.env.COUCHDB || 'recent-searches');

fetchr.fetchEvery('http://trove.nla.gov.au/recentSearches', 5000, function (err, html) {
  if (err) return console.error(err);
  searches.jsonFromHtml(html, function (err, json) {
    var timeStamp = new Date();
    db.put({
       _id: timeStamp.toISOString(),
       searches: json
    });
  });
});

var restify = require('restify');
var socketio = require('socket.io');
var server = restify.createServer();
var io = socketio.listen(server);
var routes = require('./routes');

server.use(restify.gzipResponse());

server.get('/random/pictures.json', routes.pictures.get_random_pictures);
server.get('/autocomplete', routes.autocomplete);
server.get(/.*/, restify.serveStatic({
  directory: './static',
  default: 'index.html'
}));

io.sockets.on('connection', function (socket) {
  socket.emit('id', socket.client.id);
  socket.on('search', function (query) {
    io.sockets.emit('search', query);
  });
});

server.listen(process.env.PORT, function start_server() {
	console.log('%s listening at %s', server.name, server.url);
});
