(() => {
    const AUTOPLAY_DELAY = 5000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaContainers = document.querySelectorAll('.carousel-container');
    const carousels = document.querySelectorAll('.carousel-container--multiple');

    const updateMediaAspect = (carousel, slide) => {
        const image = slide?.querySelector('img');
        if (!image) return;

        const applyAspect = () => {
            const customAspect = Number.parseFloat(slide.dataset.mediaAspect);
            const imageAspect = image.naturalWidth / image.naturalHeight;
            const aspect = Number.isFinite(customAspect) && customAspect > 0
                ? customAspect
                : imageAspect;

            if (Number.isFinite(aspect) && aspect > 0) {
                carousel.style.setProperty('--media-aspect', aspect);
            }
        };

        if (image.complete && image.naturalWidth > 0) {
            applyAspect();
        } else {
            image.addEventListener('load', applyAspect, { once: true });
        }
    };

    mediaContainers.forEach((carousel) => {
        updateMediaAspect(carousel, carousel.querySelector('.carousel-slide'));
    });

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const previousButton = carousel.querySelector('.carousel-control--prev');
        const nextButton = carousel.querySelector('.carousel-control--next');

        if (!track || slides.length < 2) return;

        let activeIndex = 0;
        let timerId = null;
        let scrollFrame = null;
        let programmaticScrollTimer = null;
        let isProgrammaticScroll = false;
        let isVisible = !('IntersectionObserver' in window);
        let isKeyboardFocused = false;
        let isPointerDown = false;

        const updateStatus = () => {
            carousel.dataset.carouselStatus = `${activeIndex + 1} / ${slides.length}`;
        };

        const stopAutoplay = () => {
            if (timerId === null) return;
            window.clearTimeout(timerId);
            timerId = null;
        };

        const canAutoplay = () => (
            !reducedMotion.matches &&
            !document.hidden &&
            isVisible &&
            !isKeyboardFocused &&
            !isPointerDown
        );

        const scheduleAutoplay = () => {
            stopAutoplay();
            if (!canAutoplay()) return;

            timerId = window.setTimeout(() => {
                showSlide(activeIndex + 1);
            }, AUTOPLAY_DELAY);
        };

        const showSlide = (requestedIndex) => {
            activeIndex = (requestedIndex + slides.length) % slides.length;
            updateStatus();

            if (programmaticScrollTimer !== null) {
                window.clearTimeout(programmaticScrollTimer);
            }
            isProgrammaticScroll = true;
            track.scrollTo({
                left: activeIndex * track.clientWidth,
                behavior: reducedMotion.matches ? 'auto' : 'smooth'
            });

            programmaticScrollTimer = window.setTimeout(() => {
                programmaticScrollTimer = null;
                isProgrammaticScroll = false;
                syncActiveSlide();
            }, reducedMotion.matches ? 0 : 500);
            scheduleAutoplay();
        };

        const syncActiveSlide = () => {
            if (track.clientWidth === 0) return;
            activeIndex = Math.max(0, Math.min(
                slides.length - 1,
                Math.round(track.scrollLeft / track.clientWidth)
            ));
            updateStatus();
            scheduleAutoplay();
        };

        previousButton?.addEventListener('click', () => showSlide(activeIndex - 1));
        nextButton?.addEventListener('click', () => showSlide(activeIndex + 1));

        track.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            showSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
        });

        track.addEventListener('scroll', () => {
            if (isProgrammaticScroll) return;
            if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
            scrollFrame = window.requestAnimationFrame(() => {
                scrollFrame = null;
                syncActiveSlide();
            });
        }, { passive: true });

        carousel.addEventListener('focusin', (event) => {
            isKeyboardFocused = event.target.matches(':focus-visible');
            if (isKeyboardFocused) stopAutoplay();
        });

        carousel.addEventListener('focusout', () => {
            window.setTimeout(() => {
                const focusedElement = document.activeElement;
                isKeyboardFocused = carousel.contains(focusedElement) && focusedElement.matches(':focus-visible');
                scheduleAutoplay();
            }, 0);
        });

        carousel.addEventListener('pointerdown', () => {
            if (programmaticScrollTimer !== null) {
                window.clearTimeout(programmaticScrollTimer);
                programmaticScrollTimer = null;
            }
            isProgrammaticScroll = false;
            isPointerDown = true;
            stopAutoplay();
        }, { passive: true });

        const releasePointer = () => {
            if (!isPointerDown) return;
            isPointerDown = false;
            scheduleAutoplay();
        };

        window.addEventListener('pointerup', releasePointer, { passive: true });
        window.addEventListener('pointercancel', releasePointer, { passive: true });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(([entry]) => {
                isVisible = entry.isIntersecting;
                scheduleAutoplay();
            }, { threshold: 0.15 });
            observer.observe(carousel);
        }

        document.addEventListener('visibilitychange', scheduleAutoplay);
        if (typeof reducedMotion.addEventListener === 'function') {
            reducedMotion.addEventListener('change', scheduleAutoplay);
        } else {
            reducedMotion.addListener(scheduleAutoplay);
        }
        window.addEventListener('resize', syncActiveSlide, { passive: true });

        updateStatus();
        scheduleAutoplay();
    });
})();
