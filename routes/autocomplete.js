var url = require('url');
var elasticsearch = require('elasticsearch');
var elastiq = require('../lib/elastiq');
var client = new elasticsearch.Client({
    host: process.env.ES_HOST,
    log: process.env.ES_LOG || 'trace',
    apiVersion: '0.90'
});

module.exports = autocomplete = function autocomplete (req, res, next) {
	var query = url.parse(req.url, true).query.query;

  elastiq.search(client, {
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    query: query
  }, function (err, data) {
    if (err) return next(err);
		res.send(data);
		return next();
  });
};
