import config from '../config/config';

export const getImageUrl = (img) => {
  if (!img) return '';
  let url = '';
  if (typeof img === 'string') {
    url = img;
  } else if (typeof img === 'object' && img?.url) {
    url = img.url;
  }

  if (!url) return '';

  const isLive = typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    !window.location.hostname.startsWith('192.168.');

  // If URL contains local IP, localhost, or :9000 when running on live domain, replace with live backend API URL
  if (isLive && (url.includes('192.168.') || url.includes('localhost') || url.includes(':9000'))) {
    url = url.replace(/http:\/\/(192\.168\.\d+\.\d+|localhost|[\w.-]+)(:\d+)?(\/api\/v1)?/, config.API_URL);
  }

  // Ensure live uploads go through /api/v1/uploads so Apache proxies to Node.js
  if (isLive && url.includes('fashionfever.in/uploads/') && !url.includes('fashionfever.in/api/v1/uploads/')) {
    url = url.replace('fashionfever.in/uploads/', 'fashionfever.in/api/v1/uploads/');
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const backendBase = config.API_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${backendBase}${cleanUrl}`;
  }

  if (/^[0-9a-fA-F]{24}$/.test(url)) {
    return `${config.API_URL}/document/${url}`;
  }

  return url;
};
