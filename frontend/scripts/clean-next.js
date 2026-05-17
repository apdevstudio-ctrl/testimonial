/**
 * Remove .next before build — avoids OneDrive EINVAL on next build's internal delete.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const localNext = path.join(process.cwd(), '.next');

if (!fs.existsSync(localNext)) {
  process.exit(0);
}

try {
  if (process.platform === 'win32') {
    // Junction from link-next-dir (legacy): rmdir unlinks without deleting target
    execSync(`cmd /c rmdir /s /q "${localNext}"`, { stdio: 'pipe' });
  } else {
    fs.rmSync(localNext, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
  }
  console.log('Removed .next');
} catch {
  fs.rmSync(localNext, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
  console.log('Removed .next (fallback)');
}
