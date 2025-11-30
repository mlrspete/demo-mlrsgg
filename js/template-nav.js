// Template navigation interactions
(function () {
  var root = document.documentElement;

  // Ensure the intro class is present early so the nav starts hidden when JS is enabled.
  if (!root.classList.contains('nav-intro-preload')) {
    root.classList.add('nav-intro-preload');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.template-nav');
    if (nav) {
      // Step 1: make the nav participate in layout without showing it yet.
      root.classList.add('nav-intro-playing');
      nav.style.display = 'flex';

      // Step 2: kick off the staged CSS transitions.
      requestAnimationFrame(function () {
        root.classList.remove('nav-intro-preload');

        // Step 3: reveal the stronger right-hand line once the main draw begins.
        setTimeout(function () {
          root.classList.add('nav-intro-lines');
        }, 1000);
      });
    }

    var soundIcon = document.querySelector('.template-nav .sound-icon');
    if (!soundIcon) return;

    var loadLottie = function () {
      if (!window.lottie) return;
      window.lottie.loadAnimation({
        container: soundIcon,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'js/sound.json'
      });
    };

    if (window.lottie) {
      loadLottie();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.6/lottie.min.js';
    script.async = true;
    script.onload = loadLottie;
    document.head.appendChild(script);
  });
})();
