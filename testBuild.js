// testBuild.js
// Script to test that all main routes render without crashing
const puppeteer = require('puppeteer');

const routes = ['/', '/dashboard', '/predict', '/report', '/subscribe', '/home'];
const baseUrl = 'http://localhost:3000';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let allPassed = true;
  for (const route of routes) {
    try {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle2', timeout: 20000 });
      const content = await page.content();
      if (!content || content.length < 100) throw new Error('Empty page');
      console.log(`✅ Route ${route} rendered successfully.`);
    } catch (e) {
      allPassed = false;
      console.error(`❌ Route ${route} failed:`, e.message);
    }
  }
  await browser.close();
  if (allPassed) {
    console.log('All routes rendered without crashing!');
    process.exit(0);
  } else {
    process.exit(1);
  }
})(); 