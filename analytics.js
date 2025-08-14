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
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    return response.ok;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
};

// Get detailed visitor IP information
const getVisitorIPInfo = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get IP information:', error);
    // Return a default object with minimal information
    return {
      ip: 'unknown',
      network: 'unknown',
      version: 'unknown',
      city: 'unknown',
      region: 'unknown',
      region_code: 'unknown',
      country: 'unknown',
      country_name: 'unknown',
      country_code: 'unknown',
      country_code_iso3: 'unknown',
      country_capital: 'unknown',
      country_tld: 'unknown',
      continent_code: 'unknown',
      in_eu: false,
      postal: 'unknown',
      latitude: 0,
      longitude: 0,
      timezone: 'unknown',
      utc_offset: 'unknown',
      country_calling_code: 'unknown',
      currency: 'unknown',
      currency_name: 'unknown',
      languages: 'unknown',
      country_area: 0,
      country_population: 0,
      asn: 'unknown',
      org: 'unknown'
    };
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
        network TEXT,
        version TEXT,
        city TEXT,
        region TEXT,
        region_code TEXT,
        country TEXT,
        country_name TEXT,
        country_code TEXT,
        country_code_iso3 TEXT,
        country_capital TEXT,
        country_tld TEXT,
        continent_code TEXT,
        in_eu BOOLEAN,
        postal TEXT,
        latitude REAL,
        longitude REAL,
        timezone TEXT,
        utc_offset TEXT,
        country_calling_code TEXT,
        currency TEXT,
        currency_name TEXT,
        languages TEXT,
        country_area REAL,
        country_population INTEGER,
        asn TEXT,
        org TEXT,
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

    const ipInfo = await getVisitorIPInfo();
    const userAgent = navigator.userAgent;

    // Try to execute the insert operation and get the result
    const insertResult = await client.execute({
      sql: `INSERT INTO visitor_stats (
        ip_address, network, version, city, region, region_code, country, country_name, country_code, 
        country_code_iso3, country_capital, country_tld, continent_code, in_eu, postal, latitude, 
        longitude, timezone, utc_offset, country_calling_code, currency, currency_name, languages, 
        country_area, country_population, asn, org, user_agent
      ) VALUES (
        :ip, :network, :version, :city, :region, :region_code, :country, :country_name, :country_code, 
        :country_code_iso3, :country_capital, :country_tld, :continent_code, :in_eu, :postal, :latitude, 
        :longitude, :timezone, :utc_offset, :country_calling_code, :currency, :currency_name, :languages, 
        :country_area, :country_population, :asn, :org, :userAgent
      )`,
      args: {
        ...ipInfo,
        userAgent
      }
    });

    console.log('Visit recorded successfully:', { ipInfo, userAgent, insertResult });

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

export { recordVisit, getVisitorIPInfo };