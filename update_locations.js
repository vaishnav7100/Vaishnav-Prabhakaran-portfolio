const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const locationsDir = 'locations';

const files = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html'));

const titleRegex = /<title>[\s\S]*?<\/title>/;
const metaDescRegex = /<meta\s+name="description"[\s\S]*?>/;
const metaKeyRegex = /<meta\s+name="keywords"[\s\S]*?>/;
const ogTitleRegex = /<meta\s+property="og:title"[\s\S]*?>/;
const ogDescRegex = /<meta\s+property="og:description"[\s\S]*?>/;
const twTitleRegex = /<meta\s+property="twitter:title"[\s\S]*?>/;
const twDescRegex = /<meta\s+property="twitter:description"[\s\S]*?>/;
const canonicalRegex = /<link\s+rel="canonical"[\s\S]*?>/;
const ogUrlRegex = /<meta\s+property="og:url"[\s\S]*?>/;
const twUrlRegex = /<meta\s+property="twitter:url"[\s\S]*?>/;
const jsonLdRegex = /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/g;

files.forEach(file => {
  const filePath = path.join(locationsDir, file);
  const oldHtml = fs.readFileSync(filePath, 'utf8');
  
  const title = oldHtml.match(titleRegex)?.[0] || '';
  const metaDesc = oldHtml.match(metaDescRegex)?.[0] || '';
  const metaKey = oldHtml.match(metaKeyRegex)?.[0] || '';
  const ogTitle = oldHtml.match(ogTitleRegex)?.[0] || '';
  const ogDesc = oldHtml.match(ogDescRegex)?.[0] || '';
  const twTitle = oldHtml.match(twTitleRegex)?.[0] || '';
  const twDesc = oldHtml.match(twDescRegex)?.[0] || '';
  const canonical = oldHtml.match(canonicalRegex)?.[0] || '';
  const ogUrl = oldHtml.match(ogUrlRegex)?.[0] || '';
  const twUrl = oldHtml.match(twUrlRegex)?.[0] || '';
  
  const oldJsonLds = [];
  let match;
  while ((match = jsonLdRegex.exec(oldHtml)) !== null) {
    oldJsonLds.push(match[0]);
  }
  
  const bannerStart = oldHtml.indexOf('<!-- ===== LOCATION BANNER (SEO) ===== -->');
  let bannerStr = '';
  if (bannerStart !== -1) {
    const bannerEnd = oldHtml.indexOf('<!-- Progress Bar -->', bannerStart);
    if (bannerEnd !== -1) {
      bannerStr = oldHtml.substring(bannerStart, bannerEnd).trim();
    }
  }
  
  const contentStart = oldHtml.indexOf('<!-- ===== LOCATION-SPECIFIC CONTENT (SEO) ===== -->');
  let contentStr = '';
  if (contentStart !== -1) {
    const contentEnd = oldHtml.indexOf('</section>', contentStart);
    if (contentEnd !== -1) {
      contentStr = oldHtml.substring(contentStart, contentEnd + 10).trim();
    }
  }
  
  let newHtml = indexHtml;
  
  newHtml = newHtml.replace(titleRegex, title);
  newHtml = newHtml.replace(metaDescRegex, metaDesc);
  newHtml = newHtml.replace(metaKeyRegex, metaKey);
  newHtml = newHtml.replace(ogTitleRegex, ogTitle);
  newHtml = newHtml.replace(ogDescRegex, ogDesc);
  newHtml = newHtml.replace(twTitleRegex, twTitle);
  newHtml = newHtml.replace(twDescRegex, twDesc);
  newHtml = newHtml.replace(canonicalRegex, canonical);
  newHtml = newHtml.replace(ogUrlRegex, ogUrl);
  newHtml = newHtml.replace(twUrlRegex, twUrl);
  
  newHtml = newHtml.replace(jsonLdRegex, '');
  newHtml = newHtml.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  const headEndIndex = newHtml.indexOf('</head>');
  const jsonLdBlock = oldJsonLds.join('\n\n  ');
  newHtml = newHtml.slice(0, headEndIndex) + jsonLdBlock + '\n' + newHtml.slice(headEndIndex);
  
  newHtml = newHtml.replace(/href="favicon\.svg\?v=3"/g, 'href="../favicon.svg?v=3"');
  newHtml = newHtml.replace(/href="favicon\.png\?v=3"/g, 'href="../favicon.png?v=3"');
  newHtml = newHtml.replace(/href="apple-touch-icon\.png\?v=3"/g, 'href="../apple-touch-icon.png?v=3"');
  newHtml = newHtml.replace(/href="styles\.css"/g, 'href="../styles.css"');
  newHtml = newHtml.replace(/src="script\.js"/g, 'src="../script.js"');
  newHtml = newHtml.replace(/href="vaishnav\.jpg"/g, 'href="../vaishnav.jpg"');
  newHtml = newHtml.replace(/src="vaishnav\.jpg"/g, 'src="../vaishnav.jpg"');
  
  const footerStart = newHtml.indexOf('<!-- ═══════════ FOOTER ═══════════ -->');
  if (footerStart !== -1) {
    const combinedSeo = `
  ${bannerStr}
  
  ${contentStr}
  
  `;
    newHtml = newHtml.slice(0, footerStart) + combinedSeo + newHtml.slice(footerStart);
  }
  
  fs.writeFileSync(filePath, newHtml, 'utf8');
});
console.log('All locations updated successfully.');
