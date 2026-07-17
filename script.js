// Filtro de categoria dos animais
const chips = document.querySelectorAll('.chip');
const petCards = document.querySelectorAll('.pet-card');

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

    const filter = chip.dataset.filter;

petCards.forEach(card => {
    if (filter === 'todos') {
        card.hidden = false;
        return;
    }
    const categories = (card.dataset.categories || '').split(' ');
    card.hidden = !categories.includes(filter);
    });
});
});

// Favoritar (coração)
document.querySelectorAll('.heart').forEach(btn => {
btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    btn.setAttribute('aria-pressed', btn.classList.contains('active'));
});
});

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});
}