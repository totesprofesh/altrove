var url = require('url');
var trove_search = require('../lib/trove_search');


exports.get_random_pictures = function (req, res, next) {
	var query = url.parse(req.url, true).query;

	var args = {
		key: process.env.TROVE_KEY,
		'l-availability': 'y/f',
		'l-format': 'Photograph',
		zone: 'picture'
	};

	var count = parseInt(query.count);
	count = (!count || count < 1) ? 10 : Math.min(count, 100);

	var fixed_works = [];

	trove_search.get_random_works(args, count, function (err, obj) {
		if (err) return next(err);

		var works = obj.response.zone[0].records.work;
		var ids;

		works.forEach(function (work) {
			ids = work.identifier;
			if (ids && ids.length > 1 && ids[1].linktype == 'thumbnail') {
				fixed_works.push({
					i: ids[1].value,
					l: work.troveUrl,
				});
			}
		});

		res.send({
			image: fixed_works
		});
		return next();
	});
};
