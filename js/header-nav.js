var bodyRect;
var header_el;
var the_nav_megamenu;
var locked = false;
var sections_color;
var header_shrinked = false;
var menu_opened = false;
var service_opened = false;
//var menu_bg;

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
  //console.log(menu_opened);
  if (menu_opened) return;

  if (!header_shrinked && (window.scrollY > 112)) {
    $('.logo').addClass('shrinked');
    $('.nav-link').addClass('shrinked');
    $('#nav_menu').addClass('shrinked');
    $('#header_button').addClass('shrinked');
//    $('#nav_megamenu').addClass('shrinked');
    header_shrinked = true;
  }
  if (header_shrinked && (window.scrollY <= 112)) {
    $('.logo').removeClass('shrinked');
    $('.nav-link').removeClass('shrinked');
    $('#nav_menu').removeClass('shrinked');
    $('#header_button').removeClass('shrinked');
//    $('#nav_megamenu').removeClass('shrinked');
    header_shrinked = false;
  }

  header_el = $(".navbar-master");
  the_nav_megamenu = $(".nav-megamenu");
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
          header_el[0].style.backgroundColor = new_colourr;
          the_nav_megamenu[0].style.backgroundColor = new_colourr;
        } else {
          //console.log(new_colourr);
          header_el[0].style.backgroundColor = new_colourr.slice(0,-1) + ', 0.9)';
          the_nav_megamenu[0].style.backgroundColor = new_colourr.slice(0,-1) + ', 1.0)';
        }

        if (isNight(new_colourr)) {
          $('.navbar-master .nav-link').addClass('night');
          $('.navbar-master .logo').addClass('night');
          $('.navbar-master .button').addClass('night');
          $('.navbar-master .menu-button').addClass('night');
          $('.nav-megamenu .p-18').addClass('night');
          $('.nav-megamenu .p-15').addClass('night');
          $('.services-menu').addClass('night');
        } else {
          $('.navbar-master .nav-link').removeClass('night');
          $('.navbar-master .logo').removeClass('night');
          $('.navbar-master .button').removeClass('night');
          $('.navbar-master .menu-button').removeClass('night');
          $('.nav-megamenu .p-18').removeClass('night');
          $('.nav-megamenu .p-15').removeClass('night');
          $('.services-menu').removeClass('night');
        }
        locked = false;
        break;
      }
    }
}

$(document).ready(function() {

  // var img1 = $("#case-cover");
  // if (img1.length > 0) {
  //   var src = img1[0].src;
  //   img1[0].removeAttribute("src");
  //   img1[0].crossOrigin = 'anonymous';
  //   img1[0].src = src;
  //
  //   const fac = new FastAverageColor();
  //   const container = document.querySelector('.section.case-cover-section');
  //   fac.getColorAsync(container.querySelector('img'))
  //     .then(color => {
  //     container.style.backgroundColor = color.rgba;
  //     container.style.color = color.isDark ? '#fff' : '#000';
  //   }).catch(e => {
  //     console.log(e);
  //   });
  // } — replaced with cms handling

  $('#blog-content a').attr('rel','nofollow'); //no-follow setup

  if (document.cookie.indexOf("accepted_cookies=") < 0) {
    $('#cookie_message').removeClass('hidden');
  }
  $('#accept_cookies').on('click', function() {
    document.cookie = "accepted_cookies=yes;"
  });

  var blog_el = document.getElementsByClassName("rounded.blog");
  for (var i=0; i < blog_el.length; i++) {
    var blog_colourr = getComputedStyle(blog_el[i], null).backgroundColor;
    if (isNight(blog_colourr)) {
      blog_el[i].getElementsByClassName('.rounded .p-15').addClass('night');
      blog_el[i].getElementsByClassName('.rounded .p-26').addClass('night');
    }
  }

  $(".menu-button").click(function() {
    if (menu_opened) {
      $('.navbar-master').removeClass('opened');
      menu_opened = false;
      update_header(null);
      the_nav_megamenu[0].style.backgroundColor = 'rgb(255, 255, 255)';
      $('html, body').css({overflow: 'auto'});
    } else {
      $('.navbar-master').addClass('opened');
      update_header('rgb(255, 255, 255)');
      menu_opened = true;
      the_nav_megamenu[0].style.backgroundColor = 'rgb(255, 255, 255)';
      $('html, body').css({overflow: 'hidden'});
    }
  });

  $(".service-hidden").click(function() {
    if (!service_opened) {
      service_opened = true;
      $('html, body').css({overflow: 'hidden'});
      $('.services-menu')[0].style.height = 'calc(100vh - 240px)';
      $('.services-menu.night')[0].style.scrollbar-color = 'rgba(255,255,255,0.33) transparent';
      $('.services-menu')[0].style.scrollbar-color = 'rgba(42,40,41,0.33) transparent';
    }
  });
  $(".megamenu-close").click(function() {
    if (service_opened) {
      service_opened = false;
      $('html, body').css({overflow: 'auto'});
    }
  });
  $(".nav-megamenu").click(function() {
    if (service_opened) {
      service_opened = false;
      $('html, body').css({overflow: 'auto'});
    }
  });

  sections_color = document.getElementsByClassName("section");

  //average color for case cover
  // const fac = new FastAverageColor();
  //const case_cover_section = document.querySelector('.case-cover-section');
  //const got_color = fac.getColor(case_cover_section.querySelector('img'));
  //case_cover_section.style.backgroundColor = got_color.rgb;

  $(window).scroll(function() {
     if (!locked) {
       locked = true;
       setTimeout(update_header(null), 150);
     }
   });

  //setInterval(function(){ locked = true; if (!menu_opened) update_header(null); }, 200);

  update_header(null);

  // $(".w-nav-overlay").attrchange({
  //   trackValues: true,
  //   callback: function(event) {
  //     var mobile_menu = document.getElementsByClassName("w-nav-overlay");
  //       if (mobile_menu[0].style.display === "none") {
  //         update_header(null);
  //       } else {
  //         $('.navbar-master .nav-link').addClass('night');
  //         $('.navbar-master .logo').addClass('night');
  //         $('.navbar-master .button').addClass('night');
  //         $('.navbar-master .menu-button').addClass('night');
  //       }
  //     }
  //   });

});
