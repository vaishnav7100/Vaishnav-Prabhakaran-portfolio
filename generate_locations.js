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
    'Web Developer',
    'Android Developer',
    'iOS Developer',
    'Next.js Developer',
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

// District mapping for structured data
const DISTRICT_MAP = {
    'Alappuzha': 'Alappuzha', 'Alleppey': 'Alappuzha',
    'Ernakulam': 'Ernakulam', 'Kochi': 'Ernakulam', 'Muvattupuzha': 'Ernakulam', 'Chalakudy': 'Thrissur', 'Kodungallur': 'Thrissur',
    'Idukki': 'Idukki', 'Munnar': 'Idukki', 'Thodupuzha': 'Idukki',
    'Kannur': 'Kannur', 'Thalassery': 'Kannur', 'Payyanur': 'Kannur', 'Mattannur': 'Kannur',
    'Kasaragod': 'Kasaragod', 'Kanhangad': 'Kasaragod',
    'Kollam': 'Kollam', 'Punalur': 'Kollam', 'Kottarakkara': 'Kollam',
    'Kottayam': 'Kottayam', 'Changanassery': 'Kottayam',
    'Kozhikode': 'Kozhikode', 'Calicut': 'Kozhikode', 'Vatakara': 'Kozhikode', 'Koyilandy': 'Kozhikode',
    'Malappuram': 'Malappuram', 'Manjeri': 'Malappuram', 'Tirur': 'Malappuram', 'Ponnani': 'Malappuram', 'Perinthalmanna': 'Malappuram', 'Nilambur': 'Malappuram',
    'Palakkad': 'Palakkad',
    'Pathanamthitta': 'Pathanamthitta', 'Chengannur': 'Pathanamthitta',
    'Thiruvananthapuram': 'Thiruvananthapuram', 'Trivandrum': 'Thiruvananthapuram', 'Neyyattinkara': 'Thiruvananthapuram', 'Nedumangad': 'Thiruvananthapuram', 'Varkala': 'Thiruvananthapuram', 'Attingal': 'Thiruvananthapuram',
    'Thrissur': 'Thrissur', 'Guruvayur': 'Thrissur',
    'Wayanad': 'Wayanad', 'Sultan Bathery': 'Wayanad', 'Kalpetta': 'Wayanad', 'Mananthavady': 'Wayanad'
};

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

// Generate unique location-specific content section
function generateLocationContent(location) {
    const district = DISTRICT_MAP[location] || location;
    const isDistrict = location === district;
    const inDistrict = isDistrict ? `in ${location} district` : `in ${location} (${district} district)`;

    return `
  <!-- ===== LOCATION-SPECIFIC CONTENT (SEO) ===== -->
  <section class="location-content-section" id="location-services">
    <div class="container">
      <div class="location-content-grid">
        <div class="location-content-main">
          <h2 class="location-content-heading">Hire a Flutter, Mobile App & Web Developer ${inDistrict}, Kerala</h2>
          <p>Need a skilled <strong>Flutter developer</strong>, <strong>mobile app developer</strong>, or <strong>web developer in ${location}</strong>? I'm Vaishnav Prabhakaran, a freelance developer based in Kannur, Kerala — available for projects across ${location} and the entire ${district} region. Whether you're a startup, small business, or enterprise ${inDistrict}, I deliver high-quality app and web solutions tailored to your needs.</p>
          <p>I specialize in building <strong>cross-platform mobile apps</strong> using Flutter & Dart (Android + iOS from a single codebase), <strong>modern websites & web applications</strong> using Next.js, React, and TypeScript, and <strong>AI-powered solutions</strong> that give your business a competitive edge. From concept to deployment on the Google Play Store and App Store — I handle the full development lifecycle.</p>

          <h3 class="location-services-title">Services Available in ${location}</h3>
          <div class="location-services-list">
            <div class="location-service-item">
              <i class="fas fa-mobile-alt"></i>
              <div>
                <strong>Flutter & Mobile App Development</strong>
                <p>Custom Android & iOS apps built with Flutter for businesses in ${location}. Cross-platform, pixel-perfect, and production-ready.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-globe"></i>
              <div>
                <strong>Website & Web App Development</strong>
                <p>Modern, responsive websites and web applications built with Next.js, React, and TypeScript for clients in ${location}, Kerala.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-robot"></i>
              <div>
                <strong>AI-Powered Solutions</strong>
                <p>Smart chatbots, AI integrations, and automation tools to help ${location}-based businesses work smarter and scale faster.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-paint-brush"></i>
              <div>
                <strong>UI/UX Design</strong>
                <p>Beautiful, user-focused interfaces designed in Figma — modern design systems and premium aesthetics for apps and websites.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="location-content-sidebar">
          <div class="location-faq glass-card">
            <h3>FAQ — Developer in ${location}</h3>
            <details>
              <summary>Do you work with clients in ${location} remotely?</summary>
              <p>Yes! I work with clients across ${location} and all of Kerala remotely. I use modern collaboration tools to ensure seamless communication, regular updates, and on-time delivery regardless of location.</p>
            </details>
            <details>
              <summary>What does a Flutter app cost in ${location}?</summary>
              <p>Pricing depends on the app's complexity, features, and timeline. I offer competitive rates for businesses in ${location} and ${district} — contact me for a free consultation and custom quote.</p>
            </details>
            <details>
              <summary>Can you build both mobile apps and websites?</summary>
              <p>Absolutely! I build cross-platform mobile apps (Android + iOS) using Flutter, as well as modern websites and web applications using Next.js, React, and TypeScript. Full-stack development from one developer.</p>
            </details>
            <details>
              <summary>How long does app development take?</summary>
              <p>A typical mobile app takes 4–12 weeks depending on complexity. Simple websites can be delivered in 1–3 weeks. I provide realistic timelines and stick to them.</p>
            </details>
          </div>
          <div class="location-cta glass-card">
            <h3>Ready to Start?</h3>
            <p>Let's build your next app or website. Get in touch for a free project consultation.</p>
            <a href="#contact" class="btn btn-primary">
              <span>Contact Me</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// Generate location-specific structured data
function generateLocationSchema(location, pageUrl) {
    const district = DISTRICT_MAP[location] || location;
    return `
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Vaishnav Prabhakaran - Flutter & Web Developer in ${location}",
      "image": "${BASE_URL}/vaishnav.png",
      "url": "${pageUrl}",
      "telephone": "+918078461246",
      "description": "Expert Flutter developer, mobile app developer & web developer serving ${location}, ${district}, Kerala. Available for freelance & contract projects.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${location}",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "${location}"
        },
        {
          "@type": "State",
          "name": "Kerala"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Flutter & Mobile App Development in ${location}"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Website & Web App Development in ${location}"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Integration & Automation in ${location}"
            }
          }
        ]
      },
      "priceRange": "$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    }
  </script>`;
}

// SITEMAP — Build fresh from scratch
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
    const title = `Flutter, Mobile App & Web Developer in ${location}, Kerala | Vaishnav Prabhakaran`;
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

    // 2. Update Meta Description
    const description = `Hire Vaishnav Prabhakaran \u2013 expert Flutter developer, mobile app & web developer in ${location}, Kerala. Specializing in Android/iOS app development, website development, Next.js, and AI-powered solutions. Available for freelance & startup projects.`;
    pageContent = pageContent.replace(/<meta name="description"\s*\n?\s*content=".*?" \/>/, `<meta name="description"\n    content="${description}" />`);

    // 3. Update Keywords — includes "near me" and "web developer"
    const specificKeywords = `Flutter Developer ${location}, Mobile App Developer ${location}, Web Developer ${location}, App Developer ${location}, Flutter Developer Kerala, Mobile App Developer Kerala, Web Developer Kerala, Android Developer ${location}, iOS Developer ${location}, hire Flutter developer ${location}, hire web developer ${location}, ${location} app development, ${location} website development, web developer near me, mobile developer near me, app developer near me, ${location} Kerala`;
    pageContent = pageContent.replace(/<meta name="keywords"\s*\n?\s*content=".*?" \/>/, `<meta name="keywords"\n    content="${specificKeywords}" />`);

    // 4. Update Canonical Link — self-referencing
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

    // 6. Add location-specific structured data BEFORE </head>
    const locationSchema = generateLocationSchema(location, pageUrl);
    pageContent = pageContent.replace('</head>', `${locationSchema}\n</head>`);

    // 7. Inject location-specific visible banner AFTER <body> tag
    const locationBanner = `
  <!-- ===== LOCATION BANNER (SEO) ===== -->
  <div class="location-seo-banner" role="complementary" aria-label="Service location">
    <div class="location-seo-inner">
      <i class="fas fa-map-marker-alt"></i>
      <div>
        <h2 class="location-seo-title">Flutter, Mobile App &amp; Web Developer in <span>${location}, Kerala</span></h2>
        <p class="location-seo-desc">Looking to hire a top Flutter developer or web developer in ${location}? Vaishnav Prabhakaran delivers expert Android &amp; iOS app development, modern website development, and AI-powered solutions to businesses and startups across ${location} and all of Kerala.</p>
      </div>
    </div>
  </div>`;

    pageContent = pageContent.replace(/<body>(\s*)/, `<body>\n${locationBanner}\n`);

    // 8. Inject location-specific content section BEFORE the footer
    const locationContent = generateLocationContent(location);
    pageContent = pageContent.replace(/<footer class="footer">/, `${locationContent}\n\n  <footer class="footer">`);

    // 9. Fix Relative Paths (CSS/Images/JS)
    pageContent = pageContent.replace(/href="styles.css"/g, 'href="../styles.css"');
    pageContent = pageContent.replace(/src="script.js"/g, 'src="../script.js"');
    pageContent = pageContent.replace(/src="vaishnav.png"/g, 'src="../vaishnav.png"');
    pageContent = pageContent.replace(/src="media__1771423611621.png"/g, 'src="../media__1771423611621.png"');

    // Write File
    fs.writeFileSync(filePath, pageContent);
    console.log(`✅ Generated: ${fileName}`);

    // Add to sitemap
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
