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
const projectModal = document.querySelector('.project-modal');
const projectModalContent = document.querySelector('.project-modal-content');
const projectModalClose = document.querySelector('.project-modal-close');
const projectCards = carouselContainer.querySelectorAll('.c-card');

let pointerStartX = 0;
let dragStartScroll = 0;
let isDragging = false;
let hasDragged = false;
let suppressClickUntil = 0;
let activePointerId = null;
let dragStartCard = null;
let settleAnimationFrame = null;
let wheelAnimationFrame = null;
let wheelTargetScroll = null;

projectCards.forEach((card) => {
  const title = card.querySelector('h3');
  card.tabIndex = 0;
  card.setAttribute('aria-label', `Ampliar ${title.textContent}`);
  card.setAttribute('aria-haspopup', 'dialog');
});

function getNearestProjectCard() {
  const viewportCenter = carouselContainer.getBoundingClientRect().left
    + carouselContainer.clientWidth / 2;
  return [...projectCards].reduce((nearest, card) => {
    const cardBounds = card.getBoundingClientRect();
    const cardCenter = cardBounds.left + cardBounds.width / 2;
    const nearestBounds = nearest.getBoundingClientRect();
    const nearestCenter = nearestBounds.left + nearestBounds.width / 2;
    return Math.abs(cardCenter - viewportCenter) < Math.abs(nearestCenter - viewportCenter)
      ? card
      : nearest;
  });
}

function animateCarouselTo(targetScroll) {
  if (settleAnimationFrame !== null) {
    cancelAnimationFrame(settleAnimationFrame);
    settleAnimationFrame = null;
  }

  const startScroll = carouselContainer.scrollLeft;
  const distance = targetScroll - startScroll;
  const duration = 420;

  if (Math.abs(distance) < 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    carouselContainer.scrollLeft = targetScroll;
    carouselContainer.classList.remove('is-settling');
    return;
  }

  let startTime = null;
  const animate = (timestamp) => {
    if (startTime === null) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    carouselContainer.scrollLeft = startScroll + distance * easedProgress;

    if (progress < 1) {
      settleAnimationFrame = requestAnimationFrame(animate);
      return;
    }

    carouselContainer.scrollLeft = targetScroll;
    settleAnimationFrame = null;
    carouselContainer.classList.remove('is-settling');
  };

  carouselContainer.classList.add('is-settling');
  settleAnimationFrame = requestAnimationFrame(animate);
}

function animateWheelScroll() {
  if (wheelAnimationFrame !== null) return;

  let previousTimestamp = null;
  const animate = (timestamp) => {
    if (previousTimestamp === null) previousTimestamp = timestamp;
    const elapsed = Math.min(timestamp - previousTimestamp, 32);
    previousTimestamp = timestamp;

    const distance = wheelTargetScroll - carouselContainer.scrollLeft;
    if (Math.abs(distance) < 0.5) {
      carouselContainer.scrollLeft = wheelTargetScroll;
      wheelAnimationFrame = null;
      wheelTargetScroll = null;
      return;
    }

    const progress = 1 - Math.exp(-elapsed / 110);
    carouselContainer.scrollLeft += distance * progress;
    wheelAnimationFrame = requestAnimationFrame(animate);
  };

  wheelAnimationFrame = requestAnimationFrame(animate);
}

function openProjectModal(card) {
  const cardCopy = card.cloneNode(true);
  cardCopy.classList.remove('c-card', 'c-card-featured');
  cardCopy.classList.add('project-modal-card');
  cardCopy.removeAttribute('tabindex');
  cardCopy.removeAttribute('aria-label');
  cardCopy.removeAttribute('aria-haspopup');
  projectModalContent.replaceChildren(cardCopy);
  projectModal.showModal();
}

projectCards.forEach((card) => {
  card.addEventListener('keydown', (event) => {
    if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    openProjectModal(card);
  });
});

carouselContainer.addEventListener('click', (event) => {
  if (Date.now() < suppressClickUntil) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.target.closest('a')) return;
  const card = event.target.closest('.c-card');
  if (card) openProjectModal(card);
}, true);

projectModalClose.addEventListener('click', () => projectModal.close());
projectModal.addEventListener('click', (event) => {
  if (event.target === projectModal) projectModal.close();
});

carouselContainer.addEventListener('pointerdown', (event) => {
  if (
    !event.isPrimary ||
    (event.pointerType === 'mouse' && event.button !== 0)
  ) return;

    if (settleAnimationFrame !== null) {
      cancelAnimationFrame(settleAnimationFrame);
      settleAnimationFrame = null;
    }
    if (wheelAnimationFrame !== null) {
      cancelAnimationFrame(wheelAnimationFrame);
      wheelAnimationFrame = null;
      wheelTargetScroll = null;
    }
    carouselContainer.classList.remove('is-settling');
    isDragging = true;
  activePointerId = event.pointerId;
  pointerStartX = event.clientX;
  dragStartScroll = carouselContainer.scrollLeft;
  hasDragged = false;
  dragStartCard = getNearestProjectCard();
});

carouselContainer.addEventListener('pointermove', (event) => {
  if (!isDragging || event.pointerId !== activePointerId) return;

  const dragOffset = event.clientX - pointerStartX;
  if (Math.abs(dragOffset) > 4) {
    hasDragged = true;
    carouselContainer.classList.add('is-dragging');
    if (!carouselContainer.hasPointerCapture(event.pointerId)) {
      carouselContainer.setPointerCapture(event.pointerId);
    }
  }

  if (hasDragged) carouselContainer.scrollLeft = dragStartScroll - dragOffset;
});

function finishDrag(event) {
  if (!isDragging || event.pointerId !== activePointerId) return;

  if (hasDragged) {
    suppressClickUntil = Date.now() + 250;
    const shouldSnap = event.pointerType !== 'mouse'
      || window.matchMedia('(max-width: 1024px)').matches;

    if (!shouldSnap) {
      isDragging = false;
      activePointerId = null;
      dragStartCard = null;
      carouselContainer.classList.remove('is-dragging');
      return;
    }

    const viewportCenter = carouselContainer.getBoundingClientRect().left
      + carouselContainer.clientWidth / 2;
    let nearestCard = getNearestProjectCard();
    const dragOffset = event.clientX - pointerStartX;

    if (nearestCard === dragStartCard && Math.abs(dragOffset) >= dragStartCard.offsetWidth * 0.4) {
      const startIndex = [...projectCards].indexOf(dragStartCard);
      const nextIndex = startIndex + (dragOffset < 0 ? 1 : -1);
      if (projectCards[nextIndex]) nearestCard = projectCards[nextIndex];
    }

    const nearestBounds = nearestCard.getBoundingClientRect();
    const cardCenter = nearestBounds.left + nearestBounds.width / 2;
    const targetScroll = carouselContainer.scrollLeft + cardCenter - viewportCenter;
    const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
    isDragging = false;
    activePointerId = null;
    dragStartCard = null;
    carouselContainer.classList.remove('is-dragging');
    animateCarouselTo(Math.max(0, Math.min(targetScroll, maxScroll)));
    return;
  }

  isDragging = false;
  activePointerId = null;
  dragStartCard = null;
  carouselContainer.classList.remove('is-dragging');
}

carouselContainer.addEventListener('pointerup', finishDrag);
carouselContainer.addEventListener('pointercancel', finishDrag);

carouselContainer.addEventListener('wheel', (event) => {
  if (event.ctrlKey) return;

  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? carouselContainer.clientWidth
      : 1;
  const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
  const currentTarget = wheelTargetScroll ?? carouselContainer.scrollLeft;
  const nextPosition = Math.max(0, Math.min(currentTarget + delta * multiplier, maxScroll));

  if (nextPosition === currentTarget) return;

  event.preventDefault();
  if (settleAnimationFrame !== null) {
    cancelAnimationFrame(settleAnimationFrame);
    settleAnimationFrame = null;
    carouselContainer.classList.remove('is-settling');
  }
  wheelTargetScroll = nextPosition;
  animateWheelScroll();
}, { passive: false });
