(() => {
    const carousel = document.querySelector(".events-carousel");
    const track = document.querySelector(".events-track");
    const slides = [...document.querySelectorAll(".event-slide")];
    const dots = [...document.querySelectorAll(".events-dot")];
    const previous = document.querySelector(".events-control--prev");
    const next = document.querySelector(".events-control--next");
    const status = document.querySelector(".events-status");

    if (!carousel || !track || slides.length === 0) return;

    let current = 0;
    let pointerStart = null;
    let suppressClick = false;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            const isHidden = slideIndex !== current;
            slide.setAttribute("aria-hidden", String(isHidden));
            slide.inert = isHidden;
        });

        dots.forEach((dot, dotIndex) => {
            const isCurrent = dotIndex === current;
            dot.classList.toggle("is-active", isCurrent);
            if (isCurrent) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });

        if (status) status.textContent = `Evento ${current + 1} de ${slides.length}`;
    };

    previous?.addEventListener("click", () => showSlide(current - 1));
    next?.addEventListener("click", () => showSlide(current + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
    document.querySelectorAll(".event-slide__media").forEach((media) => media.addEventListener("click", (event) => {
        if (suppressClick) {
            event.preventDefault();
            return;
        }
        showSlide(current + 1);
    }));

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") showSlide(current - 1);
        if (event.key === "ArrowRight") showSlide(current + 1);
    });

    carousel.addEventListener("pointerdown", (event) => {
        pointerStart = event.clientX;
        carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointerup", (event) => {
        if (pointerStart === null) return;
        const distance = event.clientX - pointerStart;
        pointerStart = null;
        if (Math.abs(distance) < 45) return;
        suppressClick = true;
        showSlide(current + (distance < 0 ? 1 : -1));
        window.setTimeout(() => { suppressClick = false; }, 0);
    });

    carousel.addEventListener("pointercancel", () => { pointerStart = null; });
    showSlide(0);
})();
