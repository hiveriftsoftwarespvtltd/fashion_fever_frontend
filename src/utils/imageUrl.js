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

  // If URL contains local IP, localhost, or :9000 when running on live domain, replace with HTTPS live backend domain
  if (isLive && (url.includes('192.168.') || url.includes('localhost') || url.includes(':9000'))) {
    const backendBase = config.API_URL.replace('/api/v1', '');
    url = url.replace(/http:\/\/(192\.168\.\d+\.\d+|localhost|[\w.-]+)(:\d+)?/, backendBase);
    if (url.startsWith('http://fashionfever.in')) {
      url = url.replace('http://fashionfever.in', 'https://fashionfever.in');
    }
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const backendBase = config.API_URL.replace('/api/v1', '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  if (/^[0-9a-fA-F]{24}$/.test(url)) {
    return `${config.API_URL}/document/${url}`;
  }

  return url;
};
