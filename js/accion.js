(() => {
  const article = document.querySelector("#action-article");
  const progressBar = document.querySelector("#reading-progress-bar");
  if (!article || !progressBar) return;

  let ticking = false;
  const updateProgress = () => {
    const readingDistance = Math.max(article.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((window.scrollY - article.offsetTop) / readingDistance, 0), 1);
    progressBar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateProgress();
})();
