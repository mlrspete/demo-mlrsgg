// Template navigation interactions and intro sequencing
(function () {
  var introHasRun = false;

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.template-nav');
    var root = document.documentElement;

    if (nav && !introHasRun) {
      introHasRun = true;

      // Ensure the nav participates in layout while keeping the intro hidden state applied by CSS.
      nav.style.display = 'flex';
      root.classList.add('nav-intro-start');

      // Kick off the timeline on the next frame so all initial states are applied first.
      requestAnimationFrame(function () {
        root.classList.add('nav-intro-play');
      });

      var cleanup = function () {
        root.classList.remove('nav-intro-enabled', 'nav-intro-start', 'nav-intro-play');
        nav.classList.add('is-visible');
      };

      // Allow all steps (frost slide, lines, buttons, pop) to finish before cleaning up helper classes.
      setTimeout(cleanup, 5200);

      if (window.__navIntroFallback) {
        clearTimeout(window.__navIntroFallback);
      }
    } else if (nav) {
      nav.classList.add('is-visible');
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
