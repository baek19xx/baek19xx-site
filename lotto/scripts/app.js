const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');
const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
const singleModeBtn = document.querySelector('.mode-btn[data-mode="single"]');
const multiModeBtn = document.querySelector('.mode-btn[data-mode="multi"]');
const drawBtn = document.getElementById('drawBtn');
const saveBtn = document.getElementById('saveBtn');
const resultsContainer = document.getElementById('resultsContainer');
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
const metaText = document.getElementById('metaText');
const resultsEyebrow = document.getElementById('resultsEyebrow');
const resultsHeading = document.getElementById('resultsHeading');
const resultsDisclaimerEl = document.getElementById('resultsDisclaimer');
const arenaCaption = document.getElementById('arenaCaption');
const infoEyebrow = document.getElementById('infoEyebrow');
const infoHeading = document.getElementById('infoHeading');
const infoIntro = document.getElementById('infoIntro');
const infoGrid = document.getElementById('infoGrid');
const responsibleEyebrow = document.getElementById('responsibleEyebrow');
const responsibleHeading = document.getElementById('responsibleHeading');
const responsibleIntro = document.getElementById('responsibleIntro');
const responsibleListEl = document.getElementById('responsibleList');
const policyEyebrow = document.getElementById('policyEyebrow');
const policyHeading = document.getElementById('policyHeading');
const policyIntro = document.getElementById('policyIntro');
const policyLegalListEl = document.getElementById('policyLegalList');
const policyPrivacyListEl = document.getElementById('policyPrivacyList');
const policySafetyListEl = document.getElementById('policySafetyList');
const oddsEyebrow = document.getElementById('oddsEyebrow');
const oddsHeading = document.getElementById('oddsHeading');
const oddsIntro = document.getElementById('oddsIntro');
const oddsGrid = document.getElementById('oddsGrid');
const contactEyebrow = document.getElementById('contactEyebrow');
const contactHeading = document.getElementById('contactHeading');
const contactIntro = document.getElementById('contactIntro');
const contactOpsList = document.getElementById('contactOpsList');
const contactSupportList = document.getElementById('contactSupportList');
const contactDocsList = document.getElementById('contactDocsList');
const footerTagline = document.getElementById('footerTagline');
const footerLegalNote = document.getElementById('footerLegalNote');
const footerYearEl = document.getElementById('footerYear');
const navLinks = {
  info: document.querySelector('[data-nav="info"]'),
  responsible: document.querySelector('[data-nav="responsible"]'),
  odds: document.querySelector('[data-nav="odds"]'),
  policy: document.querySelector('[data-nav="policy"]'),
  contact: document.querySelector('[data-nav="contact"]'),
};
const controlsStripEl = document.querySelector('.controls-strip');
const modeButtonsGroup = document.querySelector('.mode-buttons');
const footerLinksEl = document.querySelector('.footer-links');
const languageLabelEl = document.querySelector('label[for="languageSelect"]');
const languageSelect = document.getElementById('languageSelect');
const collectionZoneEl = document.getElementById('collectionZone');
const duplicateToggleEl = document.getElementById('duplicateToggle');
const duplicateToggleBtn = document.getElementById('duplicateToggleBtn');
const duplicateToggleLabelEl = document.getElementById('duplicateToggleLabel');

const NUMBER_MIN = 1;
const NUMBER_MAX = 45;
const BALL_COUNT = NUMBER_MAX;
const SPEED_MULTIPLIER = 10;
const BASE_VELOCITY = 0.35;
const HOLD_VELOCITY = 1.5;
const CENTER_COLLISION_RATIO = 0.25;
const MIN_COLLISION_THRESHOLD = 2;
const MIN_RELATIVE_SPEED = 0.35;
const COLLECTION_ZONE_OFFSET_RATIO = 0.82;
const COLLECTION_ZONE_RADIUS_RATIO = 0.12;
const NUMBER_COLORS = {
  yellow: {
    key: 'yellow',
    ballFill: '#fbc400',
    ballShadow: 'rgba(251, 196, 0, 0.55)',
    textColor: '#231400',
    pillBg: 'rgba(251, 196, 0, 0.55)',
    pillText: '#1c1200',
  },
  blue: {
    key: 'blue',
    ballFill: '#69c8f2',
    ballShadow: 'rgba(105, 200, 242, 0.55)',
    textColor: '#031225',
    pillBg: 'rgba(105, 200, 242, 0.55)',
    pillText: '#041628',
  },
  red: {
    key: 'red',
    ballFill: '#ff7272',
    ballShadow: 'rgba(255, 114, 114, 0.55)',
    textColor: '#2a0202',
    pillBg: 'rgba(255, 114, 114, 0.6)',
    pillText: '#260101',
  },
  gray: {
    key: 'gray',
    ballFill: '#aaaaaa',
    ballShadow: 'rgba(170, 170, 170, 0.6)',
    textColor: '#121212',
    pillBg: 'rgba(170, 170, 170, 0.55)',
    pillText: '#0f0f0f',
  },
  green: {
    key: 'green',
    ballFill: '#9be05a',
    ballShadow: 'rgba(155, 224, 90, 0.55)',
    textColor: '#0a1f02',
    pillBg: 'rgba(155, 224, 90, 0.55)',
    pillText: '#071602',
  },
};

function getColorKeyForNumber(number) {
  if (number <= 10) return 'yellow';
  if (number <= 20) return 'blue';
  if (number <= 30) return 'red';
  if (number <= 40) return 'gray';
  return 'green';
}

function getColorConfig(number) {
  const key = getColorKeyForNumber(number);
  return NUMBER_COLORS[key] || NUMBER_COLORS.yellow;
}

function getLanguageContent() {
  return languageContent[currentLanguage] || languageContent.ko;
}

let drawMode = 'single';
let balls = [];
let arena = { centerX: 0, centerY: 0, radius: 0 };
let collectionZone = { centerX: 0, centerY: 0, radius: 0 };
let animationFrame;
let velocityScale = BASE_VELOCITY;
let latestResults = [];
const heroDateEl = document.getElementById('heroDate');
let isHoldingDraw = false;
let hasCompletedDraw = false;
let currentLanguage = languageSelect ? languageSelect.value : 'ko';
let drawButtonMode = 'idle';
let collectionState = null;
let allowDuplicateSets = true;

function pad(num) {
  return String(num).padStart(2, '0');
}

function resizeCanvas(preservedHiddenSet = collectHiddenNumbers(latestResults)) {
  const parentWidth = canvas.clientWidth;
  const parentHeight = canvas.clientHeight;
  if (!parentWidth || !parentHeight) return;
  canvas.width = parentWidth;
  canvas.height = parentHeight;
  const diameter = Math.min(parentWidth, parentHeight);
  arena = {
    centerX: parentWidth / 2,
    centerY: parentHeight / 2,
    radius: Math.max(40, diameter / 2 - 8),
  };
  const zoneRadius = arena.radius * COLLECTION_ZONE_RADIUS_RATIO;
  collectionZone = {
    centerX: arena.centerX,
    centerY: arena.centerY - arena.radius * COLLECTION_ZONE_OFFSET_RATIO,
    radius: zoneRadius,
  };
  positionCollectionZone();
  initializeBalls(parentWidth, parentHeight, preservedHiddenSet);
}

function initializeBalls(width, height, hiddenSet = new Set()) {
  const diameter = Math.min(width, height);
  balls = Array.from({ length: BALL_COUNT }, (_, idx) => {
    const number = idx + 1;
    const baseRadius = Math.min(Math.max(12, diameter * 0.03), arena.radius * 0.25);
    const radius = Math.min(baseRadius * 2, arena.radius * 0.45);
    const speed = (0.7 + Math.random() * 0.8) * SPEED_MULTIPLIER;
    const point = randomPointWithinCircle(arena.radius - radius - 2);
    const direction = Math.random() * Math.PI * 2;
    const color = getColorConfig(number);
    const rawVx = Math.cos(direction) * speed;
    const rawVy = Math.sin(direction) * speed;
    return {
      number,
      radius,
      x: arena.centerX + point.x,
      y: arena.centerY + point.y,
      vx: rawVx,
      vy: rawVy,
      maxSpeed: speed,
      colorKey: color.key,
      color,
      visible: !hiddenSet.has(number),
      opacity: hiddenSet.has(number) ? 0 : 1,
      collectedDuringHold: false,
    };
  });
}

function randomPointWithinCircle(maxRadius) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * Math.max(0, maxRadius);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function respawnBall(ball) {
  if (!ball || !arena) return;
  const maxRadius = Math.max(0, arena.radius - ball.radius - 2);
  const point = randomPointWithinCircle(maxRadius);
  const direction = Math.random() * Math.PI * 2;
  const speed = (0.7 + Math.random() * 0.8) * SPEED_MULTIPLIER;
  ball.x = arena.centerX + point.x;
  ball.y = arena.centerY + point.y;
  ball.vx = Math.cos(direction) * speed;
  ball.vy = Math.sin(direction) * speed;
  ball.maxSpeed = speed;
}

function clampBallSpeed(ball) {
  if (!ball || !ball.maxSpeed) return;
  const limit = ball.maxSpeed;
  if (limit <= 0) return;
  const currentSpeed = Math.hypot(ball.vx, ball.vy);
  if (currentSpeed <= limit) return;
  const scale = limit / currentSpeed;
  ball.vx *= scale;
  ball.vy *= scale;
}

function positionCollectionZone() {
  if (!collectionZoneEl) return;
  const diameter = Math.max(0, collectionZone.radius * 2);
  collectionZoneEl.style.width = `${diameter}px`;
  collectionZoneEl.style.height = `${diameter}px`;
  collectionZoneEl.style.left = `${collectionZone.centerX}px`;
  collectionZoneEl.style.top = `${collectionZone.centerY}px`;
}

function setCollectionZoneActive(active) {
  if (!collectionZoneEl) return;
  collectionZoneEl.classList.toggle('active', active);
  collectionZoneEl.setAttribute('aria-hidden', active ? 'false' : 'true');
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(updatePosition);
  resolveBallCollisions();
  balls.forEach(renderBall);

  animationFrame = requestAnimationFrame(animate);
}

function updatePosition(ball) {
  ball.x += ball.vx * velocityScale;
  ball.y += ball.vy * velocityScale;

  constrainBallToArena(ball);

  const targetOpacity = ball.visible ? 1 : 0;
  ball.opacity += (targetOpacity - ball.opacity) * 0.08;

  checkCollectionZoneEntry(ball);
  clampBallSpeed(ball);
}

function constrainBallToArena(ball) {
  const dx = ball.x - arena.centerX;
  const dy = ball.y - arena.centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const limit = Math.max(0, arena.radius - ball.radius);

  if (distance <= limit || distance === 0) {
    return;
  }

  const nx = dx / distance;
  const ny = dy / distance;

  ball.x = arena.centerX + nx * limit;
  ball.y = arena.centerY + ny * limit;

  const dot = ball.vx * nx + ball.vy * ny;
  ball.vx -= 2 * dot * nx;
  ball.vy -= 2 * dot * ny;

  clampBallSpeed(ball);
}

function resolveBallCollisions() {
  for (let i = 0; i < balls.length; i += 1) {
    const a = balls[i];
    if (!a.visible && a.opacity < 0.05) continue;

    for (let j = i + 1; j < balls.length; j += 1) {
      const b = balls[j];
      if (!b.visible && b.opacity < 0.05) continue;

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distance = Math.hypot(dx, dy);
      const threshold = Math.max(
        MIN_COLLISION_THRESHOLD,
        Math.min(a.radius, b.radius) * CENTER_COLLISION_RATIO
      );

      if (distance >= threshold || threshold <= 0) continue;

      if (distance === 0) {
        const angle = Math.random() * Math.PI * 2;
        dx = Math.cos(angle) * threshold;
        dy = Math.sin(angle) * threshold;
        distance = threshold;
      }

      const nx = dx / distance;
      const ny = dy / distance;

      const midpointX = (a.x + b.x) / 2;
      const midpointY = (a.y + b.y) / 2;
      const halfSeparation = threshold / 2;

      a.x = midpointX - nx * halfSeparation;
      a.y = midpointY - ny * halfSeparation;
      b.x = midpointX + nx * halfSeparation;
      b.y = midpointY + ny * halfSeparation;

      const dvx = a.vx - b.vx;
      const dvy = a.vy - b.vy;
      let relativeVelocity = dvx * nx + dvy * ny;

      if (relativeVelocity > -MIN_RELATIVE_SPEED) {
        relativeVelocity = -MIN_RELATIVE_SPEED;
      }

      a.vx -= relativeVelocity * nx;
      a.vy -= relativeVelocity * ny;
      b.vx += relativeVelocity * nx;
      b.vy += relativeVelocity * ny;

      clampBallSpeed(a);
      clampBallSpeed(b);
    }
  }
}

function renderBall(ball) {
  if (ball.opacity <= 0.02) return;
  const color = ball.color || getColorConfig(ball.number);
  ctx.save();
  ctx.globalAlpha = ball.opacity;
  ctx.beginPath();
  ctx.fillStyle = color.ballFill;
  ctx.shadowColor = color.ballShadow;
  ctx.shadowBlur = 16;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color.textColor;
  ctx.font = `bold ${Math.max(12, ball.radius * 0.9)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText(pad(ball.number), ball.x, ball.y + 1);
  ctx.restore();
}

function collectHiddenNumbers(results) {
  const hidden = new Set();
  results.forEach(({ main, service }) => {
    main.forEach((num) => hidden.add(num));
    hidden.add(service);
  });
  return hidden;
}

function renderInfoCards(items = []) {
  if (!infoGrid) return;
  infoGrid.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'info-card';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const body = document.createElement('p');
    body.textContent = item.body;
    card.append(title, body);
    infoGrid.appendChild(card);
  });
}

function renderSimpleList(listEl, items = [], options = {}) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const { itemClass = '' } = options;
  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((text) => {
    const li = document.createElement('li');
    if (itemClass) {
      li.className = itemClass;
    }
    li.textContent = text;
    listEl.appendChild(li);
  });
}

function renderLinkList(listEl, links = [], options = {}) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const { itemClass = '' } = options;
  const safeLinks = Array.isArray(links) ? links : [];
  safeLinks.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const { label, href } = item;
    if (!label || !href) return;
    const li = document.createElement('li');
    if (itemClass) li.className = itemClass;
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = label;
    li.appendChild(anchor);
    listEl.appendChild(li);
  });
}

function renderOddsGrid(items = []) {
  if (!oddsGrid) return;
  oddsGrid.innerHTML = '';
  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'odds-card';
    const tier = document.createElement('p');
    tier.className = 'odds-tier';
    tier.textContent = item.tier || '';
    const criteria = document.createElement('p');
    criteria.className = 'odds-criteria';
    criteria.textContent = item.criteria || '';
    const probability = document.createElement('p');
    probability.className = 'odds-probability';
    probability.textContent = item.probability || '';
    card.append(tier, criteria, probability);
    oddsGrid.appendChild(card);
  });
}

function renderKeyValueList(listEl, entries = []) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const safeEntries = Array.isArray(entries) ? entries : [];
  safeEntries.forEach(({ label, value, href }) => {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    li.appendChild(strong);
    if (href) {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = value || href;
      li.appendChild(anchor);
    } else if (value) {
      const span = document.createElement('span');
      span.textContent = value;
      li.appendChild(span);
    }
    listEl.appendChild(li);
  });
}

function updateInformationalSections(content) {
  const fallbackContent = content || {};
  if (infoEyebrow) infoEyebrow.textContent = fallbackContent.infoEyebrow || '';
  if (infoHeading) infoHeading.textContent = fallbackContent.infoHeading || '';
  if (infoIntro) infoIntro.textContent = fallbackContent.infoIntro || '';
  renderInfoCards(fallbackContent.infoItems || []);

  if (responsibleEyebrow) {
    responsibleEyebrow.textContent = fallbackContent.responsibleEyebrow || '';
  }
  if (responsibleHeading) {
    responsibleHeading.textContent = fallbackContent.responsibleHeading || '';
  }
  if (responsibleIntro) {
    responsibleIntro.textContent = fallbackContent.responsibleIntro || '';
  }
  renderSimpleList(responsibleListEl, fallbackContent.responsiblePrinciples || [], { itemClass: 'pillar-item' });

  if (oddsEyebrow) oddsEyebrow.textContent = fallbackContent.oddsEyebrow || '';
  if (oddsHeading) oddsHeading.textContent = fallbackContent.oddsHeading || '';
  if (oddsIntro) oddsIntro.textContent = fallbackContent.oddsIntro || '';
  renderOddsGrid(fallbackContent.oddsItems || []);

  if (policyEyebrow) policyEyebrow.textContent = fallbackContent.policyEyebrow || '';
  if (policyHeading) policyHeading.textContent = fallbackContent.policyHeading || '';
  if (policyIntro) policyIntro.textContent = fallbackContent.policyIntro || '';
  renderSimpleList(policyLegalListEl, fallbackContent.policyLegal || []);
  renderSimpleList(policyPrivacyListEl, fallbackContent.policyPrivacy || []);
  renderSimpleList(policySafetyListEl, fallbackContent.policySafety || []);

  if (contactEyebrow) contactEyebrow.textContent = fallbackContent.contactEyebrow || '';
  if (contactHeading) contactHeading.textContent = fallbackContent.contactHeading || '';
  if (contactIntro) contactIntro.textContent = fallbackContent.contactIntro || '';
  renderKeyValueList(contactOpsList, fallbackContent.contactOps || []);
  renderKeyValueList(contactSupportList, fallbackContent.contactSupport || []);
  renderLinkList(contactDocsList, fallbackContent.contactDocs || []);

  if (footerTagline) footerTagline.textContent = fallbackContent.footerTagline || '';
  if (footerLegalNote) footerLegalNote.textContent = fallbackContent.footerLegalNote || '';
}

function setFooterYear() {
  if (!footerYearEl) return;
  footerYearEl.textContent = new Date().getFullYear();
}

function revealAllBalls() {
  balls.forEach((ball) => {
    ball.visible = true;
  });
}

function sortMainNumbers(results) {
  if (!Array.isArray(results)) return [];
  return results.map((set) => ({
    ...set,
    main: Array.isArray(set.main) ? [...set.main].sort((a, b) => a - b) : [],
  }));
}

function revealAllBalls() {
  balls.forEach((ball) => {
    ball.visible = true;
  });
}

function applyVisibilityFromResults(results) {
  const hiddenSet = collectHiddenNumbers(results);
  balls.forEach((ball) => {
    ball.visible = !hiddenSet.has(ball.number);
  });
}

function resetCollectedBallState(restoreVisibility = true, options = {}) {
  const { respawn = false } = options;
  balls.forEach((ball) => {
    if (ball.collectedDuringHold) {
      ball.collectedDuringHold = false;
      if (restoreVisibility) {
        ball.visible = true;
        ball.opacity = 1;
        if (respawn) {
          respawnBall(ball);
        }
      }
    }
  });
}

function startCollectionMode() {
  if (collectionState) return;
  const setCount = drawMode === 'single' ? 1 : 5;
  collectionState = {
    targetSets: setCount,
    sets: Array.from({ length: setCount }, (_, idx) => ({
      main: [],
      service: null,
      _index: idx + 1,
    })),
    currentSetIndex: 0,
    isComplete: false,
    allowDuplicates: drawMode === 'multi' && allowDuplicateSets,
  };
  resetCollectedBallState(true);
  setCollectionZoneActive(true);
  renderResults(collectionState.sets, { skipStore: true });
}

function endCollectionMode(options = {}) {
  if (!collectionState) {
    setCollectionZoneActive(false);
    return;
  }
  const { restoreVisibility = true, rerender = true } = options;
  setCollectionZoneActive(false);
  resetCollectedBallState(restoreVisibility);
  collectionState = null;
  if (rerender) {
    renderResults(latestResults || [], { skipStore: true });
  }
}

function checkCollectionZoneEntry(ball) {
  if (!isHoldingDraw || !collectionState || collectionState.isComplete) return;
  if (!ball.visible || ball.collectedDuringHold) return;
  const dx = ball.x - collectionZone.centerX;
  const dy = ball.y - collectionZone.centerY;
  const distance = Math.hypot(dx, dy);
  const effectiveRadius = Math.max(0, collectionZone.radius - ball.radius * 0.25);
  if (distance <= effectiveRadius) {
    registerCollectedBall(ball);
  }
}

function registerCollectedBall(ball) {
  if (!collectionState || collectionState.isComplete) return;
  const set = collectionState.sets[collectionState.currentSetIndex];
  if (!set) return;
  ball.visible = false;
  ball.collectedDuringHold = true;

  if (set.main.length < 6) {
    set.main.push(ball.number);
  } else if (typeof set.service !== 'number') {
    set.service = ball.number;
  }

  renderResults(collectionState.sets, { skipStore: true });

  if (set.main.length === 6 && typeof set.service === 'number') {
    collectionState.currentSetIndex += 1;
    if (collectionState.currentSetIndex >= collectionState.targetSets) {
      collectionState.isComplete = true;
      completeCollectionDraw();
    } else if (collectionState.allowDuplicates) {
      resetCollectedBallState(true, { respawn: true });
    }
  }
}

function completeCollectionDraw() {
  finalizeCollectionResults({ fromAuto: true });
}

function buildResultsFromCollection() {
  if (!collectionState) return [];
  return collectionState.sets.map((set) => ({
    main: [...set.main],
    service: set.service,
    _index: set._index,
  }));
}

function finalizeCollectionResults({ fromAuto = false } = {}) {
  if (!collectionState || !collectionState.isComplete) return false;
  if (fromAuto) {
    cleanupHoldListeners();
    isHoldingDraw = false;
    drawBtn.classList.remove('holding');
  }
  const finalizedSets = sortMainNumbers(buildResultsFromCollection());
  finalizeDraw(finalizedSets);
  endCollectionMode({ restoreVisibility: false, rerender: false });
  return true;
}

function drawFromPool(pool) {
  if (!pool || !pool.length) return null;
  const pickIndex = Math.floor(Math.random() * pool.length);
  const [value] = pool.splice(pickIndex, 1);
  return value;
}

function generateSingleSetFromPool(pool) {
  if (!pool) {
    const freshPool = Array.from({ length: NUMBER_MAX - NUMBER_MIN + 1 }, (_, idx) => NUMBER_MIN + idx);
    return generateSingleSetFromPool(freshPool);
  }
  const main = [];
  while (main.length < 6 && pool.length) {
    const value = drawFromPool(pool);
    if (typeof value === 'number') main.push(value);
  }
  main.sort((a, b) => a - b);
  const serviceValue = drawFromPool(pool);
  return { main, service: typeof serviceValue === 'number' ? serviceValue : null };
}

function generateSingleSet() {
  const pool = Array.from({ length: NUMBER_MAX - NUMBER_MIN + 1 }, (_, idx) => NUMBER_MIN + idx);
  return generateSingleSetFromPool(pool);
}

function generateResults(count) {
  const useDuplicates = drawMode === 'multi' && allowDuplicateSets;
  if (useDuplicates) {
    return Array.from({ length: count }, (_, idx) => ({
      ...generateSingleSet(),
      _index: idx + 1,
    }));
  }

  const sharedPool = Array.from({ length: NUMBER_MAX - NUMBER_MIN + 1 }, (_, i) => NUMBER_MIN + i);
  return Array.from({ length: count }, (_, idx) => ({
    ...generateSingleSetFromPool(sharedPool),
    _index: idx + 1,
  }));
}

function renderResults(resultsArg, options = {}) {
  const { skipStore = false } = options;
  const content = getLanguageContent();
  const results = Array.isArray(resultsArg) ? resultsArg : latestResults;
  if (!skipStore) {
    latestResults = results;
  }
  const hasResults = Array.isArray(results) && results.length;
  if (!hasResults) {
    resultsContainer.classList.add('empty');
    resultsContainer.innerHTML = `<p>${content.emptyMessage}</p>`;
    if (!skipStore) {
      latestResults = [];
    }
    return;
  }

  resultsContainer.classList.remove('empty');
  resultsContainer.innerHTML = '';

  results.forEach((set, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-set';

    const label = document.createElement('p');
    label.className = 'label';
    const labelIndex = set._index ?? idx + 1;
    label.textContent = `${content.setLabel} ${labelIndex}`;

    const numbersBox = document.createElement('div');
    numbersBox.className = 'result-numbers';

    (set.main || []).forEach((num) => {
      numbersBox.appendChild(createNumberPill(num));
    });

    if (typeof set.service === 'number') {
      const divider = document.createElement('span');
      divider.className = 'service-divider';
      divider.textContent = '+';
      numbersBox.appendChild(divider);
      numbersBox.appendChild(createNumberPill(set.service, true));
    }

    wrapper.append(label, numbersBox);
    resultsContainer.appendChild(wrapper);
  });
}

function createNumberPill(value, service = false) {
  const pill = document.createElement('span');
  const color = getColorConfig(value);
  pill.className = `number-pill color-${color.key}` + (service ? ' service' : '');
  pill.textContent = pad(value);
  return pill;
}

function syncDuplicateToggleState() {
  if (!duplicateToggleEl || !duplicateToggleBtn) return;
  const content = getLanguageContent();
  const enabled = drawMode === 'multi';
  const pressed = enabled ? allowDuplicateSets : false;

  duplicateToggleEl.classList.toggle('disabled', !enabled);
  duplicateToggleEl.classList.toggle('active', pressed);

  duplicateToggleBtn.disabled = !enabled;
  duplicateToggleBtn.classList.toggle('active', pressed);
  duplicateToggleBtn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  duplicateToggleBtn.setAttribute('aria-label', content.duplicateLabel || '');

  if (duplicateToggleLabelEl) {
    duplicateToggleLabelEl.textContent = content.duplicateLabel || '';
  }
}

function handleDuplicateToggleClick() {
  if (drawMode !== 'multi') return;
  allowDuplicateSets = !allowDuplicateSets;
  syncDuplicateToggleState();
}

function handleModeChange(targetMode) {
  if (drawMode === targetMode) return;
  drawMode = targetMode;
  modeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === drawMode);
  });
  syncDuplicateToggleState();
}

function beginDrawHold(event) {
  if (drawBtn.disabled || isHoldingDraw) return;
  if (event.type === 'pointerdown' && event.pointerType === 'mouse' && event.button !== 0) return;
  isHoldingDraw = true;
  drawButtonMode = 'holding';
  drawBtn.classList.add('holding');
  revealAllBalls();
  velocityScale = HOLD_VELOCITY;
  startCollectionMode();
  updateDrawButtonLabel();
  window.addEventListener('pointerup', releaseDrawHold);
  window.addEventListener('pointercancel', cancelDrawHold);
}

function handleDrawKeyDown(event) {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    beginDrawHold(event);
  }
}

function handleDrawKeyUp(event) {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    releaseDrawHold();
  }
}

function releaseDrawHold() {
  if (!isHoldingDraw) return;
  cleanupHoldListeners();
  isHoldingDraw = false;
  drawBtn.classList.remove('holding');
  if (collectionState) {
    if (!finalizeCollectionResults()) {
      endCollectionMode({ restoreVisibility: true });
      finalizeDraw();
    }
  } else {
    finalizeDraw();
  }
}

function cancelDrawHold() {
  if (!isHoldingDraw) return;
  cleanupHoldListeners();
  isHoldingDraw = false;
  drawBtn.classList.remove('holding');
  drawButtonMode = 'idle';
  velocityScale = BASE_VELOCITY;
  updateDrawButtonLabel();
  if (collectionState) {
    endCollectionMode({ restoreVisibility: true });
  }
}

function cleanupHoldListeners() {
  window.removeEventListener('pointerup', releaseDrawHold);
  window.removeEventListener('pointercancel', cancelDrawHold);
}

function finalizeDraw(resultsOverride = null) {
  drawButtonMode = 'preparing';
  updateDrawButtonLabel();
  drawBtn.disabled = true;

  const setCount = drawMode === 'single' ? 1 : 5;
  const results =
    Array.isArray(resultsOverride) && resultsOverride.length
      ? resultsOverride
      : generateResults(setCount);

  const sortedResults = sortMainNumbers(results);
  finalizeDrawWithResults(sortedResults);
}

function finalizeDrawWithResults(results) {
  renderResults(results);
  applyVisibilityFromResults(results);
  velocityScale = BASE_VELOCITY;
  drawBtn.disabled = false;
  hasCompletedDraw = true;
  drawButtonMode = 'idle';
  updateDrawButtonLabel();
  saveBtn.disabled = false;
}

function handleSave() {
  if (!latestResults.length) return;
  const timestamp = new Date()
    .toISOString()
    .replace(/[:T]/g, '-')
    .split('.')[0];
  const filename = `lux-lotto-${timestamp}.txt`;
  const lines = latestResults.map((set, idx) => {
    const main = set.main.map(pad).join(', ');
    const service = pad(set.service);
    return `세트 ${idx + 1}: ${main} + ${service}`;
  });
  const content = `럭스 로또 추첨 결과\n${lines.join('\n')}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function bindEvents() {
  modeButtons.forEach((btn) =>
    btn.addEventListener('click', () => handleModeChange(btn.dataset.mode))
  );
  drawBtn.addEventListener('pointerdown', beginDrawHold);
  drawBtn.addEventListener('keydown', handleDrawKeyDown);
  drawBtn.addEventListener('keyup', handleDrawKeyUp);
  saveBtn.addEventListener('click', handleSave);
  if (duplicateToggleBtn) {
    duplicateToggleBtn.addEventListener('click', handleDuplicateToggleClick);
  }
  if (languageSelect) {
    languageSelect.addEventListener('change', handleLanguageChange);
  }
  window.addEventListener('resize', () => resizeCanvas());
}

function init() {
  bindEvents();
  resizeCanvas();
  renderResults([]);
  updateHeroDate();
  setFooterYear();
  handleLanguageChange();
  if (!animationFrame) {
    animate();
  }
}

function updateHeroDate() {
  if (!heroDateEl) return;
  const now = new Date();
  const content = getLanguageContent();
  const days = content.weekdayNames || ['일', '월', '화', '수', '목', '금', '토'];
  const suffix = content.weekdaySuffix ?? '요일';
  const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}.${String(now.getDate()).padStart(2, '0')} · ${days[now.getDay()]}${suffix}`;
  heroDateEl.textContent = formatted;
}

const languageContent = {
  ko: {
    title: '랜덤 로또 스튜디오',
    subtitle:
      '다섯 개의 기본 숫자와 서비스 번호까지, 단일 세트 또는 5세트 추첨을 마음껏 즐겨보세요. 결과는 즉시 저장할 수도 있습니다.',
    drawButton: '추첨 시작',
    redrawButton: '다시 추첨',
    holdPrompt: '추첨 중...',
    preparingText: '추첨 준비 중...',
    saveButton: '결과 저장',
    meta: '버튼을 누른 채 12시 방향 수집 존에 닿은 공은 즉시 집계되고, 손을 떼면 남은 번호가 한 번에 완성됩니다.',
    resultsLabel: '이번 라운드 결과',
    resultsEyebrow: 'RESULTS',
    resultsDisclaimer: '본 서비스는 시뮬레이션이며 금전적 보상을 제공하지 않습니다.',
    arenaCaption: '빠르게 튀어다니는 공에서 번호가 사라지면 추첨 결과에 포함된 것입니다.',
    emptyMessage: '아직 추첨이 진행되지 않았습니다.',
    setLabel: '세트',
    singleSet: '1 세트',
    multiSet: '5 세트',
    duplicateLabel: '5세트 세트마다 번호 중복 허용',
    languageLabel: '언어 선택',
    controlsAriaLabel: '추첨 제어',
    modeAriaLabel: '추첨 모드 선택',
    footerLinksLabel: '푸터 탐색',
    navLinks: {
      info: '소개',
      responsible: '책임 이용',
      odds: '확률',
      policy: '정책',
      contact: '문의',
    },
    weekdayNames: ['일', '월', '화', '수', '목', '금', '토'],
    weekdaySuffix: '요일',
    infoEyebrow: 'ABOUT',
    infoHeading: '서비스 소개',
    infoIntro: '데이터 무결성과 투명한 기록 방식을 바탕으로 로또 추첨 과정을 재현합니다.',
    infoItems: [
      { title: '실시간 시뮬레이션', body: '공의 움직임과 수집 존 동작을 통해 실제 추첨 흐름을 체험할 수 있습니다.' },
      { title: '다국어 지원', body: '한국어 · 영어 · 일본어 UI와 결과 표기를 동일한 품질로 제공합니다.' },
      { title: '결과 보관', body: '추첨 결과를 정렬된 텍스트 파일로 저장해 기록 관리에 활용할 수 있습니다.' },
    ],
    responsibleEyebrow: 'RESPONSIBLE PLAY',
    responsibleHeading: '책임감 있는 이용 안내',
    responsibleIntro:
      '본 서비스는 학습과 엔터테인먼트를 위한 시뮬레이션이며 실제 복권 구매 또는 금전적 이익을 제공하지 않습니다.',
    responsiblePrinciples: [
      '19세 미만 사용자는 실제 복권 구매를 권장하지 않습니다.',
      '과도한 몰입을 피하고 휴식 시간을 확보하세요.',
      '결과 저장 파일은 개인 용도로 사용하고 타인의 데이터와 혼동하지 마세요.',
    ],
    oddsEyebrow: 'ODDS',
    oddsHeading: '로또 확률 해설',
    oddsIntro: '각 등위별 당첨 조건과 확률을 알아두면 시뮬레이션 결과를 더욱 현실적으로 해석할 수 있습니다.',
    oddsItems: [
      { tier: '1등', criteria: '6개 번호 모두 일치', probability: '1 / 8,145,060 (약 0.000012%)' },
      { tier: '2등', criteria: '5개 일치 + 보너스', probability: '1 / 1,357,510 (약 0.000074%)' },
      { tier: '3등', criteria: '5개 번호 일치', probability: '1 / 35,724 (약 0.0028%)' },
      { tier: '4등', criteria: '4개 번호 일치', probability: '1 / 733 (약 0.136%)' },
      { tier: '5등', criteria: '3개 번호 일치', probability: '1 / 45 (약 2.22%)' },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: '투명한 운영 약속',
    policyIntro: '운영 범위와 데이터 처리 방식을 공개해 Ads 품질 정책을 준수합니다.',
    policyLegal: [
      '본 서비스는 가상 시뮬레이터이며 복권 당첨을 보장하지 않습니다.',
      '모든 저작물은 Lux Lotto Studio 소유 또는 사용 허가 범위 내에서 제공됩니다.',
    ],
    policyPrivacy: [
      '로컬 저장소에 한정된 최소 정보만 사용합니다.',
      '클라우드로 전송되는 개인정보는 없습니다.',
    ],
    policySafety: [
      '새로운 기능 배포 시 수동 QA를 거칩니다.',
      '오류 신고는 지원 채널(문의 폼)로 접수해 주세요.',
    ],
    contactEyebrow: 'CONTACT',
    contactHeading: '문의 및 운영 정보',
    contactIntro: '운영자 정보와 지원 채널을 아래에서 확인하세요.',
    contactOps: [
      { label: '운영자', value: 'Lux Lotto Studio · 대표 baek19xx' },
      { label: '위치', value: 'Gyeonggi-do, Republic of Korea' },
      { label: '서비스 형태', value: '웹 기반 로또 시뮬레이터' },
    ],
    contactSupport: [
      {
        label: '문의 폼',
        href: 'https://docs.google.com/forms/d/e/1FAIpQLSfyPtHya7JUqWoOUq8ok3YVrRoW8YQEfYXdy0zhwsClfEnPLg/viewform?usp=dialog',
        value: 'Google Form 링크',
      },
    ],
    contactDocs: [
      { label: '이용약관', href: './terms.html' },
      { label: '개인정보 처리방침', href: './privacy.html' },
      { label: 'Responsible Play 가이드', href: './responsible-play.html' },
    ],
    footerTagline: '투명하고 책임감 있는 로또 시뮬레이션을 제공합니다.',
    footerLegalNote: '무단 복제 및 상업적 이용 금지.',
  },
  en: {
    title: 'Random Lotto Studio',
    subtitle:
      'Enjoy drawing either a single set or five sets of numbers, including a bonus ball. Save your outcomes instantly.',
    drawButton: 'Start Draw',
    redrawButton: 'Draw Again',
    holdPrompt: 'Drawing...',
    preparingText: 'Preparing draw...',
    saveButton: 'Save Results',
    meta: 'Hold the button and guide balls through the 12 o’clock collection zone; releasing fills any remaining slots instantly.',
    resultsLabel: 'Results of this round',
    resultsEyebrow: 'RESULTS',
    arenaCaption: 'Balls that fade out have been captured for the draw results.',
    emptyMessage: 'No draws yet.',
    setLabel: 'Set',
    singleSet: '1 Set',
    multiSet: '5 Sets',
    duplicateLabel: 'Allow duplicates (5-set mode)',
    duplicateHelperEnabled: 'Resets the number pool each set so duplicates may appear.',
    duplicateHelperDisabled: 'Enable 5-set mode to use this option.',
    languageLabel: 'Choose language',
    controlsAriaLabel: 'Draw controls',
    modeAriaLabel: 'Select draw mode',
    footerLinksLabel: 'Footer navigation',
    navLinks: {
      info: 'Overview',
      responsible: 'Responsible Play',
      odds: 'Odds',
      policy: 'Policy',
      contact: 'Contact',
    },
    weekdayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaySuffix: '',
    infoEyebrow: 'ABOUT',
    infoHeading: 'What We Offer',
    infoIntro: 'We recreate the lottery draw journey with transparent physics, data integrity, and multilingual UI.',
    infoItems: [
      { title: 'Live Simulation', body: 'Watch physics-based balls bounce and enter the 12 o’clock collection zone in real time.' },
      { title: 'Localized Experience', body: 'Switch seamlessly between Korean, English, and Japanese copy.' },
      { title: 'Result Export', body: 'Save sorted draw sets as plain-text logs for audit-friendly storage.' },
    ],
    responsibleEyebrow: 'RESPONSIBLE PLAY',
    responsibleHeading: 'Responsible Use Guidelines',
    responsibleIntro:
      'This simulator does not sell tickets or guarantee financial gain. Use it to understand odds and draw flows.',
    responsiblePrinciples: [
      'Do not treat simulated draws as investment advice.',
      'Set clear time limits for use and take frequent breaks.',
      'Keep saved result files private if they include personal annotations.',
    ],
    oddsEyebrow: 'ODDS',
    oddsHeading: 'Understanding Lotto Odds',
    oddsIntro: 'Reference the official prize tiers and odds to ground your expectations while experimenting.',
    oddsItems: [
      { tier: '1st Prize', criteria: 'Match 6 numbers', probability: '1 / 8,145,060 (~0.000012%)' },
      { tier: '2nd Prize', criteria: 'Match 5 + Bonus', probability: '1 / 1,357,510 (~0.000074%)' },
      { tier: '3rd Prize', criteria: 'Match 5 numbers', probability: '1 / 35,724 (~0.0028%)' },
      { tier: '4th Prize', criteria: 'Match 4 numbers', probability: '1 / 733 (~0.136%)' },
      { tier: '5th Prize', criteria: 'Match 3 numbers', probability: '1 / 45 (~2.22%)' },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: 'Transparency Pledge',
    policyIntro: 'We document policies that align with Google AdSense and local regulations.',
    policyLegal: [
      'All content is provided “as-is” for educational and entertainment purposes.',
      'Users remain responsible for complying with local lottery regulations.',
    ],
    policyPrivacy: [
      'No personal data is transmitted to remote servers.',
      'Saved results stay on your device unless you share them manually.',
    ],
    policySafety: [
      'Major releases undergo manual QA and accessibility review.',
      'Please use the contact form to report bugs or issues.',
    ],
    contactEyebrow: 'CONTACT',
    contactHeading: 'Reach the Team',
    contactIntro: 'Use the following channels for partnership or support requests.',
    contactOps: [
      { label: 'Operator', value: 'Lux Lotto Studio · baek19xx' },
      { label: 'Location', value: 'Gyeonggi-do, Republic of Korea' },
      { label: 'Service', value: 'Web-based lottery simulator' },
    ],
    contactSupport: [
      {
        label: 'Contact Form',
        href: 'https://docs.google.com/forms/d/e/1FAIpQLSfyPtHya7JUqWoOUq8ok3YVrRoW8YQEfYXdy0zhwsClfEnPLg/viewform?usp=dialog',
        value: 'Google Form',
      },
    ],
    contactDocs: [
      { label: 'Terms of Use', href: './terms.html' },
      { label: 'Privacy Policy', href: './privacy.html' },
      { label: 'Responsible Play Guide', href: './responsible-play.html' },
    ],
    footerTagline: 'Delivering transparent, responsible lottery simulations.',
    footerLegalNote: 'All rights reserved.',
  },
  ja: {
    title: 'ランダムロトスタジオ',
    subtitle:
      '基本5個とサービス番号まで、1セットまたは5セットの抽選を自由に楽しめます。結果はすぐに保存できます。',
    drawButton: '抽選開始',
    redrawButton: 'もう一度抽選',
    holdPrompt: '抽選中...',
    preparingText: '抽選を準備中...',
    saveButton: '結果を保存',
    meta: 'ボタンを押しながら12時方向の収集ゾーンに触れたボールは順次記録され、指を離すと残りが一気に完成します。',
    resultsLabel: '今回の結果',
    resultsEyebrow: '結果',
    resultsDisclaimer: '本サービスはシミュレーションであり、金銭的な報酬は提供しません。',
    arenaCaption: '光が消えたボールは抽選結果に含まれています。',
    emptyMessage: 'まだ抽選が実行されていません。',
    setLabel: 'セット',
    singleSet: '1 セット',
    multiSet: '5 セット',
    duplicateLabel: '5セット・重複番号を許可',
    duplicateHelperEnabled: '各セットごとに番号プールを初期化し、重複を許可します。',
    duplicateHelperDisabled: '5セットモードでのみ利用できます。',
    languageLabel: '言語を選択',
    controlsAriaLabel: '抽選コントロール',
    modeAriaLabel: 'モード選択',
    footerLinksLabel: 'フッターナビゲーション',
    navLinks: {
      info: '紹介',
      responsible: '責任ある利用',
      odds: '確率',
      policy: 'ポリシー',
      contact: 'お問い合わせ',
    },
    weekdayNames: ['日', '月', '火', '水', '木', '金', '土'],
    weekdaySuffix: '曜',
    infoEyebrow: 'ABOUT',
    infoHeading: 'サービス概要',
    infoIntro: '透明性の高い物理シミュレーションと多言語UIで抽選体験を再現します。',
    infoItems: [
      { title: 'ライブシミュレーション', body: '物理演算されたボールが12時方向のゾーンに入る様子をリアルタイムで確認できます。' },
      { title: '多言語表示', body: '韓国語・英語・日本語に即座に切り替え可能です。' },
      { title: '結果保存', body: '並び替え済みの抽選結果をテキストに保存し、記録として活用できます。' },
    ],
    responsibleEyebrow: 'RESPONSIBLE PLAY',
    responsibleHeading: '責任ある利用ガイド',
    responsibleIntro: '本サービスは学習・娯楽用シミュレーターであり、金銭的利益や当選を保証しません。',
    responsiblePrinciples: [
      '未成年の実際の宝くじ購入は推奨されません。',
      '長時間の連続利用を避け、適度に休憩を取りましょう。',
      '結果ファイルを共有する際は個人情報に注意してください。',
    ],
    oddsEyebrow: 'ODDS',
    oddsHeading: 'ロト確率ガイド',
    oddsIntro: '各等級の条件と当選確率を把握すると、シミュレーション結果の意味を理解しやすくなります。',
    oddsItems: [
      { tier: '1等', criteria: '6個すべて一致', probability: '1 / 8,145,060 (約0.000012%)' },
      { tier: '2等', criteria: '5個一致 + ボーナス', probability: '1 / 1,357,510 (約0.000074%)' },
      { tier: '3等', criteria: '5個一致', probability: '1 / 35,724 (約0.0028%)' },
      { tier: '4等', criteria: '4個一致', probability: '1 / 733 (約0.136%)' },
      { tier: '5等', criteria: '3個一致', probability: '1 / 45 (約2.22%)' },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: '透明性へのコミットメント',
    policyIntro: '利用規約やデータ方針を公開し、Google AdSenseの品質基準に準拠します。',
    policyLegal: [
      '本サービスは教育・エンタメ目的で提供されます。',
      '地域の宝くじ規制や年齢制限の遵守は利用者の責任です。',
    ],
    policyPrivacy: [
      '個人情報はデバイス内にのみ保存され、外部送信しません。',
      '保存データはユーザー自身が管理できます。',
    ],
    policySafety: [
      '主要リリース時には手動テストとアクセシビリティ確認を行います。',
      '不具合はお問い合わせフォームからご連絡ください。',
    ],
    contactEyebrow: 'CONTACT',
    contactHeading: 'お問い合わせ',
    contactIntro: '運営情報と連絡先は以下をご確認ください。',
    contactOps: [
      { label: '運営', value: 'Lux Lotto Studio · baek19xx' },
      { label: '所在地', value: '韓国 京畿道' },
      { label: 'サービス形態', value: 'Webベースのロトシミュレーター' },
    ],
    contactSupport: [
      {
        label: 'お問い合わせフォーム',
        href: 'https://docs.google.com/forms/d/e/1FAIpQLSfyPtHya7JUqWoOUq8ok3YVrRoW8YQEfYXdy0zhwsClfEnPLg/viewform?usp=dialog',
        value: 'Googleフォーム',
      },
    ],
    contactDocs: [
      { label: '利用規約', href: './terms.html' },
      { label: 'プライバシーポリシー', href: './privacy.html' },
      { label: '責任あるプレイガイド', href: './responsible-play.html' },
    ],
    footerTagline: '透明性と責任を重視したロトシミュレーションを提供します。',
    footerLegalNote: '無断転載・商用利用を禁じます。',
  },
};

function handleLanguageChange() {
  const lang = languageSelect ? languageSelect.value : 'ko';
  currentLanguage = lang;
  const content = languageContent[lang] || languageContent.ko;
  if (heroTitle) heroTitle.textContent = content.title;
  if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
  if (saveBtn) saveBtn.textContent = content.saveButton;
  if (metaText) metaText.textContent = content.meta;
  if (resultsHeading) resultsHeading.textContent = content.resultsLabel;
  if (resultsEyebrow) resultsEyebrow.textContent = content.resultsEyebrow;
  if (resultsDisclaimerEl) resultsDisclaimerEl.textContent = content.resultsDisclaimer || '';
  if (arenaCaption) arenaCaption.textContent = content.arenaCaption;
  updateInformationalSections(content);
  updateModeButtonLabels();
  updateDrawButtonLabel();
  updateHeroDate();
  syncDuplicateToggleState();
  renderResults();
}

function updateDrawButtonLabel() {
  if (!drawBtn) return;
  const content = languageContent[currentLanguage] || languageContent.ko;
  if (drawButtonMode === 'holding') {
    drawBtn.textContent = content.holdPrompt;
    return;
  }
  if (drawButtonMode === 'preparing') {
    drawBtn.textContent = content.preparingText;
    return;
  }
  const label = hasCompletedDraw ? content.redrawButton : content.drawButton;
  drawBtn.textContent = label;
}

function updateModeButtonLabels() {
  const content = getLanguageContent();
  if (singleModeBtn) singleModeBtn.textContent = content.singleSet;
  if (multiModeBtn) multiModeBtn.textContent = content.multiSet;
}

init();
