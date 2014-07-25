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

	//dumpPopularSongs(14, 15, "#songsList");


	function searchYoutube(query, limit, tab) {
		$.ajax({
			url : "https://gdata.youtube.com/feeds/api/videos?q=" + query + " " + tab + "&max-results=" + limit + "&format=5&v=2",
			dataType : 'xml',
		}).done(function(xml) {
			$('#' + tab).html("");
			$(xml).find('entry').each(function() {
				var title = $(this).children('title').text();
				var artist = $(this).children('author').children('name').text();
				var imageSource = $(this).find("media\\:thumbnail, thumbnail").first().attr('url');
				var link = $(this).find("id").text();
				var videoID = link.substr(link.search('video:') + 6);
				if (artist.search(/vevo/i) == -1) {
					$('#' + tab).append('<div class = "media youtubeSelection" id=' + videoID + '><img class="pull-left media-object" data-src="holder.js/200x100" alt="200x100" src=' + imageSource + '><div class = "media-body"><p class = "yttitle">' + title + '</p><p class="ytartist">' + artist + '</p></div></div>');
				}
			});
		}).fail(function(data) {
			$('#' + tab).html("Could not get your videos. Please check your internet connection.");
		});
	}

	function searchYoutubeMultiple(song) {
		searchYoutube(song, 4, "lyrics");
		searchYoutube(song, 4, "karaoke");
		searchYoutube(song, 4, "covers");
	}

	function startYoutube(query){
		searchYoutubeMultiple(query);
		$('#youtubeFrame').html("<h3 id='choose'>Now choose a track from below:</h3>");
		show('#youtubeOptions');
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

	$(".youtube").on("click", ".youtubeSelection", function() {
		if (!$('#youframe').length) {
			show('#youtubeFrame');
			//<h3 style= "font-size: 40px; font-weight: 100;text-shadow:0 -1px 1px rgba(0,0,0,0.1);">Vocalet</h3>
			$('#youtubeFrame').html('<iframe id="youframe" type="text/html" height="300" width="100%" frameborder="0"></iframe>');
		}
		var link = $(this).attr('id');
		$('#youframe').attr('src', "http://www.youtube.com/embed/" + link + "?autoplay=1&amp;controls=0&amp;showinfo=0&amp;autohide=1&amp;loop=0&amp;rel=0&amp;iv_load_policy=3;wmode=transparent&amp;enablejsapi=1&amp;modestbranding=1&amp;html5=1&amp;");
		return false;
	});

	function useData(data) {
		for (var i = 0; i < data.length; i++) {
			var result = data[i];
			var song = result.song;
			var artist = result.artist;
			var total = song + " - " + artist;
			$('#songsList').append('<li class = "recommendationSelection"><a class = "leftopts" href="#">' + total + '</a></li>');
		}
	}

	function useData2(data) {
		for (var i = 0; i < data.length; i++) {
			var result = data[i];
			$('#songsList').append('<li class = "recommendationSelection"><a class ="leftopts" href="#">' + result + '</a></li>');
		}
	}

	$('#searchform').submit(function() {
		var query = $('#searchform :input').val();
		startYoutube(query);
		return false;
	});

	function makeRequest() {
		$.ajax({
			url : "https://itunes.apple.com/us/rss/topsongs/limit=15/xml",
			dataType : 'xml',
		}).done(function(xml) {
			var arr = [];
			$(xml).find('entry').each(function() {
				var element = {};
				element.id = $(this).find('id').attr('im:id');
				element.title = $(this).find('title').text();
				arr.push(element.title);
			});
			useData2(arr)
			return arr;
		});
	}

	var art = makeRequest();
})($);
