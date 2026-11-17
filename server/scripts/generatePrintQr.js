// ============================================================
// Smriti Pass — Print-Ready QR Fridge Magnet Generator
// Generates Vector SVG & High-Resolution 300 DPI PNG for 50mm x 50mm Magnets
// ============================================================
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generatePrintAssets() {
  const assetsDir = path.join(__dirname, '..', '..', 'public', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Target public HTTPS URL for the Agra pilot
  const publicUrl = process.env.PUBLIC_URL || 'https://smritipass.org/#tourist';
  console.log(`Generating print-ready QR assets targeting: ${publicUrl}`);

  // 1. Generate High-Precision Vector SVG with quiet zone and luxury branding frame
  const rawQrSvg = await QRCode.toString(publicUrl, {
    type: 'svg',
    margin: 4, // Strict 4-module quiet zone required for physical scanning
    color: {
      dark: '#1a1a3e', // Deep Navy
      light: '#ffffff', // Pure White
    },
    errorCorrectionLevel: 'H', // 30% error correction allows centre badge
  });

  // Wrap in print-ready badge frame for 50mm x 50mm (590px x 590px at 300 DPI)
  const fullMagnetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <!-- Fridge Magnet Background with Rounded Corners -->
  <rect width="600" height="700" rx="30" fill="#f7f3ec" stroke="#c9a84c" stroke-width="8"/>
  
  <!-- Header Branding Banner -->
  <rect x="20" y="20" width="560" height="110" rx="20" fill="#1a1a3e"/>
  <text x="300" y="70" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    SMRITI PASS
  </text>
  <text x="300" y="105" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#c9a84c" text-anchor="middle" letter-spacing="2">
    HANDMADE • HONEST • HERITAGE
  </text>

  <!-- QR Code Container (400x400) -->
  <g transform="translate(100, 150)">
    <rect width="400" height="400" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
    <g transform="scale(0.85) translate(35, 35)">
      ${rawQrSvg.replace(/<\?xml.*?\?>/, '').replace(/<svg.*?>/, '').replace(/<\/svg>/, '')}
    </g>
  </g>

  <!-- Center Heritage Logo inside QR -->
  <circle cx="300" cy="350" r="28" fill="#1a1a3e" stroke="#c9a84c" stroke-width="4"/>
  <text x="300" y="358" font-size="24" text-anchor="middle">🏛️</text>

  <!-- Call to Action Footer -->
  <text x="300" y="585" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#1a1a3e" text-anchor="middle">
    Scan with Phone Camera
  </text>
  <text x="300" y="612" font-family="'Inter', sans-serif" font-size="13" font-weight="500" fill="#6e6e88" text-anchor="middle">
    Direct from Agra Master Artisans • 70% Direct Payout
  </text>
  <text x="300" y="640" font-family="monospace" font-size="11" font-weight="600" fill="#c9a84c" text-anchor="middle">
    ${publicUrl}
  </text>
  <text x="300" y="670" font-family="'Inter', sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">
    Standard 50mm × 50mm Physical Fridge Magnet Asset (300 DPI Target)
  </text>
</svg>`;

  const svgPath = path.join(assetsDir, 'qr-fridge-magnet-print.svg');
  fs.writeFileSync(svgPath, fullMagnetSvg);
  console.log(`✅ Vector SVG Magnet Asset saved to: ${svgPath}`);

  // 2. Generate 1200x1200px High-Resolution PNG (300 DPI print fidelity)
  const pngPath = path.join(assetsDir, 'qr-fridge-magnet-1200.png');
  await QRCode.toFile(pngPath, publicUrl, {
    width: 1200,
    margin: 4,
    color: {
      dark: '#1a1a3e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });
  console.log(`✅ 1200x1200px 300 DPI PNG QR asset saved to: ${pngPath}`);
}

if (require.main === module) {
  generatePrintAssets().catch(err => {
    console.error('Failed to generate print assets:', err);
    process.exit(1);
  });
}

module.exports = { generatePrintAssets };
