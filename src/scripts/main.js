var app = app || {};

$(document).ready(function(){
	'use strict';
	
	$.get('/random/pictures.json?count=100',function(data){
		app.populateBackground(data);
	},'json');

	app.searchTabs();
	app.formRangeFields();
	app.formTagFields();
	app.searchHistory();
	app.searchAutoComplete();

});

app.searchAutoComplete = function() {
	var searchForm = $('.search .primary-search-box');
	var input = searchForm.find('input[type="text"]');
	var autocompleteStage = $('.search .autocomplete');
	var localACStage = autocompleteStage.find('.local');
	var remoteACStage = autocompleteStage.find('.remote');

	input.on('keyup', function(e) {
		var str = $(this).val();

		if(str.length > 2){
			var remoteMatches = [];

			doLocalAutocomplete(str);
			doRemoteAutocomplete(str);
		} else {
			//cleanup
			autocompleteStage.find('li').remove();
			autocompleteStage.removeClass('active');
		}

	});

	function doRemoteAutocomplete(search) {
		var matches = [];

		$.get('/autocomplete?query='+search, function(data){
			remoteACStage.find('li').remove();

			if(data.results.length > 0){
				$(data.results).each(function(i, data) {
					remoteACStage.append($('<li/>').append($('<a/>').attr('href','#').text(data)));
				});
			} else {
				remoteACStage.append($('<li/>').append($('<a/>').text('No remote matches')));
			}
		}, 'json');
	}

	function doLocalAutocomplete(search) {
		var matches = [];
		var term = '';

		autocompleteStage.addClass('active');

		store.forEach(function(key, data) {
			term = queryStringToArray(data.value)['q'].split('+').join(' ');

			if(term.indexOf(search) !== -1) {
				matches.push(term);
			}
		});

		localACStage.find('li').remove();

		if(matches.length > 0){
			$(matches).each(function(i, data) {
				localACStage.append($('<li/>').append($('<a/>').attr('href','#').text(data)));
			});
		} else {
			localACStage.append($('<li/>').append($('<a/>').text('No local matches')));
		}
	}

};

app.searchHistory = function() {
	var searchForm = $('.search');
	var historyContainer = $('.history');
	var historyStage = historyContainer.find('table');

	historyContainer.find('.clear-history').on('click', function(e) {
		e.preventDefault();
		store.clear();
		historyStage.find('tr').remove();
	});

	searchForm.on('submit', function(e) {
		//@todo: Find a nicer way to store these
		store.set(parseInt(new Date().getTime()/1000, 10), {'type': 'pastsearch', 'value': $(this).serialize()});
	});

	var historyData = store.getAll();

	store.forEach(function(key, data) {
    if(data.type === 'pastsearch') {
    	var terms = queryStringToArray(data.value);

    	//@todo should probs bring in a templating thang
    	historyStage.append(
    	$('<tr />')
    	.append($('<td />')
    		.append($('<a />')
    			.attr('href', 'http://trove.nla.gov.au/result?'+data.value)
    			.text(terms.q.split('+').join(' '))
    		)
    	)
    	.append($('<td />')
    		.append($('<a />')
    			.attr('href', 'http://trove.nla.gov.au/result?'+data.value)
    			.text(terms['q-year1-date'])
    		)
    	)
    	.append($('<td />')
    		.append($('<a />')
    			.attr('href', 'http://trove.nla.gov.au/result?'+data.value)
    			.text(terms['q-year2-date'])
    		)
    	)
    	);
    }
	})
};

app.formTagFields = function() {
	var optionsElm = $('.filter-options');
	var options = [];
	var fieldName = optionsElm.attr('name');

	var filterStage = $('.available-filters');
	var addedFilterStage = $('.added-filters');


	optionsElm.find('option').each(function() {
		options.push({'label':$(this).text(), 'value':$(this).val()});
	});

	optionsElm.remove();

	$(options).each(function(i, data) {
		filterStage.append(createFilterElement(i, data));
	});

	function createFilterElement(id, data) {
		var elm = $('<a />').attr('href','#')
							.addClass('filter')
							.data({'value': data.value, 'id': id, 'activated': false})
							.text(data.label);

		elm.on('click', function(e) {
			e.preventDefault();

			if(elm.data('activated')) {
				addedFilterStage.find('input[value="'+elm.data('value')+'"]').remove();
				elm.data('activated', false);
			} else {
				addedFilterStage.append($('<input />').attr({'type': 'text', 'name': fieldName, 'value': elm.data('value')}));
				elm.data('activated', true);
			}

			elm.toggleClass('active');
		});

		return elm;
	}

};

app.formRangeFields = function() {
	$('.date-slider').noUiSlider({
		start: [1871, 1949],
		range: {
			'min': 1800,
			'max': 2020
		},
		connect: true,
		serialization: {
			lower: [
				$.Link({
					target: $("#q-year1-date")
				}),
				$.Link({
					target: $('.timeframe .from')
				})
			],
			upper: [
				$.Link({
					target: $("#q-year2-date")
				}),
				$.Link({
					target: $('.timeframe .to')
				})
			],
			format: {
				decimals: 0
			}
		}
	});
};

app.searchTabs = function() {
	'use strict';

	var tabLinks = $('.tab-nav a');
	var tabs = $('.tabs .tab');

	tabLinks.on('click', function(e) {
		e.preventDefault();

		tabs.add(tabLinks).removeClass('active');
		tabs.eq($(this).index()).add($(this)).addClass('active');
	});
}

app.populateBackground = function(data) {
	'use strict';
	
	var cardsContainer = $('.cards');
	// var cardData = data.results;
	var cardData = data.image;

	// for (var i = 0; i < cardData.length; i++) {
	// 	switch (cardData[i].ty) {
	// 		case 'image':
	// 			layoutImage(cardData[i]);
	// 			break;
	// 		case 'tag':
	// 			layoutTag(cardData[i]);
	// 			break;
	// 		case 'search':
	// 			layoutSearch(cardData[i]);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }

	// Create the containers and index list
	var indexes = [];
	var html = '';

	var body = $('body');

	for (var i = 0; i < cardData.length; i++) {
		html += '<div class="card image"></div>';
		indexes.push(i);
	}

	cardsContainer[0].innerHTML = html;

	indexes.sort(function() { return 0.5 - Math.random() });

	// Add the images/anchors
	var cards = cardsContainer.find('div');
	
	for (var i = 0; i < cardData.length; i++) {
		layoutImage(indexes[i], cardData[i]);
	}

	function layoutImage(index, data) {
		var img = $('<img />').attr('src', data.i);
		var div = cards.eq(index);

		div.append($('<a />').attr('href', data.l).append(img));

		img.one('load', function() {
			console.log('foobar');
			div.addClass('active');
		});
	}

	// var cards = cardsContainer.find('div');
	// var currentCard = cardData.length - 1;
	// var currentlyProcessing = 0;
	
	// // for (var i = 0; i < cardData.length; i++) {
	// // 	layoutImage(indexes[i], cardData[i]);
	// // }

	// // while (currentCard > 0) {
	// // 	if (currentlyProcessing <= 10){
	// // 		layoutImage(indexes[currentCard], cardData[currentCard]);
	// // 	}
	// // }

	// function layoutImage(index, data) {
	// 	var img = $('<img />').attr('src', data.i);
	// 	var div = cards.eq(index);

	// 	img.one('load', function() {
	// 		div.addClass('active');
	// 		currentCard--;
	// 		currentlyProcessing--;
	// 	});

	// 	div.append($('<a />').attr('href', data.l).append(img));
	// 	currentlyProcessing++;
	// }

	function layoutTag(data) {
		cardsContainer.append(
			$('<div/>').addClass('card tag')
				.append($('<a />').attr('href', 'http://trove.nla.gov.au/result?l-publictag='+data.s).text(data.s))
		);
	}

	function layoutSearch(data) {
		cardsContainer.append(
			$('<div/>').addClass('card recentsearch')
				.append($('<a />').attr('href', 'http://trove.nla.gov.au/result?q='+data.s).text(data.s))
		);
	}
};

function queryStringToArray(querystring) {
	//@todo: Very naieve - cant have '=' in query values
  var obj = {};
  var pair = null;
  var querystring = querystring.split('&');

  for (var i = 0; i < querystring.length; i++){
      pair = querystring[i].split('=');
      obj[pair[0]] = pair[1];
  };

  return obj;
}

$.fn.filterByData = function (prop, val) {
	var $self = this;
	if (typeof val === 'undefined') {
		return $self.filter(
			function () { return typeof $(this).data(prop) !== 'undefined'; }
		);
	}
	return $self.filter(
		function () { return $(this).data(prop) == val; }
	);
};
