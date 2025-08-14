// analytics.js - Visit Statistics Function

// Database configuration
const DB_URL = 'libsql://self-info-ja-chronie-shizutoki.aws-ap-northeast-1.turso.io';

// Get the token from environment variables or GitHub Secrets
// Note: In a production environment, the token should be stored and retrieved securely
// For GitHub Pages deployment, we'll use a different approach to get the token
// This function will be replaced during the build process with the actual token
const getDbToken = () => {
  // For production (GitHub Pages), the token will be injected during build
  // This placeholder will be replaced by the actual token
  return 'DB_TOKEN_PLACEHOLDER';
};

// Check network connectivity
const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json', { timeout: 5000 });
    return response.ok;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
};

// Get the visitor's IP address
const getVisitorIP = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json', { timeout: 5000 });
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return 'unknown';
  }
};

// Database connection cache
let dbClient = null;

// Initialize the database connection with caching
const initDb = async () => {
  // If a connection already exists and is valid, return it directly
  if (dbClient) {
    console.log('Using existing database connection');
    return dbClient;
  }

  // Dynamically import the libsql client
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@libsql/client@0.6.0/+esm');

  try {
    dbClient = createClient({
      url: DB_URL,
      authToken: getDbToken()
    });
    console.log('Database connection initialized successfully');
    return dbClient;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error; // Rethrow the error for the upper layer to handle
  }
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

// Record visit information with retry mechanism
const recordVisit = async (retryCount = 0, maxRetries = 3) => {
  try {
    // Check network connectivity first
    const isOnline = await checkNetworkConnectivity();
    if (!isOnline) {
      console.warn('No network connection. Cannot record visit at this time.');
      return null;
    }

    const client = await initDb();
    await createTable(client);

    const ip = await getVisitorIP();
    const userAgent = navigator.userAgent;

    // Try to execute the insert operation and get the result
    const insertResult = await client.execute({
      sql: 'INSERT INTO visitor_stats (ip_address, user_agent) VALUES (:ip, :userAgent)',
      args: { ip, userAgent }
    });

    console.log('Visit recorded successfully:', { ip, userAgent, insertResult });

    // Get the total number of visits
    const result = await client.execute('SELECT COUNT(*) AS total_visits FROM visitor_stats');
    const totalVisits = result.rows[0].total_visits;
    console.log('Total visits:', totalVisits);

    return totalVisits;
  } catch (error) {
    console.error('Failed to record visit (attempt ' + (retryCount + 1) + '):', error);
    // Output detailed error information for debugging
    if (error.code) console.error('Error code:', error.code);
    if (error.message) console.error('Error message:', error.message);
    if (error.stack) console.error('Error stack:', error.stack);

    // Retry if we haven't reached max retries and the error is likely temporary
    if (retryCount < maxRetries && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('NetworkError') || 
         error.message.includes('timeout'))) {
      console.log('Retrying visit recording (attempt ' + (retryCount + 2) + ')...');
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return recordVisit(retryCount + 1, maxRetries);
    }

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