const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('📸 Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('⏳ Waiting for content to load...');
  await page.waitForTimeout(3000);
  
  // Check navigation links
  const navLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav a'));
    return links.map(link => ({
      text: link.textContent.trim(),
      href: link.getAttribute('href')
    }));
  });
  
  console.log('\n📋 Navigation Links Found:');
  console.log(navLinks);
  
  // Check for process content
  const processContent = await page.evaluate(() => {
    const processSection = document.body.textContent;
    return {
      hasSource: processSection.includes('Source'),
      hasSourceBody: processSection.includes('Partner with regenerative'),
      hasColdPress: processSection.includes('Cold-Press'),
      hasColdPressBody: processSection.includes('hydraulic press'),
      hasFreeze: processSection.includes('Freeze Within Hours'),
      hasFreezeBody: processSection.includes('Flash-frozen'),
      hasShip: processSection.includes('Ship Direct'),
      hasShipBody: processSection.includes('Delivered frozen'),
    };
  });
  
  console.log('\n🔄 Process Steps Content:');
  console.log(processContent);
  
  // Check for standards content
  const standardsContent = await page.evaluate(() => {
    const text = document.body.textContent;
    return {
      hasRegenerative: text.includes('Regenerative Organic'),
      hasRegenerativeBody: text.includes('Soil health'),
      hasFarmTraced: text.includes('Farm-Traced'),
      hasFarmTracedBody: text.includes('identified by farm'),
      hasNoHPP: text.includes('No HPP'),
      hasNoHPPBody: text.includes('Living enzymes'),
    };
  });
  
  console.log('\n⭐ Standards Content:');
  console.log(standardsContent);
  
  // Take full page screenshot
  console.log('\n📸 Capturing screenshots...');
  await page.screenshot({ path: '/tmp/homepage-fixed.png', fullPage: true });
  
  // Scroll to process section and capture
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Make It'));
    if (heading) heading.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/process-section.png' });
  
  // Scroll to standards section and capture
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Ingredients'));
    if (heading) heading.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/standards-section.png' });
  
  console.log('\n✅ Screenshots saved to /tmp/');
  console.log('   - homepage-fixed.png');
  console.log('   - process-section.png');
  console.log('   - standards-section.png');
  
  await browser.close();
})();
