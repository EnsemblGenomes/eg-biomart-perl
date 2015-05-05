
// Taxon selector modified from EG BLAST selector

$(document).ready(function() {

	if($('.js_panel').length) {

		$('#taxontree').click(function() {
			$('#modal_panel').toggle();
		});
	
		$('.modal_close').click(function() {
			$('#modal_panel').toggle();
		});

		panel = $('.js_panel')[0];
		panel.tree   = $('.taxon_selector_tree .vscroll_container', panel.el);
		panel.list   = $('.taxon_selector_list .vscroll_container', panel.el);
		panel.finder = $('.finder input', panel.el);
	
		// Functions
		panel.getSelectedItems = function(preserveOrder) {
			var selectedNodes = this.tree.dynatree("getTree").getSelectedNodes()
			var items = $.map(selectedNodes, function(node){
				  return node.data.isFolder ? null : {key: node.data.key, title: node.data.title};
				});
			if (!preserveOrder) {
			  items.sort(function (a, b) {return a.title.toLowerCase().localeCompare(b.title.toLowerCase())});
			}
			return items;
		}
		panel.filterArray = function(array, term) {
			term = term.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
			var matches = $.grep( array, function(value) {
				return matcher.test( value.replace(/[^a-zA-Z0-9 ]/g, '') );
			});
			matches.sort(function(a, b) {
				// give priority to matches that begin with the term
				var aBegins = a.toUpperCase().substr(0, term.length) == term;
				var bBegins = b.toUpperCase().substr(0, term.length) == term;
				if (aBegins == bBegins) {
					if (a == b) return 0;
					return a < b ? -1 : 1;
				}
				return aBegins ? -1 : 1;
			});
			return matches;   
		}
		panel.locateNode = function(key) {
			var node = this.tree.dynatree("getTree").getNodeByKey(key);
			if (node) {
				node.activate();
				node.li.scrollIntoView();
			}
		}
		panel.setSelection = function() {
			var panel = this;
			var items = panel.getSelectedItems();
			$('li', panel.list).remove();
			$("[id$=__filter\\.species_id_1010]").find('option').removeAttr('selected');
			$.each(items, function(index, item){
				var li = $('<li><span>' + item.title + '</span><span class="remove"></span></li>').appendTo(panel.list);
				$('.remove', li).click(function(){panel.removeListItem($(this).parent())});
				var bioproj = item.key.split('_')[2];
				$("[id$=__filter\\.species_id_1010] option[value=" + bioproj + "]").prop('selected', true);
			});
			$("[id$=__filtercollection\\.species]").change();  // Trigger the onChange event to update the BioMart
		}
		panel.removeListItem = function(li) {
			var panel = this;
			var title = li.text();
			var selectedNodes = panel.tree.dynatree("getTree").getSelectedNodes();	
			$.each(selectedNodes, function(index, node) {
				if (node.data.title == title) {
					node.toggleSelect();
					$(li).remove();
					return;
				}
			});
			$("[id$=__filtercollection\\.species]").change(); // Trigger the onChange event to update the BioMart
		}
	
	
		// Main body
		$.getScript('/biomart/mview/js/taxon_tree_data.js', function() {
			panel.tree.dynatree({
				children: taxonTreeData,
				checkbox: true,
				selectMode: 3,
				activeVisible: true,
				onSelect: function() { panel.setSelection() },
				onDblClick: function(node, event) { node.toggleSelect() },
				onKeydown: function(node, event) {
					if( event.which == 32 ) {
						node.toggleSelect();
						return false;
					}
				}
			});
			var treeObj = panel.tree.dynatree("getTree");
			if (panel.defaultKeys && panel.defaultKeys.length > 0) {
				// set selected nodes      
				$.each(panel.defaultKeys, function(index, key) { 
					var node = treeObj.getNodeByKey(key);
					if (node) {
						node.select();      // tick it
						node.makeVisible(); // force parent path to be expanded
				  }
				});
			}
			var selected = panel.getSelectedItems(true);
			if (selected.length) {
				panel.locateNode(selected[0].key);
				panel.setSelection();
			} else if (panel.entryNode) {
				panel.locateNode(panel.entryNode);
			}
		
			// get autocomplete data from tree
			var acTitles = [];
			var acKeys = [];
			panel.tree.dynatree("getRoot").visit(function(node){
			  acTitles.push(node.data.title);
			  acKeys[node.data.title] = node.data.key;
			});
	
			var finder = panel.finder;
			finder.autocomplete({
			  minLength: 3,
			  source: function(request, response) { response(panel.filterArray(acTitles, request.term)) }, 
			  select: function(event, ui) { panel.locateNode(acKeys[ui.item.value]) },
			  open: function(event, ui) { $('.ui-menu').css('z-index', 999999999 + 1) } // force menu above modal
			}).focus(function(){ 
			  // add placeholder text
			  if($(this).val() == $(this).attr('title')) {
				finder.val('');
				finder.removeClass('inactive');
			  } else if($(this).val() != '')  {
				finder.autocomplete('search');
			  }
			}).blur(function(){
			  // remove placeholder text
			  finder.removeClass('invalid');
			  finder.addClass('inactive');
			  finder.val($(this).attr('title'));
			}).keyup(function(){
			  // highlight invalid search strings
			  if (finder.val().length >= 3) {
				var matches = panel.filterArray(acTitles, finder.val());
			  if (matches && matches.length) {
				finder.removeClass('invalid');
			  } else {
				finder.addClass('invalid');
			  }
			  } else {
			   finder.removeClass('invalid');
			  }
			}).data("ui-autocomplete")._renderItem = function (ul, item) {
			  // highlight the term within each match
			  var regex = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi");
			  item.label = item.label.replace(regex, "<strong>$1</strong>");
			  return $("<li></li>").data("ui-autocomplete-item", item).append("<a>" + item.label + "</a>").appendTo(ul);
			};
	
		});	

		// Update the species count label
                $("[id$=__filtercollection\\.species]").change(function() {
                  var count = $("[id$=__filtercollection\\.species] :selected").length;
                  var descriptor = count == 1 ? 'genome' : 'genomes';
                  count = count == 0 ? 'No' : count;
		  $('#speciesCount').html(count + ' ' + descriptor + ' selected');
                });
	
	}

});
 
 
 
