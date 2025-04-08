/**
 * @name news and event carousel
 * @function handle carousel tag
 */

$(function() {
  var $carousel = $('#news_carousel');
  // Handle carousel tag
  $carousel.slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});