const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('📸 Navigating to homepage...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check if sections exist
  const sections = await page.evaluate(() => {
    const text = document.body.textContent;
    return {
      valueProps: text.includes('Nothing fake'),
      featuredBlends: text.includes('Featured Blends'),
      stats: text.includes('By the Numbers'),
      testimonials: text.includes('What People Say'),

      // Check if elements have opacity 0
      hiddenElements: Array.from(document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]')).length,

      // Get all section headings
      headings: Array.from(document.querySelectorAll('h2, h3')).map(h => h.textContent.trim()).filter(t => t).slice(0, 15)
    };
  });

  console.log('\n📊 Content Check:');
  console.log('Value Props present:', sections.valueProps ? '✅' : '❌');
  console.log('Featured Blends present:', sections.featuredBlends ? '✅' : '❌');
  console.log('Stats present:', sections.stats ? '✅' : '❌');
  console.log('Testimonials present:', sections.testimonials ? '✅' : '❌');
  console.log('\n🎨 Animation Issues:');
  console.log('Elements with opacity:0:', sections.hiddenElements);

  console.log('\n📝 Page Headings Found:');
  sections.headings.forEach((h, i) => console.log(`${i + 1}. ${h}`));

  await browser.close();
})();
