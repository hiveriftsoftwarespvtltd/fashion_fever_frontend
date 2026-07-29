const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.startsWith('192.168.'));

  if (!isLocal && typeof window !== 'undefined') {
    return 'https://fashionfever.in/api/v1';
  }
  return 'http://192.168.0.103:9000/api/v1';
};

const config = {
  API_URL: getApiUrl()
};

export default config;
