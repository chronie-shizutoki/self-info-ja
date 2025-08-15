// analytics.js - Visit Statistics with Google Analytics

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-9K2N1RVSTR'; // GA4 Measurement ID

// Load Google Analytics script
const loadGoogleAnalytics = () => {
  console.log('Loading Google Analytics...');

  // <!-- Google tag (gtag.js) -->
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize GA
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  console.log('Google Analytics loaded successfully');
};

// Record page visit
const recordVisit = () => {
  if (window.gtag) {
    gtag('event', 'page_view', {
      'page_title': document.title,
      'page_location': window.location.href,
      'page_path': window.location.pathname
    });
    console.log('Visit recorded with Google Analytics');
    return true;
  } else {
    console.error('Google Analytics not initialized');
    return false;
  }
};

// Get visitor IP information (using ipapi.co API)
const getVisitorIPInfo = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // If GA is initialized, send IP information as a custom event
    if (window.gtag) {
      gtag('event', 'visitor_info', {
        'ip_address': data.ip,
        'country': data.country_name,
        'city': data.city,
        'region': data.region,
        'timezone': data.timezone
      });
    }

    return data;
  } catch (error) {
    console.error('Failed to get IP information:', error);
    return {
      ip: 'unknown',
      country_name: 'unknown',
      city: 'unknown',
      region: 'unknown',
      timezone: 'unknown'
    };
  }
};

// Initialize analytics when user consents to privacy policy
const initializeAnalytics = async () => {
  // Load GA
  loadGoogleAnalytics();

  // Use polling to check if GA is initialized, wait up to 5 seconds
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds (50 * 100ms)
  const intervalId = setInterval(async () => {
    attempts++;
    
    if (window.gtag || attempts >= maxAttempts) {
      clearInterval(intervalId);
      
      if (window.gtag) {
        console.log('Google Analytics is initialized');
        const visitRecorded = recordVisit();
        if (visitRecorded) {
          // Get and record IP information
          const ipInfo = await getVisitorIPInfo();
          console.log('Visitor IP info:', ipInfo);
        }
      } else {
        console.error('Google Analytics failed to initialize after 5 seconds');
      }
    }
  }, 100); // Check every 100ms
};

// Make initializeAnalytics available globally
window.initializeAnalytics = initializeAnalytics;

export { recordVisit, getVisitorIPInfo };