(function($){

	function hide(elem) {
		$(elem).removeClass('visible');
		$(elem).addClass('hidden');
	}

	function show(elem) {
		$(elem).removeClass('hidden');
		$(elem).addClass('visible');
	}
	
	function startYoutube(query){
		$.ajax({
			url : "/songs/" + query
		}).done(function(result) {
			for(var tab in result){
				$('#' + tab).empty();
				result[tab].map(function(item){
					$('#' + tab).append('<div class = "col-xs-3 youtubeSelection" id=' + item.id + '><img alt="..." height="75px" width="100%" src=' + item.image + '></div>');
				});
			}
		});
		show('#youtubeOptions');
		hide('#prompt');
	}

	$("#songsList").on("click", ".recommendationSelection", function() {
		startYoutube($(this).text());
		$(".recommendationSelection").removeClass('active');
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		return false;
	});

	$(document).on('click', ".youtubeSelection", function() {
		if (!$('#youframe').length) {
			show('#youtubeFrame');
			$('#youtubeFrame').html('<iframe id="youframe" type="text/html"></iframe>');
		}
		var link = $(this).attr('id');
		$('#youframe').attr('src', "http://www.youtube.com/embed/" + link + "?autoplay=1&amp;controls=0&amp;showinfo=0&amp;autohide=1&amp;loop=0&amp;rel=0&amp;iv_load_policy=3;wmode=transparent&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;html5=1&amp;");
		return false;
	});

	$('#searchform').submit(function() {
		var query = $('#searchform :input').val();
		startYoutube(query);
		return false;
	});
})($);
