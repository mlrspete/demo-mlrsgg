(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header .template-nav');
    const footer = document.querySelector('.snap-footer');

    if (!header || !footer) {
      return;
    }

    const root = document.documentElement;
    let isSnapping = false;

    const isSnapDisabled = () => window.innerWidth < 768;

    function getHeaderHeight() {
      return header.getBoundingClientRect().height;
    }

    function updateSnapFooterHeight() {
      const headerHeight = getHeaderHeight();
      footer.style.height = `${headerHeight}px`;
      root.style.setProperty('--snap-footer-height', `${headerHeight}px`);
    }

    function snapTo(position) {
      isSnapping = true;
      window.scrollTo({ top: position, behavior: 'smooth' });
      setTimeout(() => {
        isSnapping = false;
      }, 500);
    }

    function handleScroll() {
      if (isSnapping || isSnapDisabled()) return;

      const headerHeight = getHeaderHeight();
      const y = window.scrollY;

      if (y >= 0 && y <= headerHeight) {
        const threshold = headerHeight / 4;

        if (y > threshold && y < headerHeight) {
          snapTo(headerHeight);
        } else if (y < headerHeight - threshold && y > 0) {
          snapTo(0);
        }
      }
    }

    updateSnapFooterHeight();
    window.addEventListener('resize', updateSnapFooterHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
  });
})();
