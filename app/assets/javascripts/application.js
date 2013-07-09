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
//= require bootstrap-tooltip
//= require_tree .


$(document).ready(function(){

/*dynamic "viewport" */	
	/* width */
	var window_w = $(window).width();
	var viewportwidth = window_w - 220;
	$('.viewport').css('width',viewportwidth);
	
	/* height */
	var window_h = $(window).height();
	var viewportheight = window_h - 100;
	$('.viewport').css('height',viewportheight);

	// whenever window resizes
	$(window).resize(function () {
		/* width */
		var window_w = $(window).width();
		var viewportwidth = window_w - 220;
		$('.viewport').css('width',viewportwidth);
		
		/* height */
		var window_h = $(window).height();
		var viewportheight = window_h - 100;
		$('.viewport').css('height',viewportheight);
	});

	// horizontal scroll with mousewheel
	$('.viewport').mousewheel(function(e, delta) {
	    this.scrollLeft -= (delta * 30); // TODO: 30 needs to be a user pref setting
		e.preventDefault();
	});


/* tooltip */
$('.toptip').tooltip({placement: 'top', delay: { show: 1500, hide: 100 }});
$('.righttip').tooltip({placement: 'right', delay: { show: 1500, hide: 100 }});
$('.bottomtip').tooltip({placement: 'bottom', delay: { show: 1500, hide: 100 }});
$('.lefttip').tooltip({placement: 'left', delay: { show: 1500, hide: 100 }});

/* Staging Column */
$('.action-add-staging').click(function(){
	// finish code to add staging column with ord = 0
	var plotid = $('#plot-title').attr('data-plot');
	var ord = 0;
	var req = '';
	req = req + 'col[ord]='+ord;
	req = req + '&col[plot_id]='+plotid;
	req = req + '&col[title]=Staging';
	$.post('/cols.json',req,function(resp){
		console.log(resp);
		window.location.reload();
	});
});

/* Column Functions */
	$('.col[data-ord=1] .col-ctrl .col-move-left').hide();

	/* Column Add/Update */
	$(document).on('click','.col-add',function(){
		var col = $(this).closest('.col').attr('data-col');
		var newcol = col + 1;
		var ord = $(this).closest('.col').attr('data-ord');
		//console.log('ord: '+ord);
		var neword = ord + 1;
		var plotid = $('#plot-title').attr('data-plot');

		var req = '';
		req = req + 'col[ord]='+neword;
		req = req + '&col[plot_id]='+plotid;
		req = req + '&col[title]=Column Title';
		$.get('/cols/new',req,function(resp){
			if(ord==0){
				$('.cols .col:first-child').before(resp);
				console.log('ord was 0 so I am loading this before');
			}else{
				$('.col[data-ord='+ord+']').after(resp);
				console.log('ord was not 0 so I am loading this after');
			}
			//console.log(resp);
		});
		$.post('/cols.json',req,function(resp){
			if(ord==0){
				$('.cols .col:first-child').attr('data-col',resp.id);
				$('.cols .col:first-child').find('.col-title textarea').html(resp.title);
				$('.cols .col:first-child').attr('data-ord',resp.ord);
			}else{
				$('.col[data-col='+col+']').next().attr('data-col',resp.id);
				$('.col[data-col='+col+']').next().find('.col-title textarea').html(resp.title);
				$('.col[data-col='+col+']').next().attr('data-ord',resp.ord);
			}
			updateColSortOrder('.cols');
		});
		return false;
	});

// col delete
	$(document).on('click','.col-del',function(){
		var card_del_obj = this;
		smoke.confirm('Delete this column? Are you sure? Any cards will be moved to staging so you don\'t lose any ideas.',function(e){
			if(e){
				var col = $(card_del_obj).closest('.col');
				var colid = $(col).attr('data-col');
				$.post('/cols/'+colid,'_method=delete',function(){
					col.closest('.col').remove();
				});
				var cardcount = $(col).find('.cards').children('.card').length;
				if(cardcount > 0){

				}
			}
		},{cancel: 'Keep it',ok: 'Delete it'});
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

	/* column move left */
	$(document).on('click','.col-move-left',function(){
		var colid = $(this).closest('.col').attr('data-col');
		console.log('colid: '+colid);
		var colobj = $('.col[data-col='+colid+']');
		var prevcol = $('.col[data-col='+colid+']').prev();
		console.log('prev: '+prevcol.attr('data-col'));
		$(prevcol).before(colobj);
		updateColSortOrder('.cols');
		$('.col .col-ctrl .col-move-left').each(function(){
			$(this).show();
		});
		$('.col[data-ord=1] .col-ctrl .col-move-left').hide();
	});

	/* column move right */
	$(document).on('click','.col-move-right',function(){
		var colid = $(this).closest('.col').attr('data-col');
		console.log('colid: '+colid);
		var colobj = $('.col[data-col='+colid+']');
		var nextcol = $('.col[data-col='+colid+']').next();
		console.log('prev: '+nextcol.attr('data-col'));
		$(nextcol).after(colobj);
		updateColSortOrder('.cols');
		$('.col .col-ctrl .col-move-left').each(function(){
			$(this).show();
		});
		$('.col[data-ord=1] .col-ctrl .col-move-left').hide();
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
	      	updateCardSortOrder(sortparent);

	      	// update source col ords
	      	var oldcol = $('.card[data-card='+cardid+']').attr('data-thiscol');
	      	console.log(oldcol);
	      	updateCardSortOrder('.col[data-col='+oldcol+'] .cards');
			$('.card[data-card='+cardid+']').attr('data-thiscol',col);
	      }
	});
	$( ".cards" ).disableSelection();

	function updateColSortOrder(parent){
		var ord = 1;
		$(parent).children('.col').each(function(){
			colid = $(this).attr('data-col');
			req = '';
			req = req + 'col[ord]='+ord;
			req = req + '&_method=put';
			$(this).attr('data-ord',ord);
			//console.log('sortingord: '+ord);
			$.post('/cols/'+colid,req);
			ord = ord + 1;
		});
	}

	function updateCardSortOrder(parent){
		var ord = 0;
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
		smoke.confirm('Delete this card? Are you sure?',function(e){
			if(e){
				var card = $(this).closest('.card');
				var cardid = $(this).closest('.card').attr('data-card');
				//console.log(cardid);
				$.post('/cards/'+cardid,'_method=delete',function(){
					card.closest('.card').remove();
				});
			}
		},{cancel: 'Keep it',ok: 'Delete it'});
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