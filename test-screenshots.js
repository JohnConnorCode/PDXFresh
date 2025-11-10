const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('📸 Navigating to homepage...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

  // Wait a bit for images to load
  await page.waitForTimeout(3000);

  // Take full page screenshot
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({ path: '/tmp/homepage-full.png', fullPage: true });

  // Take hero section screenshot
  console.log('📸 Taking hero section screenshot...');
  await page.screenshot({ path: '/tmp/homepage-hero.png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });

  // Check for broken images
  console.log('\n🔍 Checking for broken images...');
  const images = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      error: !img.complete || img.naturalWidth === 0
    }));
  });

  console.log(`\nFound ${images.length} images:`);
  images.forEach((img, idx) => {
    const status = img.error ? '❌ BROKEN' : '✅ OK';
    console.log(`${idx + 1}. ${status} - ${img.alt || 'No alt'} (${img.naturalWidth}x${img.naturalHeight})`);
    if (img.error) {
      console.log(`   Source: ${img.src}`);
    }
  });

  const brokenImages = images.filter(img => img.error);
  console.log(`\n${brokenImages.length > 0 ? '⚠️' : '✅'} Total: ${images.length} images, ${brokenImages.length} broken`);

  // Check for missing text content
  console.log('\n🔍 Checking hero slider...');
  const heroText = await page.textContent('body');
  if (heroText.includes('Peak Performance Starts Here')) {
    console.log('✅ Hero slider text found');
  } else {
    console.log('❌ Hero slider text NOT found');
  }

  // Scroll to blends section
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/homepage-blends.png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  console.log('📸 Saved blends section screenshot');

  await browser.close();

  console.log('\n✅ Screenshots saved to:');
  console.log('   /tmp/homepage-full.png');
  console.log('   /tmp/homepage-hero.png');
  console.log('   /tmp/homepage-blends.png');
})();
