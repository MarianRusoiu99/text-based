const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to editor creation page
  await page.goto('http://localhost:5173/editor');
  
  // Create a test story
  await page.fill('input[id="title"]', 'Debug Test Story');
  await page.fill('textarea[id="description"]', 'Debug test');
  await page.click('button:has-text("Create Story")');
  
  // Wait for editor page
  await page.waitForURL(/\/editor\//);
  await page.waitForTimeout(3000); // Wait for components to render
  
  // Take screenshot
  await page.screenshot({ path: 'editor-debug.png', fullPage: true });
  
  // Log all buttons on the page
  const buttons = await page.locator('button').all();
  console.log('Found buttons:');
  for (const button of buttons) {
    const text = await button.textContent();
    console.log(`- "${text}"`);
  }
  
  // Log all text containing "Variables", "Items", "Add Node"
  const variablesElements = await page.locator('text=Variables').all();
  const itemsElements = await page.locator('text=Items').all();
  const addNodeElements = await page.locator('text=Add Node').all();
  
  console.log(`Variables elements found: ${variablesElements.length}`);
  console.log(`Items elements found: ${itemsElements.length}`);
  console.log(`Add Node elements found: ${addNodeElements.length}`);
  
  await browser.close();
})();
