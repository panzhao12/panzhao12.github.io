(function () {
  // color the title randomly
  const hue = (Math.random() * 360).toFixed(0);
  const hsl = "hsl(" + hue + ", 100%, 50%)";
  const title = document.getElementById("title");
  title.style.color = hsl;

  const el = document.getElementById("sc-iframe"),
    widget = SC.Widget(el);
  window._total_duration = 0;

  let preSoundIndex = 0;
  const blockElements = document.getElementsByClassName("slice");

  // mouse wheel control for volume
  const volumeSlider = document.getElementById("volume-bar");
  volumeSlider.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
      volumeSlider.valueAsNumber += 5;
    } else {
      volumeSlider.value -= 5;
    }

    widget.setVolume(volumeSlider.value);
    document.getElementById("volume").innerHTML = ~~volumeSlider.value + "%";

    e.preventDefault();
    e.stopPropagation();
  });

  volumeSlider.addEventListener("input", function () {
    widget.setVolume(this.value);
    document.getElementById("volume").innerHTML = ~~this.value + "%";
  });

  // warm up
  widget.bind(SC.Widget.Events.READY, function () {
    console.log("Getting ready...");
    //set default volume
    widget.setVolume(30);

    // get sound list and assign randomly one sound to each block
    let count = 0;
    const getList = setInterval(function () {
      widget.getSounds((soundList) => {
        // when we get the last sound object or try 5 times, stop fetching
        if (soundList[soundList.length - 1].title != undefined || count == 5) {
          clearInterval(getList);
          assignSoundToBlock(widget, soundList, blockElements);
        }
      });
      count++;
    }, 2000);

    // set sound title
    setTitle(widget);
    // set sound duration
    getDuration(widget);
  });

  widget.bind(SC.Widget.Events.PLAY, function () {
    document.getElementById("toggle-play").className = "toggle-play pause";
    // highlight current sound block
    // console.log(preSoundIndex);
    widget.getCurrentSoundIndex((currentSoundIndex) => {
      if (currentSoundIndex < blockElements.length) {
        if (currentSoundIndex != preSoundIndex) {
          document
            .getElementsByClassName(`slice-${preSoundIndex + 1}`)[0]
            .classList.remove("current-sound");
        }
        document
          .getElementsByClassName(`slice-${currentSoundIndex + 1}`)[0]
          .classList.add("current-sound");
        preSoundIndex = currentSoundIndex;
      }
    });
    setTitle(widget);
    getDuration(widget);
  });

  widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
    widget.getPosition(function (position) {
      let seconds = position / 1000,
        minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      document.getElementById("position").innerHTML =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
      document.getElementById("player-progress").value =
        (position / window._total_duration) * 100;
    });
  });

  widget.bind(SC.Widget.Events.FINISH, () => {
    widget.seekTo(0);
    document.getElementById("toggle-play").className = "toggle-play play";
    widget.getCurrentSoundIndex((currentSoundIndex) => {
      document
        .getElementsByClassName(`slice-${currentSoundIndex}`)[0]
        .classList.remove("current-sound");
    });
  });

  document
    .getElementById("player-progress")
    .addEventListener("mousedown", function () {
      widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
    });

  document
    .getElementById("player-progress")
    .addEventListener("mouseup", function () {
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
        widget.getPosition(function (position) {
          let seconds = position / 1000,
            minutes = Math.floor(seconds / 60);
          seconds = Math.floor(seconds % 60);
          document.getElementById("position").innerHTML =
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);
          document.getElementById("player-progress").value =
            (position / window._total_duration) * 100;
        });
      });
    });

  document
    .getElementById("player-progress")
    .addEventListener("input", function () {
      const newPos = (this.value * window._total_duration) / 100;
      let seconds = newPos / 1000,
        minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      document.getElementById("position").innerHTML =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
      widget.seekTo(newPos);
    });

  document.getElementById("toggle-play").addEventListener("click", function () {
    const state = this.className;
    if (state === "toggle-play play") {
      widget.play();
      this.className = "toggle-play pause";
    } else {
      widget.pause();
      this.className = "toggle-play play";
    }
  });

  document.onkeydown = function (e) {
    const playButton = document.getElementById("toggle-play");
    const state = playButton.className;
    if (e.keyCode === 32) {
      if (state === "toggle-play play") {
        widget.play();
        playButton.className = "toggle-play pause";
      } else {
        widget.pause();
        playButton.className = "toggle-play play";
      }
    }
  };
})();

function assignSoundToBlock(widget, finalList, blockElements) {
  for (let i = 0; i < blockElements.length; i++) {
    blockElements[i].addEventListener("click", function () {
      widget.skip(i);
      widget.seekTo(0);
      getDuration(widget);
      blockElements[i].classList.add("current-sound");
      // set sound title
      document.getElementById("title").innerHTML = finalList[i].title;
    });
    blockElements[
      i
    ].style.background = `url('${finalList[i].artwork_url}') center center no-repeat`;
  }
}

function getDuration(widget) {
  widget.getDuration(function (duration) {
    let seconds = duration / 1000,
      minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    document.getElementById("duration").innerHTML =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
    window._total_duration = duration;
  });
}

function setTitle(widget) {
  widget.getCurrentSound(function (currentSound) {
    document.getElementById("title").innerHTML = currentSound.title;
  });
}
