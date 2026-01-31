const whatsapp = document.getElementById('whatsapp');
const cta = document.getElementById('cta')
let lastScroll =0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 60) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScroll = currentScroll
})

whatsapp.addEventListener('click', () => {
    window.open('https://wa.me/5531995584785?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento', '_blank');
});

cta.addEventListener('click', () => {
    window.location.href="#contact"
});

const light = document.querySelector(".cursor-light");

document.addEventListener("mousemove", (e) => {
    light.style.left = e.clientX + "px";
    light.style.top = e.clientY + "px";
});

const carousel = document.querySelector('.carousel');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let scrollAmount = 0;
const cardWidth = 550;

next.addEventListener('click', () => {
  scrollAmount += cardWidth;
  if(scrollAmount > (carousel.scrollWidth - carousel.clientWidth)) {
    scrollAmount = carousel.scrollWidth - carousel.clientWidth;
  }
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
});

prev.addEventListener('click', () => {
  scrollAmount -= cardWidth;
  if(scrollAmount < 0) scrollAmount = 0;
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
});

let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let dragOffset = 0;

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  isDragging = true;
  carousel.style.transition = 'none';
}, false);

carousel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  
  touchEndX = e.changedTouches[0].clientX;
  dragOffset = touchEndX - touchStartX;
  carousel.style.transform = `translateX(-${scrollAmount - dragOffset}px)`;
}, false);

carousel.addEventListener('touchend', (e) => {
  isDragging = false;
  carousel.style.transition = 'transform 0.4s ease';
  
  const minSwipeDistance = 50;
  
  if (dragOffset > minSwipeDistance) {
    scrollAmount -= cardWidth;
    if(scrollAmount < 0) scrollAmount = 0;
  } else if (dragOffset < -minSwipeDistance) {
    scrollAmount += cardWidth;
    if(scrollAmount > (carousel.scrollWidth - carousel.clientWidth)) {
      scrollAmount = carousel.scrollWidth - carousel.clientWidth;
    }
  }
  
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
  dragOffset = 0;
}, false);
