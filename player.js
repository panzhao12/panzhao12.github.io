(function () {
	let el = document.getElementById('sc-iframe'),
		widget = SC.Widget(el);
	window._total_duration = 0;

	//warm up
	widget.bind(SC.Widget.Events.READY, function () {
		//set default volume
		widget.setVolume(30);

		let finalList = [];
		//get sound list and assign randomly one sound to each block
		let count = 0;
		let getList = setInterval(function () {
			widget.getSounds((soundList) => {
				finalList = [...soundList];
				//when we get the last sound object or try 5 times, stop fetching
				if (soundList[soundList.length - 1].title != undefined || count == 5) {
					clearInterval(getList);
					assignSoundToBlock(widget, finalList);
				}
			});
			count++;
		}, 2000);

		//set sound title
		setTitle(widget);
		//set sound duration
		getDuration(widget);
	});

	widget.bind(SC.Widget.Events.PLAY, function () {
		document.getElementById('toggle-play').className = "toggle-play pause";
		// get information of current sound
		widget.getCurrentSound(function (currentSound) {
			console.log(currentSound);
		});
		setTitle(widget);
		getDuration(widget);
	});

	widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
		widget.getPosition(function (position) {
			let seconds = position / (1000),
				minutes = Math.floor(seconds / 60);
			seconds = Math.floor(seconds % 60);
			document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			document.getElementById('player-progress').value = (position / window._total_duration) * 100;
		});
	});

	widget.bind(SC.Widget.Events.FINISH, () => {
		document.getElementById('toggle-play').className = "toggle-play play";
	})

	document.getElementById('player-progress').addEventListener('mousedown', function () {
		widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
	});

	document.getElementById('player-progress').addEventListener('mouseup', function () {

		widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
			widget.getPosition(function (position) {
				let seconds = position / (1000),
					minutes = Math.floor(seconds / 60);
				seconds = Math.floor(seconds % 60);
				document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
				document.getElementById('player-progress').value = (position / window._total_duration) * 100;
			});
		});
	});

	document.getElementById('player-progress').addEventListener('input', function () {
		let newPos = (this.value * window._total_duration) / 100;
		let seconds = newPos / (1000),
			minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		document.getElementById('position').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
		widget.seekTo(newPos);
	});

	document.getElementById('toggle-play').addEventListener('click', function () {
		let state = this.className;
		if (state == "toggle-play play") {
			widget.play();
			this.className = "toggle-play pause";
		} else {
			widget.pause();
			this.className = "toggle-play play";
		}
	});

	document.getElementById('volume-bar').addEventListener('input', function () {
		widget.setVolume(this.value);
		document.getElementById('volume').innerHTML = ~~this.value + '%';
	});
})();

function assignSoundToBlock(widget, finalList) {
	// let randomList = [];
	let blockElements = document.getElementsByClassName('slice');

	for (let i = 0; i < blockElements.length; i++) {
		// let randomNum = Math.floor(Math.random() * finalList.length);
		// randomList.push(finalList[randomNum]);

		//skip the color bar element
		if (i == 28) { continue; }

		blockElements[i].addEventListener('click', function () {
			widget.skip(i);
			widget.seekTo(0);
			getDuration(widget);
			console.log(finalList);
			console.log(finalList[i]);
			console.log(finalList[i].title);
			document.getElementById('title').innerHTML = finalList[i].title;
		});
		blockElements[i].style.background = `url('${ finalList[i].artwork_url }') center center no-repeat`;
	}
}

function getDuration(widget) {
	widget.getDuration(function (duration) {
		let seconds = duration / (1000),
			minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		document.getElementById('duration').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
		window._total_duration = duration;
	});
}

function setTitle(widget) {
	widget.getCurrentSound(function (currentSound) {
		document.getElementById('title').innerHTML = currentSound.title;
	});
}