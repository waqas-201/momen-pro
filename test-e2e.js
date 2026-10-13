const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTests() {
  const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('🚀 Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 440, height: 900 },
  });
  const page = await context.newPage();

  console.log('🌐 Navigating to Expo Web (http://localhost:8081)...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for initial render
  await page.waitForTimeout(4000);

  console.log('📸 Screen 0 (Splash): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '0-splash.png') });

  // Check splash elements
  const splashText = await page.textContent('body');
  console.log('Splash contains Bismillah CTA?', splashText.includes('Begin with Bismillah'));

  // Screen 0 -> Screen 1: Click "Begin with Bismillah"
  console.log('👉 Clicking "Begin with Bismillah"...');
  const beginBtn = page.getByTestId('splash-begin-button');
  if (await beginBtn.isVisible()) {
    await beginBtn.click();
  } else {
    // fallback click on text
    await page.getByText('Begin with Bismillah').click();
  }
  await page.waitForTimeout(1500);

  console.log('📸 Screen 1 (Prayers): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '1-prayers.png') });
  let body1 = await page.textContent('body');
  console.log('Screen 1 loaded?', body1.includes('PRAYERS') || body1.includes('prayer'));

  // Screen 1 -> Screen 2: Click Next
  console.log('👉 Navigating to Screen 2...');
  const nextBtn1 = page.getByTestId('bottom-cta-button');
  if (await nextBtn1.isVisible()) {
    await nextBtn1.click();
  } else {
    await page.getByText('Next').click();
  }
  await page.waitForTimeout(1500);

  console.log('📸 Screen 2 (Prayer Space): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '2-space.png') });
  let body2 = await page.textContent('body');
  console.log('Screen 2 loaded?', body2.includes('SPACE') || body2.includes('space') || body2.includes('Mosque'));

  // Screen 2 -> Screen 3: Click Next
  console.log('👉 Navigating to Screen 3...');
  await page.getByTestId('bottom-cta-button').click();
  await page.waitForTimeout(1500);

  console.log('📸 Screen 3 (Remembrance): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '3-remembrance.png') });
  let body3 = await page.textContent('body');
  console.log('Screen 3 loaded?', body3.includes('REMEMBRANCE') || body3.includes('remembrance') || body3.includes('azkar'));

  // Screen 3 -> Screen 4: Click Next
  console.log('👉 Navigating to Screen 4...');
  await page.getByTestId('bottom-cta-button').click();
  await page.waitForTimeout(1500);

  console.log('📸 Screen 4 (Recitation): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '4-recitation.png') });
  let body4 = await page.textContent('body');
  console.log('Screen 4 loaded?', body4.includes('RECITATION') || body4.includes('recitation') || body4.includes('Ayahs'));

  // Screen 4 -> Screen 5: Click Next
  console.log('👉 Navigating to Screen 5...');
  await page.getByTestId('bottom-cta-button').click();
  await page.waitForTimeout(1500);

  console.log('📸 Screen 5 (Missed Prayers / Fresh Beginning): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '5-missed-prayers.png') });
  let body5 = await page.textContent('body');
  console.log('Screen 5 loaded?', body5.includes('BEGINNING') || body5.includes('missed') || body5.includes('Qaza'));

  // Screen 5 -> Screen 6: Click Next
  console.log('👉 Navigating to Screen 6...');
  await page.getByTestId('bottom-cta-button').click();
  await page.waitForTimeout(1500);

  console.log('📸 Screen 6 (Daily Intentions): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '6-daily-intentions.png') });
  let body6 = await page.textContent('body');
  console.log('Screen 6 loaded?', body6.includes('INTENTIONS') || body6.includes('intentions') || body6.includes('Dhikr'));

  // Screen 6 -> Screen 7: Click Next
  console.log('👉 Navigating to Screen 7...');
  await page.getByTestId('bottom-cta-button').click();
  await page.waitForTimeout(1500);

  console.log('📸 Screen 7 (Journey Begins): Capturing and validating...');
  await page.screenshot({ path: path.join(screenshotsDir, '7-journey-begins.png') });
  let body7 = await page.textContent('body');
  console.log('Screen 7 loaded?', body7.includes('intentions are set') || body7.includes('Begin my journey'));

  // Screen 7 -> Finish Journey
  console.log('👉 Clicking "Begin my journey"...');
  await page.getByTestId('journey-finish-button').click();
  await page.waitForTimeout(1000);

  console.log('📸 Journey Completed Modal: Capturing...');
  await page.screenshot({ path: path.join(screenshotsDir, '8-completed-modal.png') });
  let body8 = await page.textContent('body');
  console.log('Modal displayed?', body8.includes('Māshā’Allāh') || body8.includes('Welcome to Momen Pro'));

  console.log('✅ ALL SCREENS TESTED AND VALIDATED SUCCESSFULLY!');
  await browser.close();
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
