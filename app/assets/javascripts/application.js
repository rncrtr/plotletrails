// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


$(document).ready(function(){
/* Column Functions */
	$('.col-add').click(function(){
		var col = parseInt($(this).closest('.col').attr('data-col')) + 1;
		var plotid = $('#plot-title').attr('data-plot');
		var req = '';
		req = req + 'col[ord]='+col;
		req = req + '&col[plot_id]='+plotid;
		req = req + '&col[title]=Column '+col;
		$.get('/cols/new',req,function(resp){
			$('.cols').append(resp);
			console.log(resp);
		});
		$.post('/cols.json',req,function(resp){
			//$('.cols').append(resp);
			console.log(resp);
			// need to add code to inject data
		});
		return false;
	});

	$(document).on('keyup','.col-title textarea',function(){
		var thiscol = $(this).closest('.col');
		var coltitle = $(this).val();
		var col = $(this).closest('.col').attr('data-col');
		var req = '';
		req = req + 'col[title]='+coltitle;
		if(coltitle.length > 1){
			delay(function(){
				if(thiscol.attr('data-col')){
					// update
					req = req + '&_method=put';
					$.post('/cols/'+thiscol.attr('data-col'),req);
				}
			}, 3000 );
		}
	});

/* Card Functions */

	// cards jq-ui sortable
	$( ".cards" ).sortable({
	      connectWith: ".cards",
	      handle: ".card-move",
	      stop: function( event, ui ) {
	      	var cardid = ui.item.context.dataset.card;
	      	//console.log('card: '+cardid);
	      	var col = $('.card[data-card='+cardid+']').closest('.col').attr('data-col');
	      	//console.log('col: '+col);
	      	var ord = $('.cards .card').index($('.card[data-card='+cardid+']'));
	      	//console.log('ord: '+ord);
	      	var req = '';
	      	// update card that moved
	      	req = req + 'card[id]='+cardid;
	      	req = req + '&card[col_id]='+col;
	      	req = req + '&_method=put';
	      	$.post('/cards/'+cardid,req);

	      	// update all target ords
	      	var sortparent = $('.card[data-card='+cardid+']').closest('.cards');
	      	var ord = 0;
	      	updateCardSortOrder(sortparent,ord);

	      	// update source col ords
	      	var oldcol = $('.card[data-card='+cardid+']').attr('data-thiscol');
	      	console.log(oldcol);
	      	var ord = 0;
	      	updateCardSortOrder('.col[data-col='+oldcol+'] .cards',ord);
			$('.card[data-card='+cardid+']').attr('data-thiscol',col);
	      }
	});
	$( ".cards" ).disableSelection();

	function updateCardSortOrder(parent,ord){
		$(parent).children('.card').each(function(){
			cardid = $(this).attr('data-card');
			req = '';
			req = req + 'card[ord]='+ord;
			req = req + '&_method=put';
			//console.log(ord);
			$.post('/cards/'+cardid,req);
			ord = ord + 1;
		});
	}

	// delay function
	var delay = (function(){
	  var timer = 0;
	  return function(callback, ms){
	    clearTimeout (timer);
	    timer = setTimeout(callback, ms);
	  };
	})();

	// add a card
	$('.action-add-card').click(function(){
		var col = $(this).closest('.col').attr('data-col');
		var req = '';
		req = req + 'col='+col;
		$.get('/cards/new',req,function(resp){
			$('.col[data-col='+col+'] .cards').append(resp);
		});
		return false;
	});

	// delete card
	$('.action-delete-card').click(function(){
		var card = $(this).closest('.card');
		var cardid = $(this).closest('.card').attr('data-card');
		console.log(cardid);
		$.post('/cards/'+cardid,'_method=delete',function(){
			card.closest('.card').remove();
		});
		return false;
	});

	// save card (rails create/update)
	$(document).on('keyup','.card-text',function(){
		var thiscard = $(this).closest('.card');
		var cardtext = $(this).children('textarea').val();
		var col = $(this).closest('.col').attr('data-col');
		var req = '';
		req = req + '&card[text]='+cardtext;
		if(cardtext.length > 1){
			delay(function(){
				if(thiscard.attr('data-card')){
					// update
					req = req + '&_method=put';
					$.post('/cards/'+thiscard.attr('data-card'),req);
				}else{
					// defaults
					req = req + '&card[col_id]='+col;
					req = req + '&card[color_id]=0';
					req = req + '&card[ord]=0';
					// initial add
					$.post('/cards.json',req,function(resp){
						thiscard.attr('data-card',resp.id);
						col = thiscard.closest('.col').attr('data-col');
						thiscard.attr('data-thiscol',col);
					});
				}
			}, 3000 );
		}
	});

	$('.card-text').on( 'keyup', 'textarea', function (){
	    $(this).height( 0 );
	    $(this).height( this.scrollHeight );
	});
	$('.card-text').find( 'textarea' ).keyup();

	$('.col-title').on( 'keyup', 'textarea', function (){
	    $(this).height( 0 );
	    $(this).height( this.scrollHeight );
	});
	$('.col-title').find( 'textarea' ).keyup();

function html2md(content){
	content = content.replace(/<br>/g,'\r\n');
	content = content.replace(/\<b\>(.*?)\<\/b\>/g, '**$1**');
	content = content.replace(/\<strong\>(.*?)\<\/strong\>/g, '**$1**');
	content = content.replace(/\<em\>(.*?)\<\/em\>/g, '*$1*');
	return content;
}

function md2html(content){
	content = content.replace(/\n\r?/g, '<br>');
	content = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
	content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
	return content;
}

});