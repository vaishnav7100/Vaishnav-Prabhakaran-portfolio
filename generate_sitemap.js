const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://vaishnavprabhakaran.in';
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const sitemapUrls = [];

// 1. Tech Homepage
sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

// 2. Art Homepage
sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/art/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

// 3. Tech Locations
const techLocDir = path.join(__dirname, 'locations');
if (fs.existsSync(techLocDir)) {
  const techFiles = fs.readdirSync(techLocDir).filter(f => f.endsWith('.html')).sort();
  for (const f of techFiles) {
    sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/locations/${f}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }
}

// 4. Art Locations
const artLocDir = path.join(__dirname, 'art', 'locations');
if (fs.existsSync(artLocDir)) {
  const artFiles = fs.readdirSync(artLocDir).filter(f => f.endsWith('.html')).sort();
  for (const f of artFiles) {
    sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/art/locations/${f}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`Successfully generated sitemap.xml with ${sitemapUrls.length} URLs.`);
