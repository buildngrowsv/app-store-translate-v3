import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to match OG image dimensions
  await page.setViewport({ width: 1200, height: 630 });
  
  // Load the SVG file
  const svgPath = join(__dirname, '../public/og-image.svg');
  await page.goto(`file://${svgPath}`);
  
  // Wait for any animations/fonts to load
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Take screenshot
  const pngPath = join(__dirname, '../public/og-image.png');
  await page.screenshot({
    path: pngPath,
    fullPage: true
  });
  
  await browser.close();
  console.log('Conversion complete!');
})().catch(console.error); 