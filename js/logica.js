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

// Modal para ver memes en grande (sección Humor)
const modalMeme = document.getElementById('modal-meme');
const modalImg = document.getElementById('modal-img');
const modalCerrar = document.getElementById('modal-cerrar');
const memeImgs = document.querySelectorAll('.meme_img');

if (modalMeme && modalImg && memeImgs.length > 0) {
    const abrirModal = (src, alt) => {
        modalImg.src = src;
        modalImg.alt = alt || 'Meme ampliado';
        modalMeme.classList.add('activo');
        modalMeme.setAttribute('aria-hidden', 'false');
    };

    const cerrarModal = () => {
        modalMeme.classList.remove('activo');
        modalMeme.setAttribute('aria-hidden', 'true');
    };

    memeImgs.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModal(img.src, img.alt);
        });
    });

    if (modalCerrar) {
        modalCerrar.addEventListener('click', (e) => {
            e.stopPropagation();
            cerrarModal();
        });
    }

    modalMeme.addEventListener('click', (e) => {
        if (e.target !== modalImg) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            if (modalMeme.classList.contains('activo')) {
                cerrarModal();
            }
        }
    });
}