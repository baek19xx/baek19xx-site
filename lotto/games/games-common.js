// Shared helpers and analytics for mini games
(function () {
  const STORAGE_KEY = 'miniGameStats';

  function getAllStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      // ignore
    }
  }

  function trackGame(game, action, params) {
    const stats = getAllStats();
    if (!stats[game]) {
      stats[game] = { plays: 0, results: {} };
    }

    if (action === 'play') {
      stats[game].plays += 1;
      stats[game].lastPlayed = new Date().toISOString();
    }

    if (action === 'result' && params?.result) {
      const result = params.result;
      stats[game].results[result] = (stats[game].results[result] || 0) + 1;
    }

    saveStats(stats);

    if (typeof gtag === 'function') {
      gtag('event', action === 'play' ? 'game_play' : 'game_result', {
        game_name: game,
        action: action,
        ...params,
      });
    }
  }

  function getPlayCounts() {
    const stats = getAllStats();
    return Object.entries(stats)
      .map(([game, data]) => ({
        game,
        plays: data.plays || 0,
        lastPlayed: data.lastPlayed,
      }))
      .sort((a, b) => b.plays - a.plays);
  }

  function formatDateOnly(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }

  function renderStatsList(container) {
    if (!container) return;
    const list = getPlayCounts();
    if (list.length === 0) {
      container.innerHTML = '<p>아직 플레이 기록이 없습니다.</p>';
      return;
    }
    const html = list
      .map(
        (item) =>
          `<li><strong>${item.game}</strong>: ${item.plays}회 플레이` +
          (item.lastPlayed ? ` <span style="color:#9ca3af; font-size:0.85rem">(${formatDateOnly(item.lastPlayed)})</span>` : '') +
          `</li>`
      )
      .join('');
    container.innerHTML = `<ul class="history">${html}</ul>`;
  }

  window.MiniGame = {
    track: trackGame,
    getPlayCounts,
    renderStatsList,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
})();
