const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Live Production API URL (Active)
  return 'https://fashionfever.in/fashionfever_api/api/v1';

  // Localhost API URL (Commented)
  // return 'http://localhost:9000/api/v1';
};

const config = {
  API_URL: getApiUrl()
};

export default config;



