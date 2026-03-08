import { chromium } from 'playwright';

const URL = 'https://x.com/bohdanmotion/status/1997039869160485135';
const OUT_DIR = '/Users/rohan/Documents/GitHub/demos/out/ref';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

console.log('Navigating to tweet...');
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(6000);

// Dismiss cookie banner if present
try {
  const cookieBtn = page.locator('text="Refuse non-essential cookies"').first();
  if (await cookieBtn.isVisible({ timeout: 2000 })) {
    await cookieBtn.click();
    await page.waitForTimeout(1000);
  }
} catch(e) {}

// Find and click on the video to play it
console.log('Looking for video...');
try {
  await page.waitForSelector('video', { timeout: 10000 });
  const video = page.locator('video').first();
  await video.click();
  await page.waitForTimeout(2000);

  // Try to enter fullscreen or at least screenshot just the video
  // First, get the video bounding box
  const videoBox = await video.boundingBox();
  console.log('Video bounding box:', videoBox);

  // Try double-clicking to fullscreen
  await video.dblclick();
  await page.waitForTimeout(2000);

} catch(e) {
  console.log('Video interaction failed:', e.message);
}

// Screenshot at fullscreen or just the page
for (let i = 0; i < 15; i++) {
  // Try to screenshot the video element directly for higher resolution
  try {
    const video = page.locator('video').first();
    if (await video.isVisible({ timeout: 1000 })) {
      await video.screenshot({ path: `${OUT_DIR}/vid_${String(i).padStart(2, '0')}.png` });
    } else {
      await page.screenshot({ path: `${OUT_DIR}/vid_${String(i).padStart(2, '0')}.png` });
    }
  } catch(e) {
    await page.screenshot({ path: `${OUT_DIR}/vid_${String(i).padStart(2, '0')}.png` });
  }
  console.log(`Saved vid_${String(i).padStart(2, '0')}.png`);
  await page.waitForTimeout(3000);
}

console.log('Done');
await browser.close();
