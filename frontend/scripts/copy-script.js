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
  console.warn('   This is normal on Vercel deployments where only frontend directory is available.');
  
  // If destination already exists (committed file), don't overwrite it
  if (fs.existsSync(scriptDest)) {
    console.log('✅ Script file already exists in public/ directory. Skipping copy.');
    const stats = fs.statSync(scriptDest);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    process.exit(0);
  }
  
  // Only create placeholder if destination doesn't exist
  const publicDir = path.dirname(scriptDest);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  console.warn('   No script file found. Build will continue but script.js route may not work.');
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

