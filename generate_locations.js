const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://vaishnavprabhakaran.in';
const OUTPUT_DIR = path.join(__dirname, 'locations');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const TEMPLATE_PATH = path.join(__dirname, 'index.html');

// Keywords
const KEYWORDS = [
    'Flutter Developer',
    'Mobile App Developer',
    'Web Developer',
    'Android Developer',
    'iOS Developer',
    'Next.js Developer',
    'App Developer',
    'Freelance App Developer'
];

const LOCATIONS = [
    // Kerala Districts
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
    'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
    'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
    // Kerala Cities/Towns
    'Kochi', 'Trivandrum', 'Calicut', 'Alleppey', 'Munnar', 'Varkala',
    'Guruvayur', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad',
    'Payyanur', 'Koyilandy', 'Neyyattinkara', 'Manjeri', 'Nedumangad',
    'Tirur', 'Punalur', 'Muvattupuzha', 'Chengannur', 'Changanassery',
    'Thodupuzha', 'Chalakudy', 'Kodungallur', 'Perinthalmanna', 'Kottarakkara',
    'Nilambur', 'Attingal', 'Mattannur', 'Sultan Bathery', 'Kalpetta', 'Mananthavady',
    // --- MAJOR INDIAN CITIES (India-wide SEO) ---
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Vadodara',
    'Chandigarh', 'Coimbatore', 'Visakhapatnam', 'Mysore', 'Mangalore',
    'Gurgaon', 'Noida', 'Navi Mumbai', 'Goa', 'Patna',
    'Bhubaneswar', 'Dehradun', 'Ranchi', 'Guwahati', 'Thiruvananthapuram'
];

// Remove duplicates (Thiruvananthapuram appears in both Kerala and India lists)
const UNIQUE_LOCATIONS = [...new Set(LOCATIONS)];

// District/State mapping for structured data
const DISTRICT_MAP = {
    // Kerala
    'Alappuzha': 'Alappuzha', 'Alleppey': 'Alappuzha',
    'Ernakulam': 'Ernakulam', 'Kochi': 'Ernakulam', 'Muvattupuzha': 'Ernakulam',
    'Chalakudy': 'Thrissur', 'Kodungallur': 'Thrissur',
    'Idukki': 'Idukki', 'Munnar': 'Idukki', 'Thodupuzha': 'Idukki',
    'Kannur': 'Kannur', 'Thalassery': 'Kannur', 'Payyanur': 'Kannur', 'Mattannur': 'Kannur',
    'Kasaragod': 'Kasaragod', 'Kanhangad': 'Kasaragod',
    'Kollam': 'Kollam', 'Punalur': 'Kollam', 'Kottarakkara': 'Kollam',
    'Kottayam': 'Kottayam', 'Changanassery': 'Kottayam',
    'Kozhikode': 'Kozhikode', 'Calicut': 'Kozhikode', 'Vatakara': 'Kozhikode', 'Koyilandy': 'Kozhikode',
    'Malappuram': 'Malappuram', 'Manjeri': 'Malappuram', 'Tirur': 'Malappuram',
    'Ponnani': 'Malappuram', 'Perinthalmanna': 'Malappuram', 'Nilambur': 'Malappuram',
    'Palakkad': 'Palakkad',
    'Pathanamthitta': 'Pathanamthitta', 'Chengannur': 'Pathanamthitta',
    'Thiruvananthapuram': 'Thiruvananthapuram', 'Trivandrum': 'Thiruvananthapuram',
    'Neyyattinkara': 'Thiruvananthapuram', 'Nedumangad': 'Thiruvananthapuram',
    'Varkala': 'Thiruvananthapuram', 'Attingal': 'Thiruvananthapuram',
    'Thrissur': 'Thrissur', 'Guruvayur': 'Thrissur',
    'Wayanad': 'Wayanad', 'Sultan Bathery': 'Wayanad', 'Kalpetta': 'Wayanad', 'Mananthavady': 'Wayanad'
};

// State mapping for cities outside Kerala
const STATE_MAP = {
    'Mumbai': 'Maharashtra', 'Navi Mumbai': 'Maharashtra', 'Pune': 'Maharashtra',
    'Nagpur': 'Maharashtra',
    'Delhi': 'Delhi', 'Gurgaon': 'Haryana', 'Noida': 'Uttar Pradesh',
    'Bangalore': 'Karnataka', 'Mysore': 'Karnataka', 'Mangalore': 'Karnataka',
    'Hyderabad': 'Telangana', 'Visakhapatnam': 'Andhra Pradesh',
    'Chennai': 'Tamil Nadu', 'Coimbatore': 'Tamil Nadu',
    'Kolkata': 'West Bengal',
    'Ahmedabad': 'Gujarat', 'Surat': 'Gujarat', 'Vadodara': 'Gujarat',
    'Jaipur': 'Rajasthan',
    'Lucknow': 'Uttar Pradesh',
    'Indore': 'Madhya Pradesh', 'Bhopal': 'Madhya Pradesh',
    'Chandigarh': 'Chandigarh',
    'Goa': 'Goa',
    'Patna': 'Bihar',
    'Bhubaneswar': 'Odisha',
    'Dehradun': 'Uttarakhand',
    'Ranchi': 'Jharkhand',
    'Guwahati': 'Assam'
};

// Determine if a location is in Kerala
function isKeralaLocation(location) {
    return DISTRICT_MAP.hasOwnProperty(location);
}

// Get the region name for a location
function getRegion(location) {
    if (isKeralaLocation(location)) {
        return 'Kerala';
    }
    return STATE_MAP[location] || 'India';
}

// Get district/area context
function getAreaContext(location) {
    if (isKeralaLocation(location)) {
        const district = DISTRICT_MAP[location];
        const isDistrict = location === district;
        return isDistrict ? `in ${location} district, Kerala` : `in ${location} (${district} district), Kerala`;
    }
    const state = STATE_MAP[location] || 'India';
    return `in ${location}, ${state}`;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Read Template
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Function to generate a slug
const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// Generate unique location-specific content section
function generateLocationContent(location) {
    const inContext = getAreaContext(location);
    const region = getRegion(location);
    const isKerala = isKeralaLocation(location);
    const regionPhrase = isKerala ? `${location} and all of Kerala` : `${location} and across ${region}`;
    const nearbyPhrase = isKerala
        ? `across ${location} and the entire ${DISTRICT_MAP[location] || location} region`
        : `in ${location}, ${region}, and across India`;

    return `
  <!-- ===== LOCATION-SPECIFIC CONTENT (SEO) ===== -->
  <section class="location-content-section" id="location-services">
    <div class="container">
      <div class="location-content-grid">
        <div class="location-content-main">
          <h2 class="location-content-heading">Hire a Top Flutter, Mobile App & Web Developer ${inContext}</h2>
          <p>Looking for the <strong>best Flutter developer</strong>, <strong>mobile app developer</strong>, or <strong>web developer in ${location}</strong>? I'm Vaishnav Prabhakaran, a top-rated freelance developer based in Kannur, Kerala — available for projects ${nearbyPhrase}. Whether you're a startup, small business, or enterprise ${inContext}, I deliver high-quality app and web solutions tailored to your needs.</p>
          <p>I specialize in building <strong>cross-platform mobile apps</strong> using Flutter & Dart (Android + iOS from a single codebase), <strong>modern websites & web applications</strong> using Next.js, React, and TypeScript, and <strong>AI-powered solutions</strong> that give your business a competitive edge. From concept to deployment on the Google Play Store and App Store — I handle the full development lifecycle.</p>

          <h3 class="location-services-title">App & Web Development Services in ${location}</h3>
          <div class="location-services-list">
            <div class="location-service-item">
              <i class="fas fa-mobile-alt"></i>
              <div>
                <strong>Flutter & Mobile App Development</strong>
                <p>Custom Android & iOS apps built with Flutter for businesses in ${location}. Cross-platform, pixel-perfect, and production-ready. Published on Google Play Store & App Store.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-globe"></i>
              <div>
                <strong>Website & Web App Development</strong>
                <p>Modern, responsive websites and web applications built with Next.js, React, and TypeScript for clients in ${location}, ${region}.</p>
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
            <h3>FAQ — App Developer in ${location}</h3>
            <details>
              <summary>Do you work with clients in ${location} remotely?</summary>
              <p>Yes! I work with clients ${nearbyPhrase} remotely. I use modern collaboration tools to ensure seamless communication, regular updates, and on-time delivery regardless of location.</p>
            </details>
            <details>
              <summary>What does a Flutter app cost in ${location}?</summary>
              <p>Pricing depends on the app's complexity, features, and timeline. Simple apps start from ₹25,000 while complex apps range from ₹50,000 to ₹2,00,000+. I offer competitive rates for businesses in ${location} — contact me for a free consultation.</p>
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
            <h3>Ready to Start Your Project?</h3>
            <p>Let's build your next app or website. Get in touch for a free project consultation.</p>
            <a href="#contact" class="btn btn-primary">
              <span>Get Free Quote</span>
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
    const region = getRegion(location);
    return `
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Vaishnav Prabhakaran - Top Flutter & App Developer in ${location}",
      "image": "${BASE_URL}/vaishnav.png",
      "url": "${pageUrl}",
      "telephone": "+918078461246",
      "description": "Top-rated Flutter developer, mobile app developer & web developer serving ${location}, ${region}, India. Available for freelance & contract projects.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${location}",
        "addressRegion": "${region}",
        "addressCountry": "IN"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "${location}"
        },
        {
          "@type": "State",
          "name": "${region}"
        },
        {
          "@type": "Country",
          "name": "India"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "App & Web Development Services",
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
              "name": "Android & iOS App Development in ${location}"
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

UNIQUE_LOCATIONS.forEach(location => {
    const locationSlug = slugify(location);
    const fileName = `${locationSlug}.html`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    const pageUrl = `${BASE_URL}/locations/${fileName}`;
    const region = getRegion(location);
    const inContext = getAreaContext(location);

    // Customize Content
    let pageContent = template;

    // 1. Update Title — action-oriented for CTR
    const title = `Hire Best Flutter & App Developer in ${location}, ${region} | Vaishnav Prabhakaran`;
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

    // 2. Update Meta Description — compelling, CTA-driven
    const description = `Looking for the best Flutter developer or mobile app developer in ${location}? Hire Vaishnav Prabhakaran \u2014 top-rated freelance Flutter, Android, iOS & web developer in ${location}, ${region}. 10+ apps built. Get a free quote today!`;
    pageContent = pageContent.replace(/<meta name="description"\s*\n?\s*content=".*?" \/>/, `<meta name="description"\n    content="${description}" />`);

    // 3. Update Keywords — India-wide + location-specific
    const specificKeywords = `Flutter Developer ${location}, Mobile App Developer ${location}, Web Developer ${location}, App Developer ${location}, Android Developer ${location}, iOS Developer ${location}, hire Flutter developer ${location}, hire app developer ${location}, hire web developer ${location}, best app developer ${location}, ${location} app development, ${location} website development, app developer near me, mobile developer near me, web developer near me, Flutter Developer India, Mobile App Developer India, freelance app developer ${location}, ${location} ${region}`;
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
        <h2 class="location-seo-title">Top Flutter, Mobile App &amp; Web Developer in <span>${location}, ${region}</span></h2>
        <p class="location-seo-desc">Hire the best Flutter developer or app developer in ${location}. Vaishnav Prabhakaran delivers expert Android &amp; iOS app development, modern website development, and AI-powered solutions to businesses and startups in ${location} and across India.</p>
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
