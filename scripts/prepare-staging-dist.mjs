import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

console.log('--- PREPARING STAGING ENVIRONMENT BUILD OUTPUT ---');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found.');
  process.exit(1);
}

// 1. Create Staging robots.txt (Disallow all bots)
const stagingRobotsTxt = `User-agent: *\nDisallow: /\n`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), stagingRobotsTxt, 'utf8');
console.log('  ✔ Created staging robots.txt (Disallow: /)');

// 2. Create Staging .htaccess with X-Robots-Tag, No-Cache headers, and Security settings
const stagingHtaccess = `# Staging Security & Search Engine Blocking
Header set X-Robots-Tag "noindex, nofollow"

# Disable Browser Caching for Instant Staging Updates
<IfModule mod_headers.c>
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</IfModule>

# Basic Authentication (Optional / Onamae.com Setup)
# AuthType Basic
# AuthName "IGNITE Staging Environment"
# AuthUserFile /home/r0445204/public_html/staging.ignite-official.site/.htpasswd
# Require valid-user
`;
fs.writeFileSync(path.join(distDir, '.htaccess'), stagingHtaccess, 'utf8');
console.log('  ✔ Created staging .htaccess with no-cache & X-Robots-Tag');

// 3. Recursively inject noindex meta tags and [STAGING] titles into HTML files
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Inject noindex meta tag if not present
      if (!content.includes('name="robots"')) {
        content = content.replace(
          '</head>',
          '    <meta name="robots" content="noindex, nofollow" />\n  </head>'
        );
      }

      // Add [STAGING] prefix to title tags
      content = content.replace(/<title>(.*?)<\/title>/, (match, title) => {
        if (title.startsWith('[STAGING]')) return match;
        return `<title>[STAGING] ${title}</title>`;
      });

      // Add [STAGING] prefix to OGP title tags
      content = content.replace(/content="(.*?) — (.*?)"/, (match, p1, p2) => {
        if (match.includes('STAGING')) return match;
        return match.replace(p1, `[STAGING] ${p1}`);
      });

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(distDir);
console.log('  ✔ Injected noindex meta tags and [STAGING] titles into all HTML files in dist/');
console.log('✔ Staging preparation completed successfully!');
