// analytics.js - Visit Statistics with Google Analytics

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-9K2N1RVSTR'; // 用户提供的GA4测量ID

// 加载Google Analytics脚本
const loadGoogleAnalytics = () => {
  console.log('Loading Google Analytics...');

  // <!-- Google tag (gtag.js) -->
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // 初始化GA
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  console.log('Google Analytics loaded successfully');
};

// 记录页面访问
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

// 获取访问者IP信息 (使用ipapi.co API)
const getVisitorIPInfo = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // 如果GA已初始化，发送IP信息作为自定义事件
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 加载GA
  loadGoogleAnalytics();

  // 延迟执行，确保GA已加载
  setTimeout(async () => {
    const visitRecorded = recordVisit();
    if (visitRecorded) {
      // 可选：获取并记录IP信息
      const ipInfo = await getVisitorIPInfo();
      console.log('Visitor IP info:', ipInfo);
    }
  }, 1000);
});

export { recordVisit, getVisitorIPInfo };