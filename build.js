const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const EXTENSION_FILES = [
  'background.js',
  'icon.png',
  'icon.svg',
  'icon128.png',
  'icon16.png',
  'icon48.png',
  'popup.html',
  'popup.js',
  'README.md',
  // Add other files if needed
];

function copyManifest(browser) {
  const manifestSrc = browser === 'chrome' ? 'manifest-chrome.json' : 'manifest-firefox.json';
  fs.copyFileSync(manifestSrc, 'manifest.json');
}

function packExtension(browser) {
  const output = fs.createWriteStream(`${browser}-extension.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`${browser}-extension.zip created (${archive.pointer()} bytes)`);
  });

  archive.pipe(output);

  EXTENSION_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      archive.file(file, { name: file });
    }
  });
  archive.file('manifest.json', { name: 'manifest.json' });

  archive.finalize();
}

function build(browser) {
  copyManifest(browser);
  packExtension(browser);
}

['chrome', 'firefox'].forEach(build);

