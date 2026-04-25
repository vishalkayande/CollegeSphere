// This configuration automatically detects if you are in production or development
const isDevelopment = window.location.hostname === 'localhost' && window.location.port !== '80';

// In production (Docker/EC2), we use relative paths ('')
// In local development (npm run dev), we point to the backend port 5002
export const API_URL = isDevelopment ? 'http://localhost:5002' : '';

console.log('API_URL Mode:', isDevelopment ? 'Development (localhost:5002)' : 'Production (Relative)');
console.log('Current Origin:', window.location.origin);

