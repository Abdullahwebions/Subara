new Swiper('.SwiperContainer', {
  // loop: true,

  breakpoints: {
    0:{
      slidesPerView:2,
      spaceBetween: 10
    },
    768:{
      slidesPerView:3,
      spaceBetween:20
    },
    1024:{
      slidesPerView:5,
      spaceBetween:25
    },
  }
});