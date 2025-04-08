/**
 * @name testimonial carousel
 * @function handle carousel tag
 */

$(function() {
  var $carousel = $('#testimonial_carousel');
  // Handle carousel tag
  $carousel.slick({
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    fade: true,
    arrows: false,
    pauseOnHover: false
  });
  
  // Handle slick navigation
  $('#logo_nav a').click(function() {
    var index = $(this).data("index");
    $carousel.slick('slickGoTo', index);
  });

  $carousel.on('afterChange', function(event, slick, currentSlide){
    var active = currentSlide + 1;
    $('#logo_nav a').removeClass("active");
    $('#logo_nav > .figure-btn:nth-child('+active+') a').addClass("active");
  });
});