// Template navigation interactions
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.template-nav');
    if (nav) {
      requestAnimationFrame(function () {
        nav.classList.add('is-visible');
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
