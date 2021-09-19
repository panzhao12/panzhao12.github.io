let colorbar = {
     elements: {
          slices: document.querySelectorAll('.slice'),
     },
     colorBar: document.getElementById('color-bar'),
     init: function () {
          this.colorBar.addEventListener('input', function () {
               let hue = ((this.colorBar.value / 100) * 360).toFixed(0);
               let hsl = 'hsl(' + hue + ', 100%, 50%)';

               //change color dynamically
               this.colorBar.style.color = this.colorBar.value == 0 ? 'black' : hsl;
               this.elements.slices.forEach(element => {
                    element.style.backgroundColor = this.colorBar.value == 0 ? 'black' : hsl;
               });
          }.bind(this))
     }
}

colorbar.init();
