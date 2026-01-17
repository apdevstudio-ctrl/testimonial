const fs = require('fs');
const path = require('path');

// This script copies the built testimonial script to the public directory
// so it can be served by Vercel during deployment

const projectRoot = process.cwd();
const scriptSource = path.join(projectRoot, '..', 'script', 'dist', 'testimonial-script.js');
const scriptDest = path.join(projectRoot, 'public', 'script.js');

console.log('📦 Copying testimonial script for deployment...');
console.log('Source:', scriptSource);
console.log('Destination:', scriptDest);

// Check if source exists
if (!fs.existsSync(scriptSource)) {
  console.warn('⚠️  Warning: Script file not found at:', scriptSource);
  console.warn('   Make sure to run "npm run build:script" in the script directory first.');
  // Create empty public directory if it doesn't exist
  const publicDir = path.dirname(scriptDest);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  // Create a placeholder file so build doesn't fail
  fs.writeFileSync(scriptDest, 'console.warn("Testimonial script not built. Please build the script package first.");');
  console.warn('   Created placeholder file. Script will not work until built.');
  process.exit(0);
}

// Ensure public directory exists
const publicDir = path.dirname(scriptDest);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy the file
try {
  fs.copyFileSync(scriptSource, scriptDest);
  console.log('✅ Script copied successfully!');
  
  // Verify the file
  const stats = fs.statSync(scriptDest);
  console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Error copying script:', error.message);
  process.exit(1);
}

