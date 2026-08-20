const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Función para alternar el menú
hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic llegue al document inmediatamente
    navMenu.classList.toggle('navegacion--active');
});

// Cerrar al hacer clic en cualquier parte de la pantalla
document.addEventListener('click', (e) => {
    // Si el menú está activo Y el clic no fue dentro del menú ni en la hamburguesa
    if (navMenu.classList.contains('navegacion--active')) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('navegacion--active');
        }
    }
});

// Opcional: Cerrar el menú al hacer clic en un enlace (para SPAs o anclas)
const navLinks = document.querySelectorAll('.navegacion__enlace');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('navegacion--active');
    });
});

// Feed interactivo de memes: likes y visor ampliado.
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
        const zoomButton = card.querySelector('.meme-zoom');
        const likeButton = card.querySelector('.meme-like');
        const likeCount = card.querySelector('.meme-like__count');

        [imageButton, zoomButton].forEach(control => {
            if (control) control.addEventListener('click', () => abrirModal(card, control));
        });

        if (likeButton && likeCount) {
            const initialCount = Number.parseInt(likeCount.textContent, 10) || 0;
            likeButton.addEventListener('click', () => {
                const liked = likeButton.getAttribute('aria-pressed') !== 'true';
                likeButton.setAttribute('aria-pressed', String(liked));
                likeButton.setAttribute('aria-label', liked ? 'Quitar Me gusta' : 'Me gusta');
                likeCount.textContent = String(initialCount + (liked ? 1 : 0));
            });
        }
    });

    modalCerrar.addEventListener('click', cerrarModal);
    modalMeme.addEventListener('click', (event) => {
        if (event.target === modalMeme) cerrarModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalMeme.classList.contains('activo')) cerrarModal();
    });
}
