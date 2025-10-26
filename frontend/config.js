// Configuration for API endpoints
// Automatically detects environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : '/api';

console.log('API Base URL:', API_BASE_URL);

