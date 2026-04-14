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
    'App Developer',
    'Freelance App Developer',
    'Flutter Developer Near Me',
    'Mobile App Developer Near Me',
    'App Developer Near Me'
];

const LOCATIONS = [
    // ===== KERALA — Districts =====
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
    'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
    'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
    // Kerala — Cities/Towns
    'Kochi', 'Trivandrum', 'Calicut', 'Alleppey', 'Munnar', 'Varkala',
    'Guruvayur', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad',
    'Payyanur', 'Koyilandy', 'Neyyattinkara', 'Manjeri', 'Nedumangad',
    'Tirur', 'Punalur', 'Muvattupuzha', 'Chengannur', 'Changanassery',
    'Thodupuzha', 'Chalakudy', 'Kodungallur', 'Perinthalmanna', 'Kottarakkara',
    'Nilambur', 'Attingal', 'Mattannur', 'Sultan Bathery', 'Kalpetta', 'Mananthavady',

    // ===== KARNATAKA — Major Cities =====
    'Bangalore', 'Bengaluru', 'Mysore', 'Mysuru', 'Mangalore', 'Mangaluru',
    'Hubli', 'Dharwad', 'Belgaum', 'Belagavi',
    'Gulbarga', 'Kalaburagi', 'Shimoga', 'Shivamogga',
    'Davangere', 'Bellary', 'Ballari',
    'Udupi', 'Hassan', 'Tumkur', 'Tumakuru',
    'Chitradurga', 'Mandya', 'Raichur', 'Bidar', 'Bagalkot',
    'Chikmagalur', 'Gadag',

    // ===== TAMIL NADU — Major Cities =====
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Trichy',
    'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Tuticorin',
    'Thanjavur', 'Dindigul', 'Hosur', 'Nagercoil',
    'Tiruppur', 'Kanchipuram', 'Cuddalore', 'Kumbakonam',
    'Pollachi', 'Ooty', 'Karur'
];

// Remove duplicates
const UNIQUE_LOCATIONS = [...new Set(LOCATIONS)];

// ===== District/State Mapping =====

// Kerala district mapping
const KERALA_DISTRICT_MAP = {
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

// Karnataka city mapping
const KARNATAKA_MAP = {
    'Bangalore': 'Karnataka', 'Bengaluru': 'Karnataka',
    'Mysore': 'Karnataka', 'Mysuru': 'Karnataka',
    'Mangalore': 'Karnataka', 'Mangaluru': 'Karnataka',
    'Hubli': 'Karnataka', 'Dharwad': 'Karnataka',
    'Belgaum': 'Karnataka', 'Belagavi': 'Karnataka',
    'Gulbarga': 'Karnataka', 'Kalaburagi': 'Karnataka',
    'Shimoga': 'Karnataka', 'Shivamogga': 'Karnataka',
    'Davangere': 'Karnataka', 'Bellary': 'Karnataka', 'Ballari': 'Karnataka',
    'Udupi': 'Karnataka', 'Hassan': 'Karnataka',
    'Tumkur': 'Karnataka', 'Tumakuru': 'Karnataka',
    'Chitradurga': 'Karnataka', 'Mandya': 'Karnataka',
    'Raichur': 'Karnataka', 'Bidar': 'Karnataka', 'Bagalkot': 'Karnataka',
    'Chikmagalur': 'Karnataka', 'Gadag': 'Karnataka'
};

// Tamil Nadu city mapping
const TAMILNADU_MAP = {
    'Chennai': 'Tamil Nadu', 'Coimbatore': 'Tamil Nadu',
    'Madurai': 'Tamil Nadu', 'Tiruchirappalli': 'Tamil Nadu', 'Trichy': 'Tamil Nadu',
    'Salem': 'Tamil Nadu', 'Tirunelveli': 'Tamil Nadu',
    'Erode': 'Tamil Nadu', 'Vellore': 'Tamil Nadu',
    'Thoothukudi': 'Tamil Nadu', 'Tuticorin': 'Tamil Nadu',
    'Thanjavur': 'Tamil Nadu', 'Dindigul': 'Tamil Nadu',
    'Hosur': 'Tamil Nadu', 'Nagercoil': 'Tamil Nadu',
    'Tiruppur': 'Tamil Nadu', 'Kanchipuram': 'Tamil Nadu',
    'Cuddalore': 'Tamil Nadu', 'Kumbakonam': 'Tamil Nadu',
    'Pollachi': 'Tamil Nadu', 'Ooty': 'Tamil Nadu', 'Karur': 'Tamil Nadu'
};

// Combined state map
const STATE_MAP = { ...KARNATAKA_MAP, ...TAMILNADU_MAP };

// Helper functions
function isKeralaLocation(location) {
    return KERALA_DISTRICT_MAP.hasOwnProperty(location);
}

function isKarnatakaLocation(location) {
    return KARNATAKA_MAP.hasOwnProperty(location);
}

function isTamilNaduLocation(location) {
    return TAMILNADU_MAP.hasOwnProperty(location);
}

function getRegion(location) {
    if (isKeralaLocation(location)) return 'Kerala';
    if (isKarnatakaLocation(location)) return 'Karnataka';
    if (isTamilNaduLocation(location)) return 'Tamil Nadu';
    return 'South India';
}

function getAreaContext(location) {
    if (isKeralaLocation(location)) {
        const district = KERALA_DISTRICT_MAP[location];
        const isDistrict = location === district;
        return isDistrict ? `in ${location} district, Kerala` : `in ${location} (${district} district), Kerala`;
    }
    const state = STATE_MAP[location] || 'South India';
    return `in ${location}, ${state}`;
}

// Geo coordinates for schema (approximate, for major cities)
const GEO_COORDS = {
    'Kannur': { lat: '11.8745', lng: '75.3704' },
    'Kochi': { lat: '9.9312', lng: '76.2673' },
    'Thiruvananthapuram': { lat: '8.5241', lng: '76.9366' },
    'Kozhikode': { lat: '11.2588', lng: '75.7804' },
    'Bangalore': { lat: '12.9716', lng: '77.5946' },
    'Bengaluru': { lat: '12.9716', lng: '77.5946' },
    'Mysore': { lat: '12.2958', lng: '76.6394' },
    'Mysuru': { lat: '12.2958', lng: '76.6394' },
    'Mangalore': { lat: '12.9141', lng: '74.8560' },
    'Mangaluru': { lat: '12.9141', lng: '74.8560' },
    'Chennai': { lat: '13.0827', lng: '80.2707' },
    'Coimbatore': { lat: '11.0168', lng: '76.9558' },
    'Madurai': { lat: '9.9252', lng: '78.1198' },
    'Hubli': { lat: '15.3647', lng: '75.1240' },
    'Salem': { lat: '11.6643', lng: '78.1460' },
};

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
        ? `across ${location} and the entire ${KERALA_DISTRICT_MAP[location] || location} region`
        : `in ${location}, ${region}, and across South India`;

    return `
  <!-- ===== LOCATION-SPECIFIC CONTENT (SEO) ===== -->
  <section class="location-content-section" id="location-services">
    <div class="container">
      <div class="location-content-grid">
        <div class="location-content-main">
          <h2 class="location-content-heading">Hire a Top Flutter & Mobile App Developer Near Me ${inContext}</h2>
          <p>Looking for the <strong>best Flutter developer near me</strong> or <strong>mobile app developer near me</strong> in <strong>${location}</strong>? I'm Vaishnav Prabhakaran, a top-rated freelance developer based in Kannur, Kerala — available for projects ${nearbyPhrase}. Whether you're a startup, small business, or enterprise ${inContext}, I deliver high-quality app and web solutions tailored to your needs.</p>
          <p>I specialize in building <strong>cross-platform mobile apps</strong> using Flutter & Dart (Android + iOS from a single codebase), <strong>modern websites & web applications</strong> using Next.js, React, and TypeScript, and <strong>AI-powered solutions</strong> that give your business a competitive edge. From concept to deployment on the Google Play Store and App Store — I handle the full development lifecycle.</p>

          <h3 class="location-services-title">App & Web Development Services in ${location} — Flutter Developer Near Me</h3>
          <div class="location-services-list">
            <div class="location-service-item">
              <i class="fas fa-mobile-alt"></i>
              <div>
                <strong>Flutter & Mobile App Development in ${location}</strong>
                <p>Custom Android & iOS apps built with Flutter for businesses in ${location}. Cross-platform, pixel-perfect, and production-ready. Published on Google Play Store & App Store. If you're searching for a mobile app developer near me in ${location}, ${region} — I'm here to help.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-globe"></i>
              <div>
                <strong>Website & Web App Development in ${location}</strong>
                <p>Modern, responsive websites and web applications built with Next.js, React, and TypeScript for clients in ${location}, ${region}. SEO-optimized and fast-loading.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-robot"></i>
              <div>
                <strong>AI-Powered Solutions for ${location} Businesses</strong>
                <p>Smart chatbots, AI integrations, and automation tools to help ${location}-based businesses work smarter and scale faster.</p>
              </div>
            </div>
            <div class="location-service-item">
              <i class="fas fa-paint-brush"></i>
              <div>
                <strong>UI/UX Design & Prototyping</strong>
                <p>Beautiful, user-focused interfaces designed in Figma — modern design systems and premium aesthetics for apps and websites.</p>
              </div>
            </div>
          </div>

          <h3 class="location-services-title">Why Choose Me as Your App Developer in ${location}?</h3>
          <ul class="location-why-list">
            <li><i class="fas fa-check-circle"></i> <strong>10+ apps built</strong> — Published on Google Play Store with real users</li>
            <li><i class="fas fa-check-circle"></i> <strong>100% client satisfaction</strong> — On-time delivery, clean code, ongoing support</li>
            <li><i class="fas fa-check-circle"></i> <strong>Cross-platform expertise</strong> — Single codebase for Android + iOS with Flutter</li>
            <li><i class="fas fa-check-circle"></i> <strong>Serving ${region}</strong> — Available for projects in ${location} and across ${region}, Kerala, Karnataka & Tamil Nadu</li>
          </ul>
        </div>
        <div class="location-content-sidebar">
          <div class="location-faq glass-card">
            <h3>FAQ — Flutter Developer Near Me in ${location}</h3>
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
            <details>
              <summary>Are you the best Flutter developer near me in ${location}?</summary>
              <p>I'm a top-rated Flutter developer serving ${location}, ${region}. With 10+ published apps, expertise in Flutter, Dart, Next.js, and AI integration — I deliver premium mobile and web solutions. Check my portfolio and client reviews above.</p>
            </details>
          </div>
          <div class="location-cta glass-card">
            <h3>Ready to Start Your Project in ${location}?</h3>
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
    const coords = GEO_COORDS[location] || GEO_COORDS['Kannur'];

    return `
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Vaishnav Prabhakaran - Top Flutter & Mobile App Developer in ${location}",
      "image": "${BASE_URL}/vaishnav.png",
      "url": "${pageUrl}",
      "telephone": "+918078461246",
      "description": "Best Flutter developer near me in ${location}. Top-rated mobile app developer, Android & iOS developer, and web developer serving ${location}, ${region}. Hire the best app developer near me.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${location}",
        "addressRegion": "${region}",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "${coords.lat}",
        "longitude": "${coords.lng}"
      },
      "areaServed": [
        { "@type": "City", "name": "${location}" },
        { "@type": "State", "name": "${region}" },
        { "@type": "State", "name": "Kerala" },
        { "@type": "State", "name": "Karnataka" },
        { "@type": "State", "name": "Tamil Nadu" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "App & Web Development Services in ${location}",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flutter App Development in ${location}" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Developer Near Me in ${location}" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Android & iOS App Development in ${location}" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website & Web App Development in ${location}" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Integration & Automation in ${location}" } }
        ]
      },
      "priceRange": "$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "bestRating": "5",
        "ratingCount": "12"
      }
    }
  </script>

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is the best Flutter developer near me in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Vaishnav Prabhakaran is a top-rated Flutter developer serving ${location}, ${region}. With 10+ published apps, expertise in Flutter, Dart, Next.js, and AI integration, he delivers premium mobile and web solutions for businesses in ${location}."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost to hire a mobile app developer in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flutter app development costs in ${location} vary by complexity. Simple apps start from ₹25,000, while complex apps with backend and AI features range from ₹50,000 to ₹2,00,000+. Contact Vaishnav Prabhakaran for a free consultation."
          }
        },
        {
          "@type": "Question",
          "name": "Can you build both Android and iOS apps in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Flutter builds beautiful, high-performance apps for both Android and iOS from a single codebase — faster development, lower cost, and consistent UX for businesses in ${location}."
          }
        },
        {
          "@type": "Question",
          "name": "How long does app development take in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A typical Flutter mobile app takes 4-12 weeks depending on complexity. Simple websites can be delivered in 1-3 weeks. Realistic timelines provided upfront for ${location} clients."
          }
        }
      ]
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
console.log('🚀 Starting page generation for Kerala, Karnataka & Tamil Nadu...');

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

    // 1. Update Title — heavy "near me" + action-oriented for CTR
    const title = `Best Flutter & Mobile App Developer Near Me in ${location}, ${region} | Vaishnav Prabhakaran`;
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

    // 2. Update Meta Description — compelling, "near me" CTA-driven
    const description = `Looking for the best Flutter developer near me in ${location}? Hire Vaishnav Prabhakaran \u2014 #1 freelance Flutter, Android, iOS & mobile app developer in ${location}, ${region}. 10+ apps built. Get a free quote today!`;
    pageContent = pageContent.replace(/<meta name="description"\s*\n?\s*content=".*?" \/>/, `<meta name="description"\n    content="${description}" />`);

    // 3. Update Keywords — heavy "near me" + location-specific
    const specificKeywords = `flutter developer near me, mobile app developer near me, app developer near me, best flutter developer near me, Flutter Developer ${location}, Mobile App Developer ${location}, Web Developer ${location}, App Developer ${location}, Android Developer ${location}, iOS Developer ${location}, hire Flutter developer ${location}, hire app developer ${location}, best app developer ${location}, ${location} app development, ${location} website development, flutter developer near me ${location}, mobile app developer near me ${location}, app developer near me ${location}, web developer near me, Flutter Developer ${region}, Mobile App Developer ${region}, freelance app developer ${location}, Vaishnav Prabhakaran`;
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
        <h2 class="location-seo-title">Best Flutter & Mobile App Developer Near Me in <span>${location}, ${region}</span></h2>
        <p class="location-seo-desc">Searching for a Flutter developer near me or mobile app developer near me in ${location}? Vaishnav Prabhakaran delivers expert Android &amp; iOS app development, modern website development, and AI-powered solutions to businesses and startups in ${location}, ${region}.</p>
      </div>
    </div>
  </div>`;

    pageContent = pageContent.replace(/<body>/, `<body>\n${locationBanner}`);

    // 8. Inject location-specific content section BEFORE the footer
    const locationContent = generateLocationContent(location);
    pageContent = pageContent.replace(/<footer class="footer">/, `${locationContent}\n\n  <footer class="footer">`);

    // 9. Fix Relative Paths (CSS/Images/JS)
    pageContent = pageContent.replace(/href="styles.css"/g, 'href="../styles.css"');
    pageContent = pageContent.replace(/src="script.js"/g, 'src="../script.js"');
    pageContent = pageContent.replace(/src="vaishnav.png"/g, 'src="../vaishnav.png"');
    pageContent = pageContent.replace(/src="media__1771423611621.png"/g, 'src="../media__1771423611621.png"');
    // Fix preload path for locations
    pageContent = pageContent.replace(/href="vaishnav.png"/g, 'href="../vaishnav.png"');

    // Write File
    fs.writeFileSync(filePath, pageContent);
    console.log(`✅ Generated: ${fileName} (${region})`);

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

console.log(`\n🎉 Success! Generated ${pageCount} location pages for Kerala, Karnataka & Tamil Nadu.`);
console.log(`📊 Sitemap rebuilt with ${sitemapUrls.length} unique URLs (1 homepage + ${pageCount} location pages).`);
console.log(`\n📍 Breakdown:`);
console.log(`   Kerala: ${UNIQUE_LOCATIONS.filter(l => isKeralaLocation(l)).length} pages`);
console.log(`   Karnataka: ${UNIQUE_LOCATIONS.filter(l => isKarnatakaLocation(l)).length} pages`);
console.log(`   Tamil Nadu: ${UNIQUE_LOCATIONS.filter(l => isTamilNaduLocation(l)).length} pages`);
