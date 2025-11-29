const SERVER_STATUS_API = 'https://api.battlemetrics.com/servers/34356678';
const SERVER_REFRESH_INTERVAL = 60000;

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
});
