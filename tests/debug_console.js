const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', err => {
    console.log(`PAGE ERROR: ${err.message}`);
  });
  
  // Go to editor
  await page.goto('http://localhost:5173/editor');
  await page.fill('input[id="title"]', 'Debug Console Test');
  await page.click('button:has-text("Create Story")');
  await page.waitForURL(/\/editor\//);
  
  // Wait and check
  await page.waitForTimeout(5000);
  
  // Check if StoryFlow component exists
  const storyFlowExists = await page.locator('.react-flow').count();
  console.log(`React Flow components found: ${storyFlowExists}`);
  
  await browser.close();
})();
