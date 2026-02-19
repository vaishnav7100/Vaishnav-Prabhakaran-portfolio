const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://vaishnavprabhakaran.com';
const OUTPUT_DIR = path.join(__dirname, 'locations');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const TEMPLATE_PATH = path.join(__dirname, 'index.html');

// Keywords and Locations
const KEYWORDS = [
    'Flutter Developer',
    'Mobile App Developer',
    'Android Developer',
    'iOS Developer',
    'Next.js Developer',
    'Web Developer',
    'App Developer'
];

const LOCATIONS = [
    // Kerala Districts
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
    'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
    'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
    // Major Cities/Towns
    'Kochi', 'Trivandrum', 'Calicut', 'Alleppey', 'Munnar', 'Varkala',
    'Guruvayur', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad',
    'Payyanur', 'Koyilandy', 'Neyyattinkara', 'Manjeri', 'Nedumangad',
    'Tirur', 'Punalur', 'Muvattupuzha', 'Chengannur', 'Changanassery',
    'Thodupuzha', 'Chalakudy', 'Kodungallur', 'Perinthalmanna', 'Kottarakkara',
    'Nilambur', 'Attingal', 'Mattannur', 'Sultan Bathery', 'Kalpetta', 'Mananthavady'
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Read Template
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Function to generate a slug
const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

// SITEMAP CONTENT BUILDER
let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
// Remove closing tag to append new URLs
sitemapContent = sitemapContent.replace('</urlset>', '');

// Generate Pages
console.log('🚀 Starting page generation...');

let pageCount = 0;

LOCATIONS.forEach(location => {
    // For each location, we create a specialized page.
    // We'll create a generic "location page" that targets ALL keywords in its meta tags/content,
    // rather than creating 500+ pages (Location * Keyword), which might look like spam.
    // Instead, we create ONE high-quality page per location: /locations/kannur.html

    const locationSlug = slugify(location);
    const fileName = `${locationSlug}.html`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // Customize Content
    let pageContent = template;

    // 1. Update Title
    const title = `Top ${KEYWORDS[0]} in ${location} | Mobile App & Web Development`;
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

    // 2. Update Meta Description
    const description = `Looking for the best ${KEYWORDS.join(', ')} in ${location}? Vaishnav Prabhakaran delivers high-performance mobile apps and AI web solutions. Contact now!`;
    pageContent = pageContent.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);

    // 3. Update Keywords
    const specificKeywords = KEYWORDS.map(k => `${k} in ${location}`).join(', ') + `, ${location}, Kerala`;
    pageContent = pageContent.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${specificKeywords}" />`);

    // 4. Update Canonical Link
    const pageUrl = `${BASE_URL}/locations/${fileName}`;
    pageContent = pageContent.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${pageUrl}" />`);

    // 5. Update Open Graph & Twitter
    pageContent = pageContent.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    pageContent = pageContent.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`);
    pageContent = pageContent.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`);

    pageContent = pageContent.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${title}" />`);
    pageContent = pageContent.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${description}" />`);
    pageContent = pageContent.replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="${pageUrl}" />`);

    // 6. Content Injection (Crucial for SEO relevance)
    // We'll inject a location-specific H1 or Intro if possible, or append a footer section.
    // Let's replace the Hero Title slightly to include location.

    // Regex to find "Hi, I'm Vaishnav" and append location context
    // safe replacement for the typewriter area?

    // User requested NO visible banner. We will rely on metadata and title for SEO.
    // If we want to add hidden text or subtle changes, we can do it here, but for now we keep the UI identical.


    // 7. Fix Relative Paths (CSS/Images/JS)
    // Since these files are in /locations/, we need to step back up ../
    pageContent = pageContent.replace(/href="styles.css"/g, 'href="../styles.css"');
    pageContent = pageContent.replace(/src="script.js"/g, 'src="../script.js"');
    pageContent = pageContent.replace(/src="vaishnav.png"/g, 'src="../vaishnav.png"');
    pageContent = pageContent.replace(/src="media__1771423611621.png"/g, 'src="../media__1771423611621.png"');

    // Write File
    fs.writeFileSync(filePath, pageContent);
    console.log(`✅ Generated: ${fileName}`);

    // Add to Sitemap
    const date = new Date().toISOString().split('T')[0];
    sitemapContent += `
  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    pageCount++;
});

// Close Sitemap
sitemapContent += '\n</urlset>';
fs.writeFileSync(SITEMAP_PATH, sitemapContent);

console.log(`\n🎉 Success! Generated ${pageCount} location pages and updated sitemap.xml.`);
