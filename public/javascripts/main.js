(function($){
	// 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script')

  tag.src = "https://www.youtube.com/iframe_api"
  var firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player
  hide('#player');
  var ready = false
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '200',
      width: '100%',
      autohide: '1',
      controls: '2',
      fs: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      autoplay: '0',
      events: {
      	'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })
	}

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
  window.onPlayerReady = function (event) {
    ready = true
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
		show('#player');	
		hide('#prompt');
		player.loadVideoById(id)
	}

	$(document).on('click', ".youtubeSelection", function() {
		console.log($(this).attr('id'));
		if(ready){
			startYouframe($(this).attr('id'));	
		}
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
				console.log($('.youtubeSelection').first().attr('id'));
				startYouframe($('.youtubeSelection').first().attr('id'));
			});
		}
	});

	  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  window.onPlayerStateChange = function (event) {
    if (event.data === 0) {
      //change()
    }
  }

  window.stopVideo = function () {
    player.stopVideo()
  }
})(window.$);
