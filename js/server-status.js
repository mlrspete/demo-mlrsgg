const SERVER_API_URL = 'https://api.battlemetrics.com/servers/34356678';

function initServerStatus() {
  const container = document.querySelector('.server-status-container');
  if (!container) return;

  const statusDot = document.getElementById('server-status-dot');
  const statusText = document.getElementById('server-status-text');
  const nameEl = document.getElementById('server-name');
  const currentEl = document.getElementById('server-current');
  const maxEl = document.getElementById('server-max');
  const progressBar = document.getElementById('server-progress-bar');
  const connectBtn = document.getElementById('server-connect-btn');

  let connectTarget = null;

  const applyOfflineState = () => {
    statusDot.classList.remove('online');
    statusDot.classList.add('offline');
    statusText.textContent = 'OFFLINE';
    nameEl.textContent = 'Server unavailable';
    currentEl.textContent = '0';
    maxEl.textContent = '0';
    progressBar.style.width = '0%';
    connectBtn.disabled = true;
    connectBtn.setAttribute('aria-disabled', 'true');
    connectTarget = null;
  };

  const updateStatusUI = (attributes) => {
    const isOnline = attributes.status === 'online';
    statusDot.classList.toggle('online', isOnline);
    statusDot.classList.toggle('offline', !isOnline);
    statusText.textContent = isOnline ? 'ONLINE' : 'OFFLINE';

    nameEl.textContent = attributes.name || 'Unknown server';

    const currentPlayers = typeof attributes.players === 'number' ? attributes.players : 0;
    const maxPlayers = typeof attributes.maxPlayers === 'number' ? attributes.maxPlayers : 0;
    currentEl.textContent = currentPlayers;
    maxEl.textContent = maxPlayers;

    const usage = maxPlayers > 0 ? Math.min((currentPlayers / maxPlayers) * 100, 100) : 0;
    requestAnimationFrame(() => {
      progressBar.style.width = `${usage}%`;
    });

    const ip = attributes.ip;
    const port = attributes.port;
    connectTarget = ip && port ? `steam://connect/${ip}:${port}` : null;

    const enableConnect = isOnline && Boolean(connectTarget);
    connectBtn.disabled = !enableConnect;
    connectBtn.setAttribute('aria-disabled', enableConnect ? 'false' : 'true');
  };

  const fetchServerStatus = async () => {
    try {
      const response = await fetch(SERVER_API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      const attributes = payload?.data?.attributes;
      if (!attributes) {
        throw new Error('Invalid payload');
      }
      updateStatusUI(attributes);
    } catch (error) {
      console.error('Failed to load server status', error);
      applyOfflineState();
    }
  };

  connectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (connectBtn.disabled || !connectTarget) return;
    window.location.href = connectTarget;
  });

  fetchServerStatus();
  setInterval(fetchServerStatus, 60000);
}

document.addEventListener('DOMContentLoaded', initServerStatus);
