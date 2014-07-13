var restify = require('restify');
var querystring = require('querystring');

var trove_api = 'http://api.trove.nla.gov.au/';
var trove_client = restify.createJsonClient({url: trove_api});

exports.url = trove_api + 'result?';


function get_trove_url (args, n, s) {
	if (!s) s = 1;

	args['encoding'] = 'json';
	args['n'] = n;
	args['q'] = ' ';
	args['s'] = s;

	var args_str = querystring.stringify(args);
	return exports.url + args_str;
}


function get_work_count (args, callback) {
	var trove_req_str = get_trove_url(args, 1);

	trove_client.get(trove_req_str, function (err, req, res, obj) {
		if (err) return callback(err);

		callback(null, obj.response.zone[0].records.total);
	});
};


exports.get_random_works = function (args, count, callback) {
	get_work_count(args, function (err, total) {
		if (err) return callback(err);

		var start = parseInt(Math.random() * (total - count));
		var trove_req_str = get_trove_url(args, count, start);

		trove_client.get(trove_req_str, function (err, req, res, obj) {
			if (err) return callback(err);

			callback(null, obj);
		});
	});
};
