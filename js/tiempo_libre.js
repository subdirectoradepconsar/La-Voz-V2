(() => {
    const carousel = document.querySelector(".events-carousel");
    const track = document.querySelector(".events-track");
    const slides = [...document.querySelectorAll(".event-slide")];
    const previous = document.querySelector(".events-control--prev");
    const next = document.querySelector(".events-control--next");
    const controls = document.querySelector(".events-showcase__controls");
    const status = document.querySelector(".events-status");

    if (!carousel || !track || slides.length === 0) return;

    const autoplayDelay = 7000;
    let current = 0;
    let pointerStart = null;
    let autoplayTimer = null;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            const isHidden = slideIndex !== current;
            slide.setAttribute("aria-hidden", String(isHidden));
            slide.inert = isHidden;
        });

        const activeMedia = slides[current].querySelector(".event-slide__media");
        if (controls && activeMedia) activeMedia.append(controls);

        if (status) status.textContent = `Evento ${current + 1} de ${slides.length}`;
    };

    const scheduleAutoplay = () => {
        window.clearTimeout(autoplayTimer);
        if (document.hidden) return;
        autoplayTimer = window.setTimeout(() => {
            showSlide(current + 1);
            scheduleAutoplay();
        }, autoplayDelay);
    };

    const navigateTo = (index) => {
        showSlide(index);
        scheduleAutoplay();
    };

    const stopControlPointer = (event) => event.stopPropagation();
    previous?.addEventListener("pointerdown", stopControlPointer);
    next?.addEventListener("pointerdown", stopControlPointer);
    previous?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        navigateTo(current - 1);
    });
    next?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        navigateTo(current + 1);
    });
    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") navigateTo(current - 1);
        if (event.key === "ArrowRight") navigateTo(current + 1);
    });

    carousel.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".events-control")) return;
        pointerStart = event.clientX;
        carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointerup", (event) => {
        if (pointerStart === null) return;
        const distance = event.clientX - pointerStart;
        pointerStart = null;
        if (Math.abs(distance) < 45) return;
        navigateTo(current + (distance < 0 ? 1 : -1));
    });

    carousel.addEventListener("pointercancel", () => { pointerStart = null; });
    document.addEventListener("visibilitychange", scheduleAutoplay);
    showSlide(0);
    scheduleAutoplay();
})();
