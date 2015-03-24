
// Ontology autocomplete using OLS

$(document).ready(function() {
	$("<style type='text/css'> .ui-autocomplete-loading{ background:url('/biomart/mview/images/jquery-ui-loading.gif') no-repeat right center }</style>").appendTo('head');
	$("textarea[name$='filter\\.go_parent_term']").attr('placeholder', 'Enter one or more accession numbers (e.g. GO:0050789)');
	$("input[name$='filter\\.go_parent_name']").attr('placeholder', 'Start typing description to lookup GO term...')
		.css('width', '300px')
		.autocomplete({
		source: function(request, response) {
			var endPoint;
			var requestData;
			if(request.term.length == 10 && request.term.substring(0,3) == 'GO:') {
				endPoint = 'getTermById';
				requestData = {
					termId: request.term,
					ontologyName: "GO",
				}; 
			} else {
				endPoint = 'getTermsByName';
				requestData = {
                                        partialName: request.term,
                                        ontologyName: "GO",
                                        reverseKeyOrder: "true",
                                };
			}
			$.soap({
				url: "http://www.ebi.ac.uk/ontology-lookup/services/OntologyQuery?wsdl",
				method: endPoint,
				appendMethodToURL: false,
				data: requestData,
				success: function(responseRaw) {
					//console.log(responseRaw.toString());
					var responseXML = responseRaw.toXML();
					if(endPoint == 'getTermsByName') {
						var data = $('item', responseXML).map(function() {
							var displayVal = $('key', this).text() + ' [' + $('value', this).text() + ']';
							return {
								value: displayVal,
								id: $('key', this).text(),
							};
						}).get();
					} else {
						var data = $('getTermByIdResponse', responseXML).map(function() {
							return {
								value: $('ns1\\:getTermByIdReturn', this).text() + ' [' + request.term + ']',
								id: $('ns1\\:getTermByIdReturn', this).text(),
							};
						}).get();;
					}
					response(data);
				},
				error: function(data) {
					//console.log(data);
				},
			});
		},
		minLength: 3,
		select: function(event, ui) {
			var box = $("input[name$='filter\\.go_parent_name']");
			box.val(ui.item.id);
			$("input[name$='filtercollection\\.go_filters_name']").prop('checked', true);
			return false;
		},
	});

});


