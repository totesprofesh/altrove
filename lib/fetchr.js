var http = require('http');

// fetchr.js
// --------

// fetchResource is a simple `http.get` abstraction
// takes a String as resource input and returns a standard
// node callback `callback(err, data)`.
var fetchResource = function fetchResurce(resource, callback) {
  http.get(resource, function(res) {
    var data = '';

    res.on('error', function(err) {
      return callback(err);
    });
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      return callback(null, data);
    });
  });
};

// fetchEvery is a recursive function that wraps fetchResource in a setTimeout.
// The only differnece is the addition of a timeout argument,
// this determins in Milliseconds how often to revisit a resource.
var fetchEvery = function fetchEvery(resource, timeout, callback) {
  // FIXME: Figure out how setTimeout works...
  // this annon function is upsetting.
  setTimeout(function () {
    fetchResource(resource, function(err, data) {
      if (err) return callback(err);
      callback(null, data);
      return fetchEvery(resource, timeout, callback);
    });
  }, timeout);
};

exports.fetchResource = fetchResource;
exports.fetchEvery = fetchEvery;
