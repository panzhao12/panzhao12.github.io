const colorbar = {
  elements: {
    slices: document.querySelectorAll(".slice"),
    title: document.getElementById("title"),
    // position: document.getElementById('position'),
    // duration: document.getElementById('duration'),
    // volume: document.getElementById('volume'),
  },
  colorBar: document.getElementById("color-bar"),
  init: function () {
    this.colorBar.addEventListener(
      "input",
      function () {
        const hue = ((this.colorBar.value / 100) * 360).toFixed(0);
        const hsl = "hsl(" + hue + ", 100%, 50%)";

        //change color dynamically
        this.colorBar.style.color = this.elements.title.style.color =
          // = this.elements.position.style.color
          // = this.elements.duration.style.color
          // = this.elements.volume.style.color
          this.colorBar.value == 0 ? "black" : hsl;

        //    this.elements.slices.forEach((element) => {
        //      element.style.backgroundColor =
        //        this.colorBar.value == 0 ? "black" : hsl;
        //    });
      }.bind(this)
    );
  },
};

colorbar.init();
