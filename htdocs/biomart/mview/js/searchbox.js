/***********************************************************************
**                                                                    **
**  This Javascript module alters the search box to have a graphical  **
**  drop down akin to the Firefox drop down on server load            **
**                                                                    **
**    Global variables: ENSEMBL_SEARCH_BOX - Flag to make sure that   **
**                      we only populate the drop down box once!!     **
**                                                                    **
**    Public functions: remove_search_index(code);                    **
**                      add_search_index(code,label);                 **
**                                                                    **
***********************************************************************/

  var ENSEMBL_SEARCH_BOX = 0;



   var site_action_lookup = new Hash();
   //  site_action_lookup.set('ensembl_genomes_search' ,'/search');
//   site_action_lookup.set('ensembl_genomes_search','//protists.ensembl.org/common/psychic?site=ensemblgenomes;q=');
   //   site_action_lookup.set('ensembl_genomes_search', '//protists.ensembl.org/Plasmodium_falciparum/psychic?site=ensemblgenomes');
   site_action_lookup.set('ensembl_bacteria_search' ,'//bacteria.ensembl.org/Escherichia_shigella/Escherichia_coli_K12/psychic?species=all');
   //site_action_lookup.set('ensembl_metazoa_search'  ,'//metazoa.ensembl.org/common/psychic?site=ensemblunit;x=10;y=11');
   site_action_lookup.set('ensembl_protists_search','//protists.ensembl.org/common/psychic');
   site_action_lookup.set('ensembl_fungi_search','//fungi.ensembl.org/common/psychic');
   site_action_lookup.set('ensembl_plants_search','//plants.ensembl.org/common/psychic');
   site_action_lookup.set('ensembl_metazoa_search'  ,'//metazoa.ensembl.org/common/psychic');
   site_action_lookup.set('ensembl_all','//www.ensembl.org/common/psychic');
   site_action_lookup.set('ebi','//protists.ensembl.org/common/psychic?site=ebi');



  function remove_search_index(code) {
    /** Remove a search index entry from the drop down box (if it exists)

    PUBLIC - e.g. remove_search_index( 'ebi' );
     **/
    var n = $('se_'+code);
    if(n) n.parentNode.removeChild(n);
  }

function add_search_index(code,label) {
    /** Add a search index entry to the drop down box
     
     Public - e.g. add_search_index( 'vega', 'Vega search' );
     
     Notes:
     
     * The image "/i/search/{code}/.gif" should exist in the
     web-tree as a 16x16 gif
     **/
    
    if(!$('se_mn')) return;   // Sanity check can't add to what doesn't exist!
    if($('se_'+code)) return; // Don't open up another search box with this link!
    var n = Builder.node( 'dt', { id: 'se_'+code }, [
			      Builder.node( 'img', { src: '/biomart/mview/images/search/'+code+'.gif', alt: '' } ),
			      label
			  ]);
    $('se_mn').appendChild( n );
    // Add an onclick event to the "fake" drop down box
    Event.observe(n, 'click', function(event) {
		      var el = Event.element(event);
		      if(el.tagName!='DT') el = el.up('DT');
		      var name = el.id.substr(3);                 // id is "se_{name}"
		      
		      $('se_im').src  = '/biomart/mview/images/search/'+name+'.gif';
		      $('se_mn').hide();

	              if (name.match(/ebi/)) { 
				$('se_si').value = 'ebi'
			}
			else{		      
			$('se_si').value = 'ensemblunit';
		      Cookie.set( 'ENSEMBL_SEARCH','ensemblunit' );
}


		      $('se_but').up('form').action = site_action_lookup.get(name);
		      var genomic_unit;


		     // if (genomic_unit = ( /_(\w+)_/.exec(name)[1])) {
	//		        if (genomic_unit != 'undefined' )	{		
	//		  $('search_target').value = genomic_unit;
	//		  }
			  
	//	      }
		      //	console.log( $('se_but').up('form').action) ;
		      
		  });
}

function __init_ensembl_web_search() {
 	Cookie.unset( 'ENSEMBL_SEARCH');
      $('search_target').value = 'all';

      var form =   $('se_but').up('form');

//       Event.observe(form, 'submit', function(event){
// 		      if (!form.action.match(/\w+/)){
// 			alert( 'Please select a genomic unit to search' );
// 			var box  = $('se');
// 			var menu = $('se_mn');
// 			Position.clone(box,menu,{setWidth:false,offsetTop:box.getHeight()-4});
// 			menu.toggle();
// 			event.stop();
// 		      }

// 		    });



/** Initialize the search box... make it a "graphical" drop down and add
    entries for Ensembl, EBI and Sanger

    PRIVATE - should only be executed once on page load
**/

    if( ENSEMBL_SEARCH_BOX==1 ) return; // Only execute once
    ENSEMBL_SEARCH_BOX = 1;

    if($('se_but')){                    // Only if search box exists...
      $('se').parentNode.appendChild(
        Builder.node( 'dl', {id: 'se_mn', style: 'display:none' } )
      );
      Event.observe($('se_but'),'click',function(event){
        var box  = $('se');
        var menu = $('se_mn');
        Position.clone(box,menu,{setWidth:false,offsetTop:box.getHeight()-4});


        menu.toggle();
      });

      Event.observe($('se_b'),'click',function(event){
			var name =       $('se_si').value ;
//			var genomic_unit = ( /_(\w+)_/.exec(name)[1]);
//			console.log(genomic_unit);

		    })



      // Create the search list!
      add_search_index( 'ensembl_all',     'Ensembl search all species'     );
//      add_search_index( 'ensembl_genomes_search', 'EnsemblGenomes search' );
      add_search_index( SEARCH_BOX_TYPE, 'Ensembl ' + BIOMART_SPECIES +  ' search' );   
      add_search_index( 'ebi',     'EBI search'     );


      // add_search_index( 'ensembl_bacteria_search', 'Ensembl search Bacteria' );
      // add_search_index( 'ensembl_fungi_search', 'Ensembl search Fungi' );
      // add_search_index( 'ensembl_plants_search', 'Ensembl search Plants' );
      // add_search_index( 'ensembl_metazoa_search',  'Ensembl search Metazoa' );



    }

}


addLoadEvent( __init_ensembl_web_search );

