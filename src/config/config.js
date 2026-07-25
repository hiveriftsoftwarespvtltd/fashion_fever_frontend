const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return `http://${hostname}:9000/api/v1`;
    }
  }
  return 'https://fashionfever.in/api/v1';
};

const config = {
  API_URL: getApiUrl()
};

export default config;
