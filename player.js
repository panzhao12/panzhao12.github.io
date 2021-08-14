(function () {
	var el = document.getElementById('sc-iframe'),
		widget = SC.Widget(el);
	window._total_duration = 0;
	widget.bind(SC.Widget.Events.READY, function () {
		widget.getDuration(function (duration) {
			var seconds = duration / (1000),
				minutes = Math.floor(seconds / 60);
			seconds = Math.floor(seconds % 60);
			document.getElementById('total').innerHTML = minutes + ':' + seconds;
			window._total_duration = duration;
		});
	});

	widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
		widget.getPosition(function (position) {
			var seconds = position / (1000),
				minutes = Math.floor(seconds / 60);
			seconds = Math.floor(seconds % 60);
			document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			document.getElementById('progress').value = (position / window._total_duration) * 100;
		});
	});

	document.getElementById('progress').addEventListener('mousedown', function () {
		widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
	});

	document.getElementById('progress').addEventListener('mouseup', function () {

		widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
			widget.getPosition(function (position) {
				var seconds = position / (1000),
					minutes = Math.floor(seconds / 60);
				seconds = Math.floor(seconds % 60);
				document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
				document.getElementById('progress').value = (position / window._total_duration) * 100;
			});
		});
	});

	document.getElementById('progress').addEventListener('input', function () {
		var newPos = (this.value * window._total_duration) / 100;
		var seconds = newPos / (1000),
			minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
		widget.seekTo(newPos);
	});

	document.getElementById('toggle-play').addEventListener('click', function () {
		var state = this.className;
		if (state == "toggle-play play") {
			widget.play();
			this.className = "toggle-play pause";
		} else {
			widget.pause();
			this.className = "toggle-play play";
		}
	});
})();
