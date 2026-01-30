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
})