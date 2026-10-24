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

const carouselContainer = document.querySelector('.carousel-container');

let pointerStartX = 0;
let dragStartScroll = 0;
let isDragging = false;
let hasDragged = false;
let suppressClickUntil = 0;

carouselContainer.addEventListener('pointerdown', (event) => {
  if (
    !event.isPrimary ||
    event.pointerType !== 'mouse' ||
    event.button !== 0
  ) return;

  isDragging = true;
  pointerStartX = event.clientX;
  dragStartScroll = carouselContainer.scrollLeft;
  hasDragged = false;
  carouselContainer.setPointerCapture(event.pointerId);
});

carouselContainer.addEventListener('pointermove', (event) => {
  if (!isDragging) return;

  const dragOffset = event.clientX - pointerStartX;
  if (Math.abs(dragOffset) > 4) {
    hasDragged = true;
    carouselContainer.classList.add('is-dragging');
  }

  if (hasDragged) carouselContainer.scrollLeft = dragStartScroll - dragOffset;
});

function finishDrag(event) {
  if (!isDragging) return;

  if (hasDragged) suppressClickUntil = Date.now() + 250;
  isDragging = false;
  carouselContainer.classList.remove('is-dragging');
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
      ? carouselContainer.clientWidth
      : 1;
  const nextPosition = carouselContainer.scrollLeft + delta * multiplier;

  if (
    nextPosition > carouselContainer.scrollLeft &&
    carouselContainer.scrollLeft < carouselContainer.scrollWidth - carouselContainer.clientWidth
  ) {
    event.preventDefault();
    carouselContainer.scrollLeft = nextPosition;
  } else if (nextPosition < carouselContainer.scrollLeft && carouselContainer.scrollLeft > 0) {
    event.preventDefault();
    carouselContainer.scrollLeft = nextPosition;
  }
}, { passive: false });
