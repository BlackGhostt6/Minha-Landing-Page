const whatsapp = document.getElementById('whatsapp');

whatsapp.addEventListener('click', () => {
    window.open('https://wa.me/5531995584785?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento', '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.card[data-service]');
    const serviceSelect = document.getElementById('service');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            serviceSelect.value = service;
            serviceSelect.focus();
        });
    });
});