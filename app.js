var http = require('http');
var fetchr = require('./lib/fetchr');
var searches = require('./lib/recentSearches');
var PouchDB = require('pouchdb');
var db = new PouchDB(process.env.COUCHDB | 'local');

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
