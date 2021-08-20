var bodyRect;
var header_el;
var locked = false;
var sections_color;
var header_shrinked = false;

function isNight(color) {
  var r, g, b, hsp; // Variables for red, green, blue values
  if (color.match(/^rgb/)) { // Check the format of the color, HEX or RGB?
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/); // If HEX --> store the red, green, blue values in separate variables
    r = color[1];
    g = color[2];
    b = color[3];
  }
  else { // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  hsp = Math.sqrt( // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  if (hsp>152) { // hsp>127.5 Using the HSP value, determine whether the color is light or dark // original 185
    return false; //'day'
  }
  else {
    return true; //'night'
  }
}

function update_header(colourr) {

  header_el = $(".navbar");
  bodyRect = document.body.getBoundingClientRect();

  for (var i=0; i < sections_color.length; i++) {
    var offset1 = sections_color[i].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
    var offset2 = sections_color[i].getBoundingClientRect().top - bodyRect.top + sections_color[i].getBoundingClientRect().height - header_el[0].offsetHeight;
    if (i < sections_color.length-1)
      offset2 = sections_color[i+1].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
      if ((window.scrollY >= offset1) && (window.scrollY < offset2)) {
        var new_colourr = getComputedStyle(sections_color[i], null).backgroundColor;
        if (colourr != null) {
          new_colourr = colourr;
          //header_el[0].style.backgroundColor = new_colourr;
        } else {
          //console.log(new_colourr);
          //header_el[0].style.backgroundColor = new_colourr.slice(0,-1) + ', 0.9)';
        }

        if (isNight(new_colourr)) {
          $('.logo').addClass('night');
          $('.navlink').addClass('night');
          $('.nav-menu').addClass('night');
          $('.menu-button').addClass('night');
          $('.navlink-box').addClass('night');
          $('#nav_cta').addClass('night');
        } else {
          $('.logo').removeClass('night');
          $('.navlink').removeClass('night');
          $('.nav-menu').removeClass('night');
          $('.menu-button').removeClass('night');
          $('.navlink-box').removeClass('night');
          $('#nav_cta').removeClass('night');
        }
        break;
      }
    }
    locked = false;
}

$(document).ready(function() {

  sections_color = document.getElementsByClassName("section");

  $(window).scroll(function() {
     if (!locked) {
       locked = true;
       setTimeout(update_header(null), 150);
     }
   });

  update_header(null);

});

(function () {

    var deadline = '2021/09/18 10:00';

    function pad(num, size) {
        var s = "0" + num;
        return s.substr(s.length - size);
    }

    // fixes "Date.parse(date)" on safari
    function parseDate(date) {
        const parsed = Date.parse(date);
        if (!isNaN(parsed)) return parsed
        return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
    }

    function getTimeRemaining(endtime) {
        let total = parseDate(endtime) - Date.parse(new Date())
        let seconds = Math.floor((total / 1000) % 60)
        let minutes = Math.floor((total / 1000 / 60) % 60)
        let hours = Math.floor((total / (1000 * 60 * 60)) % 24)
        let days = Math.floor(total / (1000 * 60 * 60 * 24))

        return { total, days, hours, minutes, seconds };
    }

    function clock(id, endtime) {
        let days = document.getElementById(id + '-days')
        let hours = document.getElementById(id + '-hours')
        let minutes = document.getElementById(id + '-minutes')
        let seconds = document.getElementById(id + '-seconds')

        var timeinterval = setInterval(function () {
            var time = getTimeRemaining(endtime);

            if (time.total <= 0) {
                clearInterval(timeinterval);
            } else {
                days.innerHTML = pad(time.days, 2);
                hours.innerHTML = pad(time.hours, 2);
                minutes.innerHTML = pad(time.minutes, 2);
                seconds.innerHTML = pad(time.seconds, 2);
            }
        }, 1000);
    }

    clock('js-clock', deadline);
})();
