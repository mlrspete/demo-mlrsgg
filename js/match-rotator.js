// Cycle through match result entries inside the server card header.
document.addEventListener('DOMContentLoaded', function () {
  var entries = document.querySelectorAll('.match-rotator .match-entry');
  if (!entries.length) return;

  var activeIndex = 0;
  var rotationInterval = 3000;

  entries.forEach(function (entry, index) {
    if (index !== 0) {
      entry.classList.remove('is-active');
    }
  });

  setInterval(function () {
    entries[activeIndex].classList.remove('is-active');
    activeIndex = (activeIndex + 1) % entries.length;
    entries[activeIndex].classList.add('is-active');
  }, rotationInterval);
});
