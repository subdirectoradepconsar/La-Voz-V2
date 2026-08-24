const birthdayOpen = document.getElementById('birthday-open');
const birthdayModal = document.getElementById('birthday-modal');
const birthdayClose = document.getElementById('birthday-close');

if (birthdayOpen && birthdayModal && birthdayClose) {
    const openBirthdayModal = () => {
        birthdayModal.classList.add('is-open');
        birthdayModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        window.setTimeout(() => birthdayClose.focus(), 50);
    };

    const closeBirthdayModal = () => {
        birthdayModal.classList.remove('is-open');
        birthdayModal.setAttribute('aria-hidden', 'true');
        document.body.style.removeProperty('overflow');
        birthdayOpen.focus();
    };

    birthdayOpen.addEventListener('click', openBirthdayModal);
    birthdayClose.addEventListener('click', closeBirthdayModal);
    birthdayModal.addEventListener('click', (event) => {
        if (event.target === birthdayModal) closeBirthdayModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && birthdayModal.classList.contains('is-open')) closeBirthdayModal();
    });
}
