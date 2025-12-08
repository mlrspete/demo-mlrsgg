const SERVER_STATUS_API = 'https://api.battlemetrics.com/servers/34356678';
const SERVER_REFRESH_INTERVAL = 60000;

function initMatchRotator() {
  const rotator = document.querySelector('.match-rotator');
  if (!rotator) return;

  const entries = Array.from(rotator.querySelectorAll('.match-entry'));
  if (entries.length <= 1) return;

  let currentIndex = entries.findIndex((entry) => entry.classList.contains('is-active'));
  if (currentIndex < 0) {
    entries[0].classList.add('is-active');
    currentIndex = 0;
  }

  const cycleEntries = () => {
    const current = entries[currentIndex];
    const nextIndex = (currentIndex + 1) % entries.length;
    const next = entries[nextIndex];

    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    next.classList.add('is-active');

    window.setTimeout(() => {
      current.classList.remove('is-leaving');
    }, 500);

    currentIndex = nextIndex;
  };

  setInterval(cycleEntries, 3000);
}

function applyStatusVisual(isOnline, statusDot, statusText) {
  statusDot.classList.toggle('online', isOnline);
  statusDot.classList.toggle('offline', !isOnline);
  statusText.classList.toggle('offline', !isOnline);
  statusText.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
}

function updateProgressBar(progressEl, currentPlayers, maxPlayers) {
  if (!progressEl) return;
  const safeMax = Math.max(maxPlayers, 0);
  const ratio = safeMax > 0 ? Math.min(currentPlayers / safeMax, 1) : 0;
  progressEl.style.width = `${(ratio * 100).toFixed(1)}%`;
  progressEl.style.opacity = ratio > 0 ? 1 : 0.35;
}

function updateConnectButton(buttonEl, isOnline, ip, port) {
  if (!buttonEl) return;
  const hasTarget = Boolean(ip && port && isOnline);
  buttonEl.disabled = !hasTarget;
  buttonEl.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasTarget) return;
    window.location.href = `steam://connect/${ip}:${port}`;
  };
}

async function fetchServerStatus() {
  const statusDot = document.getElementById('server-status-dot');
  const statusText = document.getElementById('server-status-text');
  const serverName = document.getElementById('server-name');
  const currentEl = document.getElementById('server-current');
  const maxEl = document.getElementById('server-max');
  const progressEl = document.getElementById('server-progress-bar');
  const connectBtn = document.getElementById('server-connect-btn');

  if (!statusDot || !statusText || !serverName || !currentEl || !maxEl || !progressEl || !connectBtn) {
    return;
  }

  const applyOfflineFallback = (message) => {
    applyStatusVisual(false, statusDot, statusText);
    serverName.textContent = message || 'Server unavailable';
    currentEl.textContent = '0';
    maxEl.textContent = '0';
    updateProgressBar(progressEl, 0, 0);
    updateConnectButton(connectBtn, false);
  };

  try {
    const response = await fetch(SERVER_STATUS_API, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();
    const attrs = json?.data?.attributes || {};
    const isOnline = attrs.status === 'online';

    applyStatusVisual(isOnline, statusDot, statusText);
    serverName.textContent = attrs.name || 'Unnamed Server';

    const currentPlayers = Number(attrs.players) || 0;
    const maxPlayers = Number(attrs.maxPlayers) || 0;

    currentEl.textContent = currentPlayers.toString();
    maxEl.textContent = maxPlayers.toString();
    updateProgressBar(progressEl, currentPlayers, maxPlayers);

    const { ip = '', port = '' } = attrs;
    updateConnectButton(connectBtn, isOnline, ip, port);
  } catch (error) {
    console.error('Failed to load server status', error);
    applyOfflineFallback('Status unavailable');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchServerStatus();
  setInterval(fetchServerStatus, SERVER_REFRESH_INTERVAL);

  initMatchRotator();

  const syncCardToNavTrack = () => {
    const cardWrapper = document.querySelector('.mlrs-server-card-wrapper');
    const heroRight = cardWrapper?.parentElement;
    const navAbout = document.querySelector('.template-nav .nav-button.bg');
    const navTwitter = document.querySelector('.template-nav .size-two .nav-button:last-child');

    if (!cardWrapper || !heroRight || !navAbout || !navTwitter) {
      return;
    }

    const aboutRect = navAbout.getBoundingClientRect();
    const twitterRect = navTwitter.getBoundingClientRect();
    const heroRect = heroRight.getBoundingClientRect();

    const width = Math.max(twitterRect.right - aboutRect.left, 0);
    const offset = aboutRect.left - heroRect.left;

    if (width > 0) {
      cardWrapper.style.setProperty('--mlrs-track-width', `${width}px`);
      cardWrapper.style.setProperty('--mlrs-track-offset', `${offset}px`);
    }
  };

  const card = document.querySelector('.mlrs-server-card');
  if (card) {
    const parent = card.parentElement;
    if (parent && !parent.classList.contains('mlrs-server-card-wrapper')) {
      parent.classList.add('mlrs-server-card-wrapper');
    }

    const maxRotate = 12;

    syncCardToNavTrack();
    window.addEventListener('resize', syncCardToNavTrack);

    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * maxRotate * -1;
      const rotateX = ((y - midY) / midY) * maxRotate;
      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
    };

    const resetTilt = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseenter', handleMove);
    card.addEventListener('mouseleave', resetTilt);
  }
});
