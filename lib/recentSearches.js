var cheerio = require('cheerio');

exports.jsonFromHtml = function (html_data, callback) {
	var a, tds, text, time,
		$ = cheerio.load(html_data),
		tr = $('#static > table tr'),
		obj = {};

	tr.each(function (index, element) {
		time = cheerio.load(this)('td').first().text();
		text = cheerio.load(this)('a').text();

		if (tds != '' && a != '') {
			if (obj[text]) {
				obj[text].push(time);
			} else {
				obj[text] = [time];
			}
		}
	});

	callback(null, obj);
}
