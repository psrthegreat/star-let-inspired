(function($){

	function hide(elem) {
		$(elem).removeClass('visible');
		$(elem).addClass('hidden');
	}

	function show(elem) {
		$(elem).removeClass('hidden');
		$(elem).addClass('visible');
	}

	function dumpPopularSongs(genre, limit, tab) {
		$.ajax({
			url : 'https://itunes.apple.com/us/rss/topsongs/limit=' + limit + '/genre=' + genre + '/xml',
			dataType : 'xml'
		}).done(function(xml) {
			$(xml).find('entry').each(function() {
				var songTitle = $(this).find('title').text();
				$(tab).append('<li class = "recommendationSelection"><a href="#">' + songTitle + '</a></li>');
			});
		}).fail(function() {
			$(tab).html("Could not get your star songlist. Please check your internet connection.");
		});
	}
	

	function searchYoutubeMultiple(song) {
		$.ajax({
			url : "/songs/" + song
		}).done(function(result) {
			for(var tab in result){
				$('#' + tab).empty();
				result[tab].map(function(item){
					$('#' + tab).append('<div class = "col-xs-3 youtubeSelection" id=' + item.id + '><img alt="..." height="75px" width="100%" src=' + item.image + '></div>');
				});
			}
		});
		show('#youtubeOptions');
	}

	function startYoutube(query){
		searchYoutubeMultiple(query);
		hide('#prompt');
	}

	$("#songsList").on("click", ".recommendationSelection", function() {
		$(".recommendationSelection").removeClass('active');
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		startYoutube($(this).text());
		return false;
	});

	$(document).on('click', ".youtubeSelection", function() {
		if (!$('#youframe').length) {
			show('#youtubeFrame');
			$('#youtubeFrame').html('<iframe id="youframe" type="text/html"></iframe>');
		}
		var link = $(this).attr('id');
		console.log(link)
		$('#youframe').attr('src', "http://www.youtube.com/embed/" + link + "?autoplay=1&amp;controls=0&amp;showinfo=0&amp;autohide=1&amp;loop=0&amp;rel=0&amp;iv_load_policy=3;wmode=transparent&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;html5=1&amp;");
		return false;
	});

	$('#searchform').submit(function() {
		var query = $('#searchform :input').val();
		startYoutube(query);
		return false;
	});
})($);
