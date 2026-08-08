const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'https://fashionfever.in/fashion_fever_api/api/v1';
};

const getBaseUrl = () => {
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  return getApiUrl().replace(/\/api\/v1\/?$/, '');
};

const config = {
  API_URL: getApiUrl(),
  BASE_URL: getBaseUrl(),
};

export default config;
