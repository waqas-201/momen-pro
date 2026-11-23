/**
 * Browser pass for the Flow transitions.
 *
 * What this actually proves, per move:
 *   - two Stage layers overlap (shared axis, not a swap)
 *   - the Stage is never empty: peak layer opacity never dips to zero
 *   - travel is direction-aware: forward exits left / enters from the right
 *   - Chrome is anchored: the CTA and the progress bar never move by a pixel
 *   - the exiting layer cannot receive pointer events
 *   - the Flow lands on the destination and nowhere else
 *   - rapid repeated taps advance exactly one Step
 *
 * Run with the dev server up:  node test-e2e.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.env.APP_URL || 'http://localhost:8081';
const SETTLE = 750;
const DRIFT_TOLERANCE = 0.5;
const MIN_PEAK_OPACITY = 0.25;
const TRAVEL_TOLERANCE = 0.5;

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`  ${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
  return Boolean(ok);
}

/** Records one frame-by-frame trace of the Flow's Stage and Chrome. */
async function startTrace(page) {
  await page.evaluate(() => {
    if (window.__flowTrace) window.__flowTrace.stop();
    const samples = [];
    let running = true;

    const readX = (el) => {
      const transform = window.getComputedStyle(el).transform;
      if (!transform || transform === 'none') return 0;
      const matrix = /matrix\(([^)]+)\)/.exec(transform);
      if (!matrix) return 0;
      return parseFloat(matrix[1].split(',')[4]);
    };
    const top = (testId) => {
      const el = document.querySelector(`[data-testid="${testId}"]`);
      return el ? Math.round(el.getBoundingClientRect().top * 100) / 100 : null;
    };
    const tick = () => {
      if (!running) return;
      const layers = Array.from(
        document.querySelectorAll('[data-testid^="flow-step-"]')
      );
      // The shell fades as a whole on entry and exit; the Splash sits outside it.
      const shellEl = document.querySelector('[data-testid="flow-shell"]');
      const shellOpacity = shellEl
        ? parseFloat(window.getComputedStyle(shellEl).opacity)
        : 1;
      samples.push({
        t: performance.now(),
        shellOpacity,
        layers: layers.map((el) => {
          const style = window.getComputedStyle(el);
          const id = el.getAttribute('data-testid');
          const own = parseFloat(style.opacity);
          return {
            id,
            x: readX(el),
            opacity: id === 'flow-step-0' ? own : own * shellOpacity,
            pointerEvents: style.pointerEvents,
          };
        }),
        ctaTop: top('flow-cta'),
        progressTop: top('flow-progress'),
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.__flowTrace = {
      samples,
      stop: () => {
        running = false;
      },
    };
  });
}

async function readTrace(page) {
  return page.evaluate(() => {
    window.__flowTrace.stop();
    return window.__flowTrace.samples;
  });
}

async function stepAtRest(page) {
  return page.evaluate(() => {
    const layers = Array.from(
      document.querySelectorAll('[data-testid^="flow-step-"]')
    );
    if (layers.length === 0) return 'none';
    if (layers.length > 1) return `ambiguous(${layers.length})`;
    return Number(layers[0].getAttribute('data-testid').replace('flow-step-', ''));
  });
}

/**
 * Opens the app and waits for the Splash's own control rather than for the
 * network to go idle — a Metro dev build keeps a socket open and takes its time
 * on a cold bundle.
 */
async function openApp(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page
    .getByTestId('splash-begin-button')
    .waitFor({ state: 'visible', timeout: 120000 });
  await page.waitForTimeout(2500);
}

async function forText(page, text) {
  const body = await page.textContent('body');
  return body.replace(/\s+/g, ' ').includes(text);
}

/**
 * Clicks a control, waits for the Flow to land, and grades the trace.
 *
 * `from`/`to` are Step numbers, with 0 meaning the Splash surface.
 * `expects` says who should travel: both surfaces (a Step-to-Step move), the
 * outgoing one only (the Splash leaving), or the incoming one only (the Splash
 * returning on Back from Step 1).
 */
async function moveAndGrade(
  page,
  { label, click, from, to, forward, expects = 'cross' }
) {
  await startTrace(page);
  await click();
  await page.waitForTimeout(SETTLE);
  const samples = await readTrace(page);

  const landing = await stepAtRest(page);
  check(
    `${label}: lands on ${to === 0 ? 'the splash' : `step ${to}`}`,
    to === 0 ? landing === 'none' : landing === to,
    `resting on ${landing === 'none' ? 'the splash' : landing}`
  );

  const moving = samples.filter((sample) => sample.layers.length === 2);
  check(
    `${label}: both layers coexist`,
    moving.length >= 3,
    `${moving.length} overlapping frames`
  );

  const ids = moving.length
    ? moving[0].layers.map((layer) => layer.id).sort().join('+')
    : 'none';
  check(
    `${label}: overlaps ${from} and ${to}`,
    ids === [`flow-step-${from}`, `flow-step-${to}`].sort().join('+'),
    ids
  );

  // Never a blank Stage: something is always substantially visible.
  const blank = samples.filter(
    (sample) =>
      sample.layers.length > 0 &&
      sample.layers.every((layer) => !(layer.opacity >= MIN_PEAK_OPACITY))
  );
  check(
    `${label}: stage never empties`,
    blank.length === 0,
    `${blank.length} frames below ${MIN_PEAK_OPACITY} opacity`
  );

  // Direction: forward exits left and enters from the right; back reverses.
  const exitingId = `flow-step-${from}`;
  const enteringId = `flow-step-${to}`;
  const directional = moving.filter((sample) => {
    const out = sample.layers.find((layer) => layer.id === exitingId);
    const inc = sample.layers.find((layer) => layer.id === enteringId);
    if (!out || !inc) return false;
    if (expects === 'exit') return out.x < -TRAVEL_TOLERANCE;
    if (expects === 'enter') return inc.x < -TRAVEL_TOLERANCE;
    return forward
      ? out.x < -TRAVEL_TOLERANCE && inc.x > TRAVEL_TOLERANCE
      : out.x > TRAVEL_TOLERANCE && inc.x < -TRAVEL_TOLERANCE;
  });
  const apex = moving.reduce(
    (max, sample) =>
      Math.max(
        max,
        ...sample.layers.map((layer) => Math.abs(layer.x))
      ),
    0
  );
  check(
    `${label}: travels ${forward ? 'left' : 'right'}`,
    directional.length >= 2,
    `${directional.length} directional frames, apex ${apex.toFixed(1)}px`
  );

  // Chrome does not join the move.
  const tops = samples
    .map((sample) => [sample.ctaTop, sample.progressTop])
    .filter(([cta, progress]) => cta !== null && progress !== null);
  const ctaSpread = Math.max(...tops.map(([cta]) => cta)) -
    Math.min(...tops.map(([cta]) => cta));
  const progressSpread =
    Math.max(...tops.map(([, progress]) => progress)) -
    Math.min(...tops.map(([, progress]) => progress));
  check(
    `${label}: chrome anchored`,
    tops.length > 0 &&
      ctaSpread <= DRIFT_TOLERANCE &&
      progressSpread <= DRIFT_TOLERANCE,
    `cta drift ${ctaSpread.toFixed(2)}px, progress drift ${progressSpread.toFixed(2)}px`
  );

  // The Step on its way out must not swallow taps aimed at the new one.
  const exitingFrames = moving
    .map((sample) => sample.layers.find((layer) => layer.id === exitingId))
    .filter(Boolean);
  check(
    `${label}: exiting layer inert`,
    exitingFrames.length > 0 &&
      exitingFrames.every((layer) => layer.pointerEvents === 'none'),
    `${exitingFrames.filter((layer) => layer.pointerEvents === 'none').length}/${exitingFrames.length} frames`
  );

  return samples;
}

async function run() {
  const shots = path.join(__dirname, 'test-results', 'screenshots');
  fs.mkdirSync(shots, { recursive: true });

  console.log(`Launching Chromium against ${URL}`);
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));

  await openApp(page);

  console.log('\nSplash');
  await page.screenshot({ path: path.join(shots, '0-splash.png') });
  check('splash: renders', await forText(page, 'Begin with Bismillah'));
  check('splash: no flow step mounted', (await stepAtRest(page)) === 'none');

  const STEPS = [
    { id: 1, cta: 'prayers-continue-btn', title: 'YOUR PRAYERS' },
    { id: 2, cta: 'darood-continue-btn', title: 'YOUR DAROOD O SALAM' },
    { id: 3, cta: 'remembrance-continue-btn', title: 'YOUR REMEMBRANCE' },
    { id: 4, cta: 'recitation-continue-btn', title: 'YOUR RECITATION' },
    { id: 5, cta: 'missed-prayers-continue-btn', title: 'A FRESH BEGINNING' },
    { id: 6, cta: 'username-continue-btn', title: 'YOUR NAME' },
    { id: 7, cta: 'prayer-settings-continue-btn', title: 'YOUR TRADITION & HORIZON' },
    { id: 8, cta: 'journey-finish-button', title: 'YOUR JOURNEY BEGINS' },
  ];

  console.log('\nSplash -> step 1 (entry)');
  await moveAndGrade(page, {
    label: 'splash->1',
    from: 0,
    to: 1,
    forward: true,
    expects: 'exit',
    click: () => page.getByTestId('splash-begin-button').click(),
  });
  check('1: title shown', await forText(page, 'YOUR PRAYERS'));
  await page.screenshot({ path: path.join(shots, '1-prayers.png') });

  for (let i = 0; i < STEPS.length - 1; i += 1) {
    const current = STEPS[i];
    const next = STEPS[i + 1];
    console.log(`\nStep ${current.id} -> ${next.id}`);
    await moveAndGrade(page, {
      label: `${current.id}->${next.id}`,
      from: current.id,
      to: next.id,
      forward: true,
      click: () => page.getByTestId(current.cta).click(),
    });
    check(`${next.id}: title shown`, await forText(page, next.title));
    await page.screenshot({
      path: path.join(shots, `${next.id}-${next.title.toLowerCase().replace(/\s+/g, '-')}.png`),
    });
  }

  console.log('\nBack: step 8 -> 7 (reverse)');
  await moveAndGrade(page, {
    label: '8->7 back',
    from: 8,
    to: 7,
    forward: false,
    click: () => page.getByTestId('header-back-button').click(),
  });

  console.log('\nBack: step 7 -> 6 (reverse)');
  await moveAndGrade(page, {
    label: '7->6 back',
    from: 7,
    to: 6,
    forward: false,
    click: () => page.getByTestId('header-back-button').click(),
  });

  console.log('\nDrag back: step 6 -> 5 (finger-tracked)');
  const stageBox = await page.getByTestId('flow-stage').boundingBox();
  const dragY = stageBox.y + stageBox.height / 2;
  const dragX = stageBox.x + 30;
  await startTrace(page);
  await page.mouse.move(dragX, dragY);
  await page.mouse.down();
  for (let i = 1; i <= 12; i += 1) {
    await page.mouse.move(dragX + i * 20, dragY);
    await page.waitForTimeout(8);
  }
  const dragTrace = await page.evaluate(() => window.__flowTrace.samples.slice());
  await page.mouse.up();
  await page.waitForTimeout(SETTLE);
  const afterDrag = await stepAtRest(page);
  const dragReveal = dragTrace.reduce(
    (max, sample) =>
      Math.max(max, ...sample.layers.map((layer) => Math.abs(layer.x))),
    0
  );
  check('drag: tracks the finger', dragReveal > 30, `revealed ${dragReveal.toFixed(0)}px`);
  check('drag: commits to step 5', afterDrag === 5, `resting on ${afterDrag}`);

  console.log('\nRapid taps must not double-advance');
  const backToSix = await page.getByTestId('missed-prayers-continue-btn').isVisible().catch(() => false);
  if (backToSix) {
    const ctaBox = await page.getByTestId('flow-cta').boundingBox();
    const tapX = ctaBox.x + ctaBox.width / 2;
    const tapY = ctaBox.y + ctaBox.height / 2;
    await page.mouse.click(tapX, tapY);
    await page.mouse.click(tapX, tapY);
    await page.mouse.click(tapX, tapY);
    await page.waitForTimeout(SETTLE);
    const landed = await stepAtRest(page);
    check('rapid taps: advance exactly one step', landed === 6, `resting on ${landed}`);
  } else {
    check('rapid taps: harness reached step 5', false, 'CTA not found');
  }

  console.log('\nBack from step 1 returns to the Splash');
  await openApp(page);
  await page.getByTestId('splash-begin-button').click();
  await page.waitForTimeout(SETTLE);
  await moveAndGrade(page, {
    label: '1->splash back',
    from: 1,
    to: 0,
    forward: false,
    expects: 'enter',
    click: () => page.getByTestId('header-back-button').click(),
  });
  check('1->splash: splash is back', await forText(page, 'Begin with Bismillah'));

  console.log('\nSkip from the Splash lands on the Arrival');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page
    .getByTestId('splash-begin-button')
    .waitFor({ state: 'visible', timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.getByTestId('splash-skip-button').click();
  await page.waitForTimeout(SETTLE);
  const skipped = await stepAtRest(page);
  check('skip: lands on Arrival (8)', skipped === 8, `resting on ${skipped}`);

  console.log('\nCompletion modal');
  await page.getByTestId('journey-finish-button').click();
  await page.waitForTimeout(600);
  check('modal: opens', await forText(page, 'Māshā’Allāh'));
  await page.screenshot({ path: path.join(shots, '10-completed-modal.png') });

  console.log('\nReduced motion');
  const reducedContext = await browser.newContext({
    viewport: { width: 440, height: 900 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await openApp(reducedPage);
  await startTrace(reducedPage);
  await reducedPage.getByTestId('splash-begin-button').click();
  await reducedPage.waitForTimeout(SETTLE);
  await reducedPage.getByTestId('prayers-continue-btn').click();
  await reducedPage.waitForTimeout(SETTLE);
  const reducedSamples = await readTrace(reducedPage);
  const reducedSteps = await stepAtRest(reducedPage);
  const reducedTravel = reducedSamples.reduce(
    (max, sample) => Math.max(max, ...sample.layers.map((layer) => Math.abs(layer.x))),
    0
  );
  check('reduced motion: still navigates', reducedSteps === 2, `resting on ${reducedSteps}`);
  check(
    'reduced motion: no lateral travel',
    reducedTravel <= TRAVEL_TOLERANCE,
    `max ${reducedTravel.toFixed(2)}px`
  );

  await browser.close();
  await reducedBrowserClose(reducedContext);

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} checks passed.`
  );
  if (consoleErrors.length > 0) {
    console.log(`\nBrowser console had ${consoleErrors.length} error(s):`);
    for (const err of consoleErrors) console.log(`  ! ${err}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

async function reducedBrowserClose(context) {
  try {
    await context.browser().close();
  } catch {}
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
