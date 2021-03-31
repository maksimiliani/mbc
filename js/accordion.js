var accordion = (function(){

  var $accordion = $('.accordion-block');
  var $accordion_header = $accordion.find('.accordion-heading');
  var $accordion_item = $('.accordion-item');

  // default settings
  var settings = {
    // animation speed
    speed: 400,

    // close all other accordion items if true
    oneOpen: false,
  };

  return {
    // pass configurable object literal
    init: function($settings) {
      $accordion_header.on('click', function() {
        accordion.toggle($(this));
      });

      $.extend(settings, $settings);

      // ensure only one accordion is active if oneOpen is true
      if(settings.oneOpen && $('.accordion-item.active').length > 1) {
        $('.accordion-item.active:not(:first)').removeClass('active');
      }

      // reveal the active accordion bodies
      $('.accordion-item.active').find('> .accordion-answer').show();
    },
    toggle: function($this) {

      if(settings.oneOpen && $this[0] != $this.closest('.accordion-block').find('> .accordion-item.active > .accordion-heading')[0]) {
        $this.closest('.accordion-block')
               .find('> .accordion-item')
               .removeClass('active')
               .find('.accordion-answer')
               .slideUp()
      }

      // show/hide the clicked accordion item
      $this.closest('.accordion-item').toggleClass('active');
      $this.next().stop().slideToggle(settings.speed);
    }
  }
})();

$(document).ready(function(){
  accordion.init({ speed: 300, oneOpen: true });
});
