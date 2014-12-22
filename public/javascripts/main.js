(function($){
	function startYoutube(query, callback){
		$.ajax({
			url : "/songs/" + query
		}).done(function(result) {
			for(var tab in result){
				$('#' + tab).empty();
				result[tab].map(function(item){
					$('#' + tab).append('<div class = "col-xs-3 youtubeSelection" id=' + item.id + '><img alt="..." height="75px" width="100%" src=' + item.image + '></div>');
				});
			}
			show('#youtubeOptions');
			$('#prompt').html('<h3>Please choose a version:</h3>');
			callback && callback();
		});

	}

	$("#songsList").on("click", ".recommendationSelection", function() {
		startYoutube($(this).text());
		$(".recommendationSelection").removeClass('active');
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		return false;
	});

	function startYouframe(id){
		if (!$('#youframe').length) {
			show('#youtubeFrame');
			hide('#prompt');
			$('#youtubeFrame').html('<iframe id="youframe" type="text/html"></iframe>');
		}
		$('#youframe').attr('src', "http://www.youtube.com/embed/" + id + "?autoplay=1&amp;controls=0&amp;showinfo=0&amp;autohide=1&amp;loop=0&amp;rel=0&amp;iv_load_policy=3;wmode=transparent&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;html5=1&amp;");
	}

	$(document).on('click', ".youtubeSelection", function() {
		startYouframe($(this).attr('id'));
		return false;
	});

	$('#searchform').submit(function() {
		var query = $('#searchform :input').val();
		startYoutube(query);
		return false;
	});

	$(document).ready(function(){
		if(window.song !== undefined && window.song !== ""){
			startYoutube(window.song, function(){
				startYouframe($('.youtubeSelection').first().attr('id'));
			});
		}
	});
})($);
