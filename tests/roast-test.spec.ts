import { test, expect } from '@playwright/test';

test('should create a roast successfully', async ({ page }) => {
  // Start from the home page - using localhost:3000 as Next.js dev server
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load
  await page.waitForSelector('text=Paste your code. Get roasted.');
  
  // Fill in some test code
  const testCode = 'console.log("Hello World");';
  await page.fill('textarea[placeholder="// Paste your code here..."]', testCode);
  
  // Select JavaScript language (should already be selected or detected)
  await page.selectOption('select[aria-label="Select programming language"]', 'javascript');
  
  // Click the roast button
  await page.click('button:has-text("$ roast_my_code")');
  
  // Wait for navigation to result page
  await page.waitForURL(/\/result\/\d+/);
  
  // Check that we see roast content
  await page.waitForSelector('text=/score|roast|verdict/i');
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-result.png' });
  
  console.log('Roast creation test passed!');
});