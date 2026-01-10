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
const arenaCaption = document.getElementById('arenaCaption');
const languageSelect = document.getElementById('languageSelect');

const NUMBER_MIN = 1;
const NUMBER_MAX = 45;
const BALL_COUNT = NUMBER_MAX;
const SPEED_MULTIPLIER = 10;
const BASE_VELOCITY = 0.35;
const HOLD_VELOCITY = 1.5;
const CENTER_COLLISION_RATIO = 0.25;
const MIN_COLLISION_THRESHOLD = 2;
const MIN_RELATIVE_SPEED = 0.35;
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
let animationFrame;
let velocityScale = BASE_VELOCITY;
let latestResults = [];
const heroDateEl = document.getElementById('heroDate');
let isHoldingDraw = false;
let hasCompletedDraw = false;
let currentLanguage = languageSelect ? languageSelect.value : 'ko';
let drawButtonMode = 'idle';

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
    return {
      number,
      radius,
      x: arena.centerX + point.x,
      y: arena.centerY + point.y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      colorKey: color.key,
      color,
      visible: !hiddenSet.has(number),
      opacity: hiddenSet.has(number) ? 0 : 1,
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

function generateSingleSet() {
  const available = Array.from({ length: NUMBER_MAX - NUMBER_MIN + 1 }, (_, idx) => NUMBER_MIN + idx);
  const main = [];
  while (main.length < 5) {
    const pickIndex = Math.floor(Math.random() * available.length);
    const value = available.splice(pickIndex, 1)[0];
    main.push(value);
  }
  main.sort((a, b) => a - b);
  const serviceIndex = Math.floor(Math.random() * available.length);
  const service = available.splice(serviceIndex, 1)[0];
  return { main, service };
}

function generateResults(count) {
  return Array.from({ length: count }, () => generateSingleSet());
}

function renderResults(resultsArg) {
  const content = getLanguageContent();
  const results = Array.isArray(resultsArg) ? resultsArg : latestResults;
  latestResults = results;
  if (!results.length) {
    resultsContainer.classList.add('empty');
    resultsContainer.innerHTML = `<p>${content.emptyMessage}</p>`;
    return;
  }

  resultsContainer.classList.remove('empty');
  resultsContainer.innerHTML = '';

  results.forEach((set, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-set';

    const label = document.createElement('p');
    label.className = 'label';
    label.textContent = `${content.setLabel} ${idx + 1}`;

    const numbersBox = document.createElement('div');
    numbersBox.className = 'result-numbers';

    set.main.forEach((num) => {
      numbersBox.appendChild(createNumberPill(num));
    });

    const divider = document.createElement('span');
    divider.className = 'service-divider';
    divider.textContent = '+';
    numbersBox.appendChild(divider);

    numbersBox.appendChild(createNumberPill(set.service, true));

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

function handleModeChange(targetMode) {
  if (drawMode === targetMode) return;
  drawMode = targetMode;
  modeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === drawMode);
  });
}

function beginDrawHold(event) {
  if (drawBtn.disabled || isHoldingDraw) return;
  if (event.type === 'pointerdown' && event.pointerType === 'mouse' && event.button !== 0) return;
  isHoldingDraw = true;
  drawButtonMode = 'holding';
  drawBtn.classList.add('holding');
  revealAllBalls();
  velocityScale = HOLD_VELOCITY;
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
  finalizeDraw();
}

function cancelDrawHold() {
  if (!isHoldingDraw) return;
  cleanupHoldListeners();
  isHoldingDraw = false;
  drawBtn.classList.remove('holding');
  drawButtonMode = 'idle';
  velocityScale = BASE_VELOCITY;
  updateDrawButtonLabel();
}

function cleanupHoldListeners() {
  window.removeEventListener('pointerup', releaseDrawHold);
  window.removeEventListener('pointercancel', cancelDrawHold);
}

function finalizeDraw() {
  drawButtonMode = 'preparing';
  updateDrawButtonLabel();
  drawBtn.disabled = true;

  const setCount = drawMode === 'single' ? 1 : 5;
  const results = generateResults(setCount);
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
    holdPrompt: '손을 떼면 추첨이 시작됩니다',
    preparingText: '추첨 준비 중...',
    saveButton: '결과 저장',
    meta: '버튼을 누르고 있다가 손을 떼면 추첨 결과가 나옵니다.',
    resultsLabel: '이번 라운드 결과',
    resultsEyebrow: 'RESULTS',
    arenaCaption: '빠르게 튀어다니는 공에서 번호가 사라지면 추첨 결과에 포함된 것입니다.',
    emptyMessage: '아직 추첨이 진행되지 않았습니다.',
    setLabel: '세트',
    singleSet: '1 세트',
    multiSet: '5 세트',
    weekdayNames: ['일', '월', '화', '수', '목', '금', '토'],
    weekdaySuffix: '요일',
  },
  en: {
    title: 'Random Lotto Studio',
    subtitle:
      'Enjoy drawing either a single set or five sets of numbers, including a bonus ball. Save your outcomes instantly.',
    drawButton: 'Start Draw',
    redrawButton: 'Draw Again',
    holdPrompt: 'Release to draw',
    preparingText: 'Preparing draw...',
    saveButton: 'Save Results',
    meta: 'Hold the button and release to reveal the results instantly.',
    resultsLabel: 'Results of this round',
    resultsEyebrow: 'RESULTS',
    arenaCaption: 'Balls that fade out have been captured for the draw results.',
    emptyMessage: 'No draws yet.',
    setLabel: 'Set',
    singleSet: '1 Set',
    multiSet: '5 Sets',
    weekdayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaySuffix: '',
  },
  ja: {
    title: 'ランダムロトスタジオ',
    subtitle:
      '基本5個とサービス番号まで、1セットまたは5セットの抽選を自由に楽しめます。結果はすぐに保存できます。',
    drawButton: '抽選開始',
    redrawButton: 'もう一度抽選',
    holdPrompt: '指を離すと抽選します',
    preparingText: '抽選を準備中...',
    saveButton: '結果を保存',
    meta: 'ボタンを押したまま指を離すと、その場で抽選結果が表示されます。',
    resultsLabel: '今回の結果',
    resultsEyebrow: '結果',
    arenaCaption: '光が消えたボールは抽選結果に含まれています。',
    emptyMessage: 'まだ抽選が実行されていません。',
    setLabel: 'セット',
    singleSet: '1 セット',
    multiSet: '5 セット',
    weekdayNames: ['日', '月', '火', '水', '木', '金', '土'],
    weekdaySuffix: '曜',
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
  if (arenaCaption) arenaCaption.textContent = content.arenaCaption;
  updateModeButtonLabels();
  updateDrawButtonLabel();
  updateHeroDate();
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
