const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

const setNavigationState = (isOpen) => {
    navMenu.classList.toggle('navegacion--active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
};

// Función para alternar el menú
hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic llegue al document inmediatamente
    setNavigationState(!navMenu.classList.contains('navegacion--active'));
});

// Cerrar al hacer clic en cualquier parte de la pantalla
document.addEventListener('click', (e) => {
    // Si el menú está activo Y el clic no fue dentro del menú ni en la hamburguesa
    if (navMenu.classList.contains('navegacion--active')) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            setNavigationState(false);
        }
    }
});

// Opcional: Cerrar el menú al hacer clic en un enlace (para SPAs o anclas)
const navLinks = document.querySelectorAll('.navegacion__enlace');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setNavigationState(false);
    });
});

// Visor ampliado para el feed de memes.
const modalMeme = document.getElementById('modal-meme');
const modalImg = document.getElementById('modal-img');
const modalCerrar = document.getElementById('modal-cerrar');
const memeCards = document.querySelectorAll('.meme-card');
let ultimoControlMeme = null;

if (modalMeme && modalImg && modalCerrar && memeCards.length > 0) {
    const abrirModal = (card, control) => {
        const img = card.querySelector('.meme_img');
        if (!img) return;

        ultimoControlMeme = control;
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt || 'Meme ampliado';
        modalMeme.classList.add('activo');
        modalMeme.setAttribute('aria-hidden', 'false');
        modalCerrar.focus();
    };

    const cerrarModal = () => {
        modalMeme.classList.remove('activo');
        modalMeme.setAttribute('aria-hidden', 'true');
        if (ultimoControlMeme) ultimoControlMeme.focus();
    };

    memeCards.forEach(card => {
        const imageButton = card.querySelector('.contenedor__meme');
        if (imageButton) imageButton.addEventListener('click', () => abrirModal(card, imageButton));
    });

    modalCerrar.addEventListener('click', cerrarModal);
    modalMeme.addEventListener('click', (event) => {
        if (event.target === modalMeme) cerrarModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalMeme.classList.contains('activo')) cerrarModal();
    });
}
