// Template navigation interactions
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.template-nav');
    if (nav) {
      // Guard so the intro only runs once per page load / mount.
      if (nav.dataset.introPlayed === 'true') {
        nav.classList.add('nav-intro-ready', 'nav-intro-play');
      } else {
        nav.dataset.introPlayed = 'true';

        // Step 0: make nav part of the layout but keep it hidden.
        nav.classList.add('nav-intro-ready');

        // Step 1+: kick off CSS-driven animation timeline on the next frame.
        requestAnimationFrame(function () {
          nav.classList.add('nav-intro-play');
        });
      }
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
