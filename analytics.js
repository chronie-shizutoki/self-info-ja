// analytics.js - Visit Statistics Function

// Database configuration
const DB_URL = 'libsql://self-info-ja-chronie-shizutoki.aws-ap-northeast-1.turso.io';

// Get the token from environment variables or GitHub Secrets
// Note: In a production environment, the token should be stored and retrieved securely
// For GitHub Pages deployment, we'll use a different approach to get the token
// This function will be replaced during the build process with the actual token
const getDbToken = () => {
  // Check if we're in a development environment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return localStorage.getItem('DB_TOKEN') || 'YOUR_DEFAULT_TOKEN';
  }
  // For production (GitHub Pages), the token will be injected during build
  // This placeholder will be replaced by the actual token
  return 'DB_TOKEN_PLACEHOLDER';
};

// Get the visitor's IP address
const getVisitorIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return 'unknown';
  }
};

// Initialize the database connection
const initDb = async () => {
  // Dynamically import the libsql client
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@libsql/client@0.6.0/+esm');

  const client = createClient({
    url: DB_URL,
    authToken: getDbToken()
  });

  return client;
};

// Create the visit record table if it doesn't exist
const createTable = async (client) => {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS visitor_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT
      )
    `);
    console.log('Visit record table created successfully');
  } catch (error) {
    console.error('Failed to create visit record table:', error);
  }
};

// Record visit information
const recordVisit = async () => {
  try {
    const client = await initDb();
    await createTable(client);

    const ip = await getVisitorIP();
    const userAgent = navigator.userAgent;

    await client.execute({
      sql: 'INSERT INTO visitor_stats (ip_address, user_agent) VALUES (:ip, :userAgent)',
      args: { ip, userAgent }
    });

    console.log('Visit recorded successfully:', { ip, userAgent });

    // Get the total number of visits
    const result = await client.execute('SELECT COUNT(*) AS total_visits FROM visitor_stats');
    const totalVisits = result.rows[0].total_visits;
    console.log('Total visits:', totalVisits);

    return totalVisits;
  } catch (error) {
    console.error('Failed to record visit:', error);
    return null;
  }
};

// Record the visit when the page finishes loading
document.addEventListener('DOMContentLoaded', async () => {
  const totalVisits = await recordVisit();
  if (totalVisits) {
    // Optionally display the visit count on the page
    console.log(`Welcome! This is visit number ${totalVisits}`);
    // If you want to display it on the page, you can add an element
    // const statsElement = document.createElement('div');
    // statsElement.textContent = `Visit count: ${totalVisits}`;
    // document.body.appendChild(statsElement);
  }
});

export { recordVisit };