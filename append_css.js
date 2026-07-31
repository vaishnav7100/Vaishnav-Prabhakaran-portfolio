const fs = require('fs');

const css = `
/* ═══════════════════════════════════════════════════════
   LOCATION SEO CONTENT
═══════════════════════════════════════════════════════ */
.location-seo-banner, .location-content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) var(--pad);
}

.location-seo-inner, .location-content-main {
  background: var(--card-bg);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: clamp(20px, 4vw, 36px);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.7;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.location-seo-inner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.location-seo-inner i {
  font-size: 2rem;
  color: var(--accent);
  margin-top: 5px;
}

.location-seo-title, .location-content-heading, .location-services-title {
  font-family: var(--font-disp);
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--fg);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.location-seo-title span {
  color: var(--accent);
}

.location-content-main p {
  margin-bottom: 16px;
}

.location-services-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.location-service-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.location-service-item i {
  font-size: 1.5rem;
  color: var(--accent);
  background: var(--bg2);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border2);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.location-service-item strong {
  display: block;
  font-size: 1.1rem;
  color: var(--fg);
  margin-bottom: 6px;
}
`;

fs.appendFileSync('styles.css', css, 'utf8');
console.log('Appended styles');
