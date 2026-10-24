const whatsapp = document.getElementById('whatsapp');
const cta = document.getElementById('cta');
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
});


whatsapp.addEventListener('click', () => {
    window.open('https://wa.me/5531995584785?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento.', '_blank');
});

cta.addEventListener('click', () => {
    window.location.href="#contact"
});

const light = document.querySelector(".cursor-light");

document.addEventListener("mousemove", (e) => {
    if (!light) return;
    light.style.left = e.clientX + "px";
    light.style.top = e.clientY + "px";
});

document.addEventListener("touchmove", (e) => {
    if (!light) return;
    const touch = e.touches[0];
    light.style.left = touch.clientX + "px";
    light.style.top = touch.clientY + "px";
}, { passive: true });

document.addEventListener("touchstart", (e) => {
    if (!light) return;
    const touch = e.touches[0];
    light.style.left = touch.clientX + "px";
    light.style.top = touch.clientY + "px";
});

const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let scrollAmount = 0;
const getMaxScroll = () => Math.max(0, carousel.scrollWidth - carousel.clientWidth);

function setCarouselPosition(position, animate = true) {
  scrollAmount = Math.max(0, Math.min(position, getMaxScroll()));
  carousel.style.transition = animate ? '' : 'none';
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
}

function moveByCard(direction) {
  const firstCard = carousel.querySelector('.c-card');
  if (!firstCard) return;

  const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
  setCarouselPosition(scrollAmount + direction * (firstCard.getBoundingClientRect().width + gap));
}

next.addEventListener('click', () => moveByCard(1));
prev.addEventListener('click', () => moveByCard(-1));

let pointerStartX = 0;
let dragStartScroll = 0;
let activePointerId = null;
let hasDragged = false;
let suppressClickUntil = 0;

carouselContainer.addEventListener('pointerdown', (event) => {
  if (
    !event.isPrimary ||
    (event.pointerType === 'mouse' && event.button !== 0) ||
    event.target.closest('button, a')
  ) return;

  activePointerId = event.pointerId;
  pointerStartX = event.clientX;
  dragStartScroll = scrollAmount;
  hasDragged = false;
  carouselContainer.setPointerCapture(event.pointerId);
});

carouselContainer.addEventListener('pointermove', (event) => {
  if (event.pointerId !== activePointerId) return;

  const dragOffset = event.clientX - pointerStartX;
  if (Math.abs(dragOffset) > 4) {
    hasDragged = true;
    carouselContainer.classList.add('is-dragging');
  }

  if (hasDragged) setCarouselPosition(dragStartScroll - dragOffset, false);
});

function finishDrag(event) {
  if (event.pointerId !== activePointerId) return;

  if (hasDragged) suppressClickUntil = Date.now() + 250;
  activePointerId = null;
  carouselContainer.classList.remove('is-dragging');
  setCarouselPosition(scrollAmount);
}

carouselContainer.addEventListener('pointerup', finishDrag);
carouselContainer.addEventListener('pointercancel', finishDrag);
carouselContainer.addEventListener('click', (event) => {
  if (Date.now() < suppressClickUntil) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

carouselContainer.addEventListener('wheel', (event) => {
  if (event.ctrlKey) return;

  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? carousel.clientWidth
      : 1;
  const nextPosition = Math.max(0, Math.min(scrollAmount + delta * multiplier, getMaxScroll()));

  if (nextPosition !== scrollAmount) {
    event.preventDefault();
    setCarouselPosition(nextPosition);
  }
}, { passive: false });

window.addEventListener('resize', () => setCarouselPosition(scrollAmount));
