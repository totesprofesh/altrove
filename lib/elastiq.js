
// elastiq.js
// ----------

// Expose search function that takes an Elasticsearch client
// and performs a wildcard query against an input query.
var search = function search(client, opts, callback) {
  client.search({
    index: opts.index,
    type: opts.type,
    body: {
      query: {
        wildcard: {
          query: opts.query + "*"
        }
      }
    }
  }, function (err, res) {
    if (err) return callback(err);
    var results = res.hits.hits || [];
    var data = [];

    results.forEach(function(result) {
      data.push(result._source.query);
    });

    callback(null, data);
  });
};

exports.search = search;
