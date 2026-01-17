function scrollToDrawSection() {
  if (!experienceLayoutEl) return;
  if (window.innerWidth <= 768 && controlsStripEl) {
    const controlsRect = controlsStripEl.getBoundingClientRect();
    const targetTop = window.scrollY + controlsRect.bottom - window.innerHeight + 24;
    const destination = Math.max(targetTop, 0);
    window.scrollTo({ top: destination, behavior: 'smooth' });
    return;
  }
  experienceLayoutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleScrollButtonVisibility() {
  if (!scrollToDrawBtn) return;
  const shouldShow = window.scrollY > 400;
  if (shouldShow === scrollBtnVisible) return;
  scrollBtnVisible = shouldShow;
  scrollToDrawBtn.classList.toggle('visible', shouldShow);
}

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
const faqEyebrow = document.getElementById('faqEyebrow');
const faqHeading = document.getElementById('faqHeading');
const faqIntro = document.getElementById('faqIntro');
const faqList = document.getElementById('faqList');
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
const policyLegalTitle = document.getElementById('policyLegalTitle');
const policyPrivacyTitle = document.getElementById('policyPrivacyTitle');
const policySafetyTitle = document.getElementById('policySafetyTitle');
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
const contactOpsTitle = document.getElementById('contactOpsTitle');
const contactSupportTitle = document.getElementById('contactSupportTitle');
const contactDocsTitle = document.getElementById('contactDocsTitle');
const contactOpsList = document.getElementById('contactOpsList');
const contactSupportList = document.getElementById('contactSupportList');
const contactDocsList = document.getElementById('contactDocsList');
const scrollToDrawBtn = document.getElementById('scrollToDrawBtn');
const footerTagline = document.getElementById('footerTagline');
const footerLegalNote = document.getElementById('footerLegalNote');
const footerYearEl = document.getElementById('footerYear');
const primaryNav = document.querySelector('.primary-nav');
const footerDocsEl = document.querySelector('.footer-docs');
const navLinks = {
  info: document.querySelectorAll('[data-nav="info"]'),
  responsible: document.querySelectorAll('[data-nav="responsible"]'),
  odds: document.querySelectorAll('[data-nav="odds"]'),
  policy: document.querySelectorAll('[data-nav="policy"]'),
  faq: document.querySelectorAll('[data-nav="faq"]'),
  contact: document.querySelectorAll('[data-nav="contact"]'),
  privacy: document.querySelectorAll('[data-nav="privacy"]'),
  terms: document.querySelectorAll('[data-nav="terms"]'),
  responsibleDoc: document.querySelectorAll('[data-nav="responsibleDoc"]'),
};
const controlsStripEl = document.querySelector('.controls-strip');
const experienceLayoutEl = document.querySelector('.experience-layout');
const modeButtonsGroup = document.querySelector('.mode-buttons');
const footerLinksEl = document.querySelector('.footer-links');
const languageLabelEl = document.querySelector('label[for="languageSelect"]');
const languageSelect = document.getElementById('languageSelect');
const collectionZoneEl = document.getElementById('collectionZone');
const duplicateToggleEl = document.getElementById('duplicateToggle');
const duplicateToggleBtn = document.getElementById('duplicateToggleBtn');
const duplicateToggleLabelEl = document.getElementById('duplicateToggleLabel');
const LANGUAGE_STORAGE_KEY = 'luxLanguage';

function readStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function persistLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    /* noop */
  }
}

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

function fillMissingNumbersFromPool(set, pool) {
  if (!set || !Array.isArray(pool)) return;
  while (set.main.length < 6 && pool.length) {
    const value = drawFromPool(pool);
    if (typeof value === 'number') {
      set.main.push(value);
    }
  }
  set.main.sort((a, b) => a - b);
  if (typeof set.service !== 'number' && pool.length) {
    set.service = drawFromPool(pool);
  }
}

function buildPoolForSet(set) {
  const used = new Set(set.main || []);
  if (typeof set.service === 'number') {
    used.add(set.service);
  }
  return createNumberPool(used);
}

function createNumberPool(exclusions = new Set()) {
  const pool = [];
  for (let value = NUMBER_MIN; value <= NUMBER_MAX; value += 1) {
    if (!exclusions.has(value)) {
      pool.push(value);
    }
  }
  return pool;
}

function collectUsedNumbersFromSets(sets = []) {
  const used = new Set();
  sets.forEach((set) => {
    (set.main || []).forEach((num) => used.add(num));
    if (typeof set.service === 'number') {
      used.add(set.service);
    }
  });
  return used;
}

function autoCompleteCollectionSets() {
  if (!collectionState || !Array.isArray(collectionState.sets)) return false;
  const { sets, allowDuplicates, targetSets } = collectionState;
  const useSharedPool = targetSets > 1 && !allowDuplicates;
  if (useSharedPool) {
    const used = collectUsedNumbersFromSets(sets);
    const pool = createNumberPool(used);
    sets.forEach((set) => {
      if (set.main.length === 6 && typeof set.service === 'number') return;
      fillMissingNumbersFromPool(set, pool);
    });
  } else {
    sets.forEach((set) => {
      if (set.main.length === 6 && typeof set.service === 'number') return;
      const pool = buildPoolForSet(set);
      fillMissingNumbersFromPool(set, pool);
    });
  }
  const allComplete = sets.every((set) => set.main.length === 6 && typeof set.service === 'number');
  if (allComplete) {
    collectionState.isComplete = true;
  }
  return allComplete;
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
const storedLanguage = readStoredLanguage();
if (languageSelect && storedLanguage) {
  const hasOption = Array.from(languageSelect.options).some((option) => option.value === storedLanguage);
  if (hasOption) {
    languageSelect.value = storedLanguage;
  }
}
let currentLanguage = storedLanguage || (languageSelect ? languageSelect.value : 'ko');
document.documentElement.setAttribute('lang', currentLanguage);
let drawButtonMode = 'idle';
let collectionState = null;
let allowDuplicateSets = true;
let activePointerId = null;
let scrollBtnVisible = false;

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

function renderFaqList(items = []) {
  if (!faqList) return;
  faqList.innerHTML = '';
  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'faq-item';

    const question = document.createElement('h3');
    question.textContent = item.question || '';

    const answer = document.createElement('p');
    answer.textContent = item.answer || '';

    card.append(question, answer);
    faqList.appendChild(card);
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

  if (faqEyebrow) faqEyebrow.textContent = fallbackContent.faqEyebrow || '';
  if (faqHeading) faqHeading.textContent = fallbackContent.faqHeading || '';
  if (faqIntro) faqIntro.textContent = fallbackContent.faqIntro || '';
  renderFaqList(fallbackContent.faqItems || []);

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
  if (policyLegalTitle) policyLegalTitle.textContent = fallbackContent.policyLegalTitle || '';
  if (policyPrivacyTitle) policyPrivacyTitle.textContent = fallbackContent.policyPrivacyTitle || '';
  if (policySafetyTitle) policySafetyTitle.textContent = fallbackContent.policySafetyTitle || '';
  renderSimpleList(policyLegalListEl, fallbackContent.policyLegal || []);
  renderSimpleList(policyPrivacyListEl, fallbackContent.policyPrivacy || []);
  renderSimpleList(policySafetyListEl, fallbackContent.policySafety || []);

  if (contactEyebrow) contactEyebrow.textContent = fallbackContent.contactEyebrow || '';
  if (contactHeading) contactHeading.textContent = fallbackContent.contactHeading || '';
  if (contactIntro) contactIntro.textContent = fallbackContent.contactIntro || '';
  if (contactOpsTitle) contactOpsTitle.textContent = fallbackContent.contactOpsTitle || '';
  if (contactSupportTitle) contactSupportTitle.textContent = fallbackContent.contactSupportTitle || '';
  if (contactDocsTitle) contactDocsTitle.textContent = fallbackContent.contactDocsTitle || '';
  renderKeyValueList(contactOpsList, fallbackContent.contactOps || []);
  renderKeyValueList(contactSupportList, fallbackContent.contactSupport || []);
  renderLinkList(contactDocsList, fallbackContent.contactDocs || []);

  if (footerTagline) footerTagline.textContent = fallbackContent.footerTagline || '';
  if (footerLegalNote) footerLegalNote.textContent = fallbackContent.footerLegalNote || '';
}

function updateNavigation(content) {
  if (!content) return;
  if (primaryNav && content.primaryNavLabel) {
    primaryNav.setAttribute('aria-label', content.primaryNavLabel);
  }
  if (footerLinksEl && content.footerLinksLabel) {
    footerLinksEl.setAttribute('aria-label', content.footerLinksLabel);
  }
  if (footerDocsEl && content.footerDocsLabel) {
    footerDocsEl.setAttribute('aria-label', content.footerDocsLabel);
  }
  const labels = content.navLinks || {};
  Object.entries(navLinks).forEach(([key, elements]) => {
    const label = labels[key];
    if (!label || !elements) return;
    elements.forEach((element) => {
      if (element) element.textContent = label;
    });
  });
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
  if (event.cancelable) {
    event.preventDefault();
  }
  isHoldingDraw = true;
  if (event.pointerId !== undefined && drawBtn.setPointerCapture) {
    activePointerId = event.pointerId;
    try {
      drawBtn.setPointerCapture(activePointerId);
    } catch (_) {
      activePointerId = null;
    }
  } else {
    activePointerId = null;
  }
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
  if (activePointerId !== null && drawBtn.releasePointerCapture) {
    try {
      drawBtn.releasePointerCapture(activePointerId);
    } catch (_) {
      // ignore
    }
    activePointerId = null;
  }
  cleanupHoldListeners();
  isHoldingDraw = false;
  drawBtn.classList.remove('holding');
  if (collectionState) {
    if (!collectionState.isComplete) {
      autoCompleteCollectionSets({ forceComplete: true });
    }
    finalizeCollectionResults();
  } else {
    finalizeDraw();
  }
}

function cancelDrawHold() {
  if (!isHoldingDraw) return;
  releaseDrawHold();
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
  if (scrollToDrawBtn) {
    scrollToDrawBtn.addEventListener('click', scrollToDrawSection);
    window.addEventListener('scroll', handleScrollButtonVisibility, { passive: true });
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
      '다섯 개의 기본 숫자와 서비스 번호까지, 단일 세트 또는 5세트 추첨을 마음껏 즐기고 결과는 즉시 저장하세요.',
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
    primaryNavLabel: '주요 섹션 바로가기',
    footerLinksLabel: '푸터 탐색',
    footerDocsLabel: '정책 문서 바로가기',
    navLinks: {
      info: '소개',
      responsible: '건강한 이용',
      odds: '확률',
      policy: '정책',
      faq: 'FAQ',
      contact: '문의',
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      responsibleDoc: '건강한 이용 가이드',
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
    responsibleEyebrow: '건강한 이용',
    responsibleHeading: '건강한 이용 가이드',
    responsibleIntro:
      '학습·엔터테인먼트 목적의 시뮬레이터로, 현실 복권과 구분되는 건전한 사용 원칙을 안내합니다.',
    responsiblePrinciples: [
      '19세 미만 사용자는 학습·참고 용도로만 이용하고, 실제 복권 구매는 거주지의 법적 제한을 따르세요.',
      '세션 시간을 미리 정하고 주기적으로 휴식해 과몰입을 예방하세요.',
      '시뮬레이션 결과는 수익을 보장하지 않으며, 복권 구매와 재정 판단은 사용자 책임입니다.',
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
    faqEyebrow: 'FAQ',
    faqHeading: '자주 묻는 질문',
    faqIntro: '시뮬레이터 운용 방식, 데이터 처리, 책임 범위 등에 대해 가장 자주 받는 질문을 정리했습니다.',
    faqItems: [
      {
        question: '이 결과는 과거 로또 당첨·낙첨 데이터를 바탕으로 하나요?',
        answer: '아니요. Lux Lotto Studio는 매 세트마다 새 번호 풀을 무작위로 생성합니다. 실제 회차 기록이나 외부 통계를 불러오지 않습니다.',
      },
      {
        question: '과거 데이터와 동기화하지 않으면 확률이 달라지지 않나요?',
        answer:
          '추첨은 1부터 45까지 모수를 동일하게 유지한 난수 방식이라 실제 로또 수학적 확률과 동일하게 동작합니다. 과거 결과는 참고용으로만 의미가 있습니다.',
      },
      {
        question: '5세트 모드에서 중복 허용을 켜면 실제 회차처럼 집계되나요?',
        answer:
          '중복 허용을 켜면 각 세트마다 번호 풀을 초기화하여 동일한 숫자가 여러 세트에 등장할 수 있습니다. 실제 복권 다중 구매와 유사한 확률 흐름을 체험할 수 있도록 설계된 옵션입니다.',
      },
      {
        question: '사용자 데이터나 입력값을 서버에 저장하나요?',
        answer: '저장하지 않습니다. 추첨 기록은 브라우저 메모리와 로컬 파일에만 머무르며, 서버로 전송되는 개인정보는 없습니다.',
      },
      {
        question: '이 결과를 실제 당첨 근거로 사용하면 책임을 져주나요?',
        answer:
          '아니요. 본 서비스는 학습·엔터테인먼트 목적의 시뮬레이터입니다. 실제 복권 구매나 재정적 결정에 따른 책임은 사용자에게 있습니다.',
      },
      {
        question: '서비스 이용에 비용이 드나요?',
        answer:
          '기본 기능은 100% 무료입니다. 광고나 유료 아이템을 도입할 계획이 생기면 사전에 명확히 공지할 예정입니다.',
      },
      {
        question: '저장한 결과 파일이 서버로 업로드되거나 공유되나요?',
        answer:
          '저장 버튼을 누르면 브라우저가 직접 텍스트 파일을 내려받습니다. 파일은 사용자 기기에만 존재하며, 자동 업로드나 공유 기능은 제공하지 않습니다.',
      },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: '투명한 운영 약속',
    policyIntro: '운영 범위와 데이터 처리 방식을 공개해 Ads 품질 정책을 준수합니다.',
    policyLegalTitle: '법적 고지',
    policyPrivacyTitle: '개인정보 처리',
    policySafetyTitle: '서비스 안전',
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
    contactIntro: '서비스 운영·정책 관련 문의는 아래 채널로 연락해 주세요. 개인 재정 상담은 제공하지 않습니다.',
    contactOpsTitle: '운영 정보',
    contactSupportTitle: '지원 채널',
    contactDocsTitle: '정책 문서',
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
      {
        label: '문의',
        value: 'baek_10090@naver.com',
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
      'Draw one or five sets including the service ball and save every outcome instantly.',
    drawButton: 'Start Draw',
    redrawButton: 'Draw Again',
    holdPrompt: 'Drawing...',
    preparingText: 'Preparing draw...',
    saveButton: 'Save Results',
    meta: 'Hold the button and guide balls through the 12 o’clock collection zone; releasing fills any remaining slots instantly.',
    resultsLabel: 'Results of this round',
    resultsEyebrow: 'RESULTS',
    resultsDisclaimer: 'This simulation does not award monetary prizes.',
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
    primaryNavLabel: 'Jump to primary sections',
    footerLinksLabel: 'Footer navigation',
    footerDocsLabel: 'Policy shortcuts',
    navLinks: {
      info: 'Overview',
      responsible: 'Responsible Play',
      odds: 'Odds',
      policy: 'Policy',
      faq: 'FAQ',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      responsibleDoc: 'Responsible Play Guide',
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
    responsibleHeading: 'Responsible Play Guide',
    responsibleIntro:
      'Use this educational simulator responsibly—the guidelines below clarify how it differs from real-world gambling.',
    responsiblePrinciples: [
      'Users under 19 should only explore the tool for learning, and all real-world purchases must follow local laws.',
      'Define session limits and take frequent breaks to avoid over-immersion.',
      'Simulation outputs never guarantee profit; lottery spending and financial choices remain your responsibility.',
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
    faqEyebrow: 'FAQ',
    faqHeading: 'Frequently Asked Questions',
    faqIntro: 'Learn how the simulator handles data, probabilities, and accountability before you run extended draws.',
    faqItems: [
      {
        question: 'Does the simulator rely on historical winning numbers?',
        answer:
          'No. Each draw is generated from a fresh random pool of numbers. We do not import or replay official lottery history.',
      },
      {
        question: 'If no past data is used, are the odds still realistic?',
        answer:
          'Yes. The number pool remains 1–45 with uniform probability, so the statistical odds match the official lottery math.',
      },
      {
        question: 'What happens when I enable duplicate sets in 5-set mode?',
        answer:
          'Each set resets the pool, so the same number may appear in multiple sets—just like buying several physical tickets.',
      },
      {
        question: 'Do you store any personal data or draw history on your servers?',
        answer:
          'No. Results exist only in your browser session and optional text exports. Nothing is uploaded or tracked remotely.',
      },
      {
        question: 'Is Lux Lotto Studio accountable for real-world wins or losses?',
        answer:
          'We provide an educational simulator. Financial decisions and actual lottery purchases remain your responsibility.',
      },
      {
        question: 'Is the service free to use?',
        answer:
          'Yes. Core features are free. If we ever introduce paid options, we will announce them clearly beforehand.',
      },
      {
        question: 'Are exported logs automatically synced anywhere?',
        answer:
          'Exports are simple plain-text files saved locally. You control if and how they are shared.',
      },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: 'Transparency Pledge',
    policyIntro: 'We document policies that align with Google AdSense and local regulations.',
    policyLegalTitle: 'Legal Notice',
    policyPrivacyTitle: 'Privacy',
    policySafetyTitle: 'Product Safety',
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
    contactIntro:
      'Use the channels below for service and policy inquiries only. We cannot provide personal financial counseling.',
    contactOpsTitle: 'Operator Info',
    contactSupportTitle: 'Support Channels',
    contactDocsTitle: 'Policy Documents',
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
      {
        label: 'Contact',
        value: 'baek_10090@naver.com',
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
    primaryNavLabel: '主要セクションへのショートカット',
    footerLinksLabel: 'フッターナビゲーション',
    footerDocsLabel: 'ポリシーページ',
    navLinks: {
      info: '紹介',
      responsible: '責任ある利用',
      odds: '確率',
      policy: 'ポリシー',
      faq: 'FAQ',
      contact: 'お問い合わせ',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      responsibleDoc: '健全な利用ガイド',
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
    responsibleIntro:
      '本シミュレーターを健全に利用するための指針です。現実のギャンブルとは切り離して扱ってください。',
    responsiblePrinciples: [
      '19歳未満の利用者は学習・参考目的に限り、現実の宝くじ購入は各地域の法令を優先してください。',
      'セッション時間を決め、こまめに休憩を取り過度な没入を防ぎましょう。',
      '結果は収益を保証しません。実際の購入や金銭判断は利用者ご自身の責任です。',
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
    faqEyebrow: 'FAQ',
    faqHeading: 'よくある質問',
    faqIntro: 'データの扱い・確率・責任範囲など、運営によく寄せられる質問をまとめています。',
    faqItems: [
      {
        question: '抽選は過去の当選番号をもとに再現していますか？',
        answer:
          'いいえ。毎回1〜45のプールをランダムに生成する方式で、公式の当選履歴は取り込みません。',
      },
      {
        question: '履歴データを使わなくても確率は同じですか？',
        answer:
          '同じです。常に1〜45の整数を均等に抽選するため、数学的な当選確率は公式ロトと一致します。',
      },
      {
        question: '5セットモードで重複を許可するとどうなりますか？',
        answer:
          '各セットごとに番号プールを初期化するため、同じ数字が複数セットに現れることがあります。実際に複数枚購入した場合と近い挙動です。',
      },
      {
        question: 'ユーザーデータをサーバーに保存していますか？',
        answer:
          '保存しません。抽選結果はブラウザ内と任意のテキスト保存にのみ存在し、外部へ送信されません。',
      },
      {
        question: '当選や損失に対してサービスが責任を負いますか？',
        answer:
          'いいえ。本サービスは学習・エンタメ目的のシミュレーターです。実際の購入や金銭判断はご自身の責任となります。',
      },
      {
        question: 'このサービスは有料ですか？',
        answer:
          '基本機能はすべて無料です。有料オプションを導入する際は事前に明確な告知を行います。',
      },
      {
        question: '保存した結果ファイルは自動で共有されますか？',
        answer:
          'いいえ。テキストファイルとしてローカルに保存されるだけで、自動送信や共有機能はありません。',
      },
    ],
    policyEyebrow: 'POLICY',
    policyHeading: '透明性へのコミットメント',
    policyIntro: '利用規約やデータ方針を公開し、Google AdSenseの品質基準に準拠します。',
    policyLegalTitle: '法的告知',
    policyPrivacyTitle: '個人情報の取扱い',
    policySafetyTitle: 'サービス安全性',
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
    contactIntro: '以下の窓口ではサービス運営やポリシーに関する問い合わせのみ受け付けています。個別の財務相談は行いません。',
    contactOpsTitle: '運営情報',
    contactSupportTitle: 'サポートチャネル',
    contactDocsTitle: 'ポリシー文書',
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
      {
        label: 'お問い合わせ',
        value: 'baek_10090@naver.com',
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
  persistLanguagePreference(lang);
  document.documentElement.setAttribute('lang', lang);
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
  updateNavigation(content);
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
