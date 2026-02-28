const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://vaishnavprabhakaran.in';
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

// SITEMAP — Build fresh from scratch (do NOT read existing file to avoid duplicate accumulation)
const today = new Date().toISOString().split('T')[0];
let sitemapUrls = [];

// Add homepage first
sitemapUrls.push(`
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

// Generate Pages
console.log('🚀 Starting page generation...');

let pageCount = 0;

LOCATIONS.forEach(location => {
    const locationSlug = slugify(location);
    const fileName = `${locationSlug}.html`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    const pageUrl = `${BASE_URL}/locations/${fileName}`;

    // Customize Content
    let pageContent = template;

    // 1. Update Title
    const title = `Flutter & Mobile App Developer in ${location}, Kerala | Vaishnav Prabhakaran`;
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

    // 2. Update Meta Description
    const description = `Hire Vaishnav Prabhakaran – expert Flutter developer & mobile app developer in ${location}, Kerala. Specializing in Android/iOS app development, Next.js, and AI-powered solutions. Available for freelance & startup projects.`;
    pageContent = pageContent.replace(/<meta name="description"\s*\n?\s*content=".*?" \/>/, `<meta name="description"\n    content="${description}" />`);

    // 3. Update Keywords
    const specificKeywords = `Flutter Developer ${location}, Mobile App Developer ${location}, App Developer ${location}, Flutter Developer Kerala, Mobile App Developer Kerala, Android Developer ${location}, iOS Developer ${location}, hire Flutter developer ${location}, ${location} app development, ${location} Kerala`;
    pageContent = pageContent.replace(/<meta name="keywords"\s*\n?\s*content=".*?" \/>/, `<meta name="keywords"\n    content="${specificKeywords}" />`);

    // 4. Update Canonical Link — self-referencing (correct per-location URL)
    pageContent = pageContent.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${pageUrl}" />`);
    // Add favicon path for locations subdirectory
    pageContent = pageContent.replace(/<link rel="icon" type="image\/svg\+xml" href="favicon\.svg">/, `<link rel="icon" type="image/svg+xml" href="../favicon.svg">`);

    // 5. Update Open Graph & Twitter
    pageContent = pageContent.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    pageContent = pageContent.replace(/<meta property="og:description"\s*\n?\s*content=".*?" \/>/, `<meta property="og:description"\n    content="${description}" />`);
    pageContent = pageContent.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`);

    pageContent = pageContent.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${title}" />`);
    pageContent = pageContent.replace(/<meta property="twitter:description"\s*\n?\s*content=".*?" \/>/, `<meta property="twitter:description"\n    content="${description}" />`);
    pageContent = pageContent.replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="${pageUrl}" />`);

    // 6. Inject location-specific visible banner AFTER <body> tag
    // This gives each page genuinely unique content, crucial for Google to treat them as distinct pages
    const locationBanner = `
  <!-- ===== LOCATION BANNER (SEO) ===== -->
  <div class="location-seo-banner" role="complementary" aria-label="Service location">
    <div class="location-seo-inner">
      <i class="fas fa-map-marker-alt"></i>
      <div>
        <h2 class="location-seo-title">Flutter &amp; Mobile App Developer in <span>${location}, Kerala</span></h2>
        <p class="location-seo-desc">Looking to hire a top Flutter developer in ${location}? Vaishnav Prabhakaran delivers expert Android &amp; iOS app development, web applications, and AI-powered solutions to businesses and startups across ${location} and all of Kerala.</p>
      </div>
    </div>
  </div>`;

    pageContent = pageContent.replace(/<body>(\s*)/, `<body>\n${locationBanner}\n`);

    // 7. Fix Relative Paths (CSS/Images/JS)
    pageContent = pageContent.replace(/href="styles.css"/g, 'href="../styles.css"');
    pageContent = pageContent.replace(/src="script.js"/g, 'src="../script.js"');
    pageContent = pageContent.replace(/src="vaishnav.png"/g, 'src="../vaishnav.png"');
    pageContent = pageContent.replace(/src="media__1771423611621.png"/g, 'src="../media__1771423611621.png"');

    // Write File
    fs.writeFileSync(filePath, pageContent);
    console.log(`✅ Generated: ${fileName}`);

    // Add to sitemap URLs array (no duplicates possible since we build fresh)
    sitemapUrls.push(`
  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

    pageCount++;
});

// Write clean sitemap from scratch
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.join('')}
</urlset>`;

fs.writeFileSync(SITEMAP_PATH, sitemapContent);

console.log(`\n🎉 Success! Generated ${pageCount} location pages and rebuilt sitemap.xml cleanly.`);
console.log(`📊 Sitemap now has ${sitemapUrls.length} unique URLs (1 homepage + ${pageCount} location pages).`);
