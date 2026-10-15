import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard Brand SVG (for display, browser tabs, and standard PNGs)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#070D1E" />
    </linearGradient>

    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="60%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="cyanAccent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>

    <linearGradient id="amberGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>

    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5" />
    </filter>

    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base with subtle border -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="506" height="506" x="3" y="3" rx="109" fill="none" stroke="#1E293B" stroke-width="3" opacity="0.6" />

  <!-- Background Ambient Glow -->
  <circle cx="256" cy="240" r="170" fill="#2563EB" opacity="0.12" filter="url(#neonGlow)" />

  <!-- Garage / Arch Peak (Shelter & Fleet Authority) -->
  <g filter="url(#shadow)">
    <!-- Roof Canopy Chevron -->
    <path d="M128 190 L256 96 L384 190 L360 216 L256 140 L152 216 Z" fill="url(#roofGrad)" />
    
    <!-- Top Crown / Speed Pin -->
    <polygon points="256,66 268,90 244,90" fill="url(#amberGold)" />

    <!-- Garage Pillar Accents -->
    <rect x="144" y="210" width="16" height="180" rx="8" fill="#1E293B" />
    <rect x="352" y="210" width="16" height="180" rx="8" fill="#1E293B" />
    
    <!-- Vehicle Silhouette Body -->
    <!-- Cabin Roof -->
    <path d="M196 226 L316 226 Q340 226 348 248 L368 300 Q374 316 356 316 L156 316 Q138 316 144 300 L164 248 Q172 226 196 226 Z" fill="#0F172A" stroke="url(#blueGlow)" stroke-width="6" />

    <!-- Windshield -->
    <path d="M206 242 L306 242 L326 294 L186 294 Z" fill="url(#cyanAccent)" opacity="0.85" />

    <!-- Windshield Center Divider -->
    <line x1="256" y1="242" x2="256" y2="294" stroke="#0F172A" stroke-width="4" />

    <!-- Main Front Grille & Bumper -->
    <rect x="160" y="324" width="192" height="80" rx="18" fill="url(#blueGlow)" />
    <rect x="174" y="338" width="164" height="40" rx="10" fill="#0B1329" />

    <!-- Grille Bars (Horizontal high-tech lines) -->
    <line x1="190" y1="348" x2="322" y2="348" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <line x1="190" y1="358" x2="322" y2="358" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <line x1="190" y1="368" x2="322" y2="368" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />

    <!-- Headlights (Left & Right Modern LEDs) -->
    <polygon points="172,328 206,328 196,338 172,336" fill="#FFFFFF" />
    <polygon points="340,328 306,328 316,338 340,336" fill="#FFFFFF" />
    <circle cx="188" cy="333" r="3" fill="#38BDF8" />
    <circle cx="324" cy="333" r="3" fill="#38BDF8" />

    <!-- Lower Fog Lights / DRLs -->
    <rect x="176" y="386" width="32" height="8" rx="4" fill="url(#amberGold)" />
    <rect x="304" y="386" width="32" height="8" rx="4" fill="url(#amberGold)" />

    <!-- Central 'M' Emblem on Grille -->
    <g transform="translate(236, 343)">
      <path d="M0 26 L0 4 L10 16 L20 4 L20 26 L15 26 L15 13 L10 19 L5 13 L5 26 Z" fill="url(#amberGold)" />
    </g>

    <!-- Wheels / Tires Underbody -->
    <rect x="146" y="378" width="22" height="42" rx="8" fill="#020617" stroke="#334155" stroke-width="3" />
    <rect x="344" y="378" width="22" height="42" rx="8" fill="#020617" stroke="#334155" stroke-width="3" />
  </g>

  <!-- Bottom Brand Text 'MIGARAGE' -->
  <text x="256" y="458" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" letter-spacing="4" fill="#FFFFFF">
    MI<tspan fill="#38BDF8">GARAGE</tspan>
  </text>
</svg>`;

// 2. Maskable SVG: Full-bleed background with emblem in central safe zone (80% circle, padded)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#070D1E" />
    </linearGradient>

    <linearGradient id="mBlueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="60%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="mCyanAccent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>

    <linearGradient id="mAmberGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <linearGradient id="mRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
  </defs>

  <!-- 100% full bleed background for maskable circle/squircle cutting -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Scaled content centered within the 76% safe zone circle (scale 0.78 around 256,256) -->
  <g transform="translate(56, 42) scale(0.78)">
    <!-- Roof Canopy Chevron -->
    <path d="M128 190 L256 96 L384 190 L360 216 L256 140 L152 216 Z" fill="url(#mRoofGrad)" />
    
    <!-- Top Crown -->
    <polygon points="256,66 268,90 244,90" fill="url(#mAmberGold)" />

    <!-- Garage Pillar Accents -->
    <rect x="144" y="210" width="16" height="180" rx="8" fill="#1E293B" />
    <rect x="352" y="210" width="16" height="180" rx="8" fill="#1E293B" />
    
    <!-- Vehicle Silhouette Body -->
    <path d="M196 226 L316 226 Q340 226 348 248 L368 300 Q374 316 356 316 L156 316 Q138 316 144 300 L164 248 Q172 226 196 226 Z" fill="#0F172A" stroke="url(#mBlueGlow)" stroke-width="6" />

    <!-- Windshield -->
    <path d="M206 242 L306 242 L326 294 L186 294 Z" fill="url(#mCyanAccent)" opacity="0.85" />
    <line x1="256" y1="242" x2="256" y2="294" stroke="#0F172A" stroke-width="4" />

    <!-- Main Front Grille & Bumper -->
    <rect x="160" y="324" width="192" height="80" rx="18" fill="url(#mBlueGlow)" />
    <rect x="174" y="338" width="164" height="40" rx="10" fill="#0B1329" />

    <!-- Grille Bars -->
    <line x1="190" y1="348" x2="322" y2="348" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <line x1="190" y1="358" x2="322" y2="358" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <line x1="190" y1="368" x2="322" y2="368" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8" />

    <!-- Headlights -->
    <polygon points="172,328 206,328 196,338 172,336" fill="#FFFFFF" />
    <polygon points="340,328 306,328 316,338 340,336" fill="#FFFFFF" />
    <circle cx="188" cy="333" r="3" fill="#38BDF8" />
    <circle cx="324" cy="333" r="3" fill="#38BDF8" />

    <!-- Lower Fog Lights -->
    <rect x="176" y="386" width="32" height="8" rx="4" fill="url(#mAmberGold)" />
    <rect x="304" y="386" width="32" height="8" rx="4" fill="url(#mAmberGold)" />

    <!-- Central 'M' Emblem on Grille -->
    <g transform="translate(236, 343)">
      <path d="M0 26 L0 4 L10 16 L20 4 L20 26 L15 26 L15 13 L10 19 L5 13 L5 26 Z" fill="url(#mAmberGold)" />
    </g>

    <!-- Wheels -->
    <rect x="146" y="378" width="22" height="42" rx="8" fill="#020617" stroke="#334155" stroke-width="3" />
    <rect x="344" y="378" width="22" height="42" rx="8" fill="#020617" stroke="#334155" stroke-width="3" />

    <text x="256" y="458" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" letter-spacing="4" fill="#FFFFFF">
      MI<tspan fill="#38BDF8">GARAGE</tspan>
    </text>
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg, 'utf8');
  console.log('Saved SVG icons to public/');

  const stdBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 1. pwa-192x192.png
  await sharp(stdBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 2. pwa-512x512.png
  await sharp(stdBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 3. pwa-maskable-512x512.png
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(stdBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 5. favicon-32x32.png
  await sharp(stdBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  // 6. favicon.ico
  await sharp(stdBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  console.log('All PWA and mobile shortcut icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
