import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicBrands } from '../api/productService';
import { getImageUrl } from '../utils/imageUrl';

const bgColors = [
  'bg-[#fff4f6]', // Soft blush pink
  'bg-[#f6f6f6]', // Soft grey
  'bg-[#fff7f0]', // Soft warm peach
  'bg-[#f4f7f6]', // Soft mint grey
  'bg-[#faf5ff]', // Soft lavender tint
  'bg-[#f0fdf4]', // Soft sage tint
];

const defaultBrands = [
  { name: 'HIRALAL', logoIcon: '🌸', count: 1 },
  { name: 'WILD STONE', logoIcon: null, count: 1 },
  { name: 'HIRALAL', logoIcon: '🌸', count: 1 },
  { name: 'WILD STONE', logoIcon: null, count: 1 },
  { name: 'HIRALAL', logoIcon: '🌸', count: 1 },
  { name: 'WILD STONE', logoIcon: null, count: 1 },
  { name: 'MAYBELLINE', logoIcon: null, count: 24 },
  { name: 'LAKME', logoIcon: null, count: 18 },
  { name: 'NYKAA', logoIcon: null, count: 32 },
  { name: 'PLUM', logoIcon: '🌿', count: 15 }
];

// Speed in pixels per frame
const SPEED = 0.7;

const TopBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const isPausedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getPublicBrands();
        if (response.success) {
          const payload = response.data ?? response;
          if (Array.isArray(payload) && payload.length > 0) {
            const uniqueBrandsMap = {};
            payload.forEach(item => {
              if (item.brand) {
                const bName = item.brand.trim().toLowerCase();
                if (!uniqueBrandsMap[bName]) {
                  const rawImg = typeof item.image === 'string'
                    ? item.image
                    : (item.image?.url || null);
                  const imgUrl = getImageUrl(rawImg);
                  uniqueBrandsMap[bName] = {
                    name: item.brand,
                    img: imgUrl,
                    totalProducts: item.totalProducts || 1
                  };
                }
              }
            });
            const uniqueBrands = Object.values(uniqueBrandsMap);
            if (uniqueBrands.length > 0) {
              setBrands(uniqueBrands);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch top brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const items = brands.length > 0 ? brands : defaultBrands;
  const tripled = [...items, ...items, ...items];

  // Number of cards visible per screen breakpoint
  const getN = () => (window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 4 : 2);
  const getSetW = () => {
    const el = containerRef.current;
    if (!el) return 0;
    return (el.clientWidth / getN()) * items.length;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const id = setTimeout(() => {
      el.scrollLeft = getSetW();
    }, 50);
    return () => clearTimeout(id);
  }, [brands]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tick = () => {
      if (!isPausedRef.current) {
        el.scrollLeft += SPEED;
        const setW = getSetW();
        if (setW > 0 && el.scrollLeft >= setW * 2) {
          el.scrollLeft -= setW;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [brands]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = () => { isPausedRef.current = true; };
    const onTouchEnd = () => {
      setTimeout(() => { isPausedRef.current = false; }, 1000);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const scrollByCard = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    const cardW = el.clientWidth / getN();
    isPausedRef.current = true;
    el.scrollBy({ left: dir * cardW, behavior: 'smooth' });
    setTimeout(() => {
      isPausedRef.current = false;
    }, 900);
  };

  return (
    <section className="w-full bg-white py-8 border-t border-gray-100">

      <style>{`
        .tb-scroll::-webkit-scrollbar { display: none; }
        .tb-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tb-card { width: 50%; }
        @media (min-width: 640px) { .tb-card { width: 25%; } }
        @media (min-width: 1024px) { .tb-card { width: calc(100% / 6); } }
      `}</style>

      {/* ── Header Matching Reference Image ────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] font-black uppercase tracking-wider text-[#ff4d6d] mb-0.5">
              TRENDING NOW
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Top Brands
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-[#ff4d6d] hover:underline transition-all cursor-pointer"
          >
            View All
          </Link>
        </div>
      </div>

      {/* ── Brand Cards Ticker Slider ──────────────────── */}
      <div className="relative max-w-[1600px] mx-auto px-4 md:px-8">

        {/* Left Arrow Button (MD+ screens) */}
        <button
          onClick={() => scrollByCard(-1)}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="hidden md:flex absolute -left-5 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-lg items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => scrollByCard(1)}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="hidden md:flex absolute -right-5 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-lg items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={containerRef}
          className="tb-scroll flex overflow-x-auto py-1"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {tripled.map((item, i) => (
            <div key={i} className="tb-card flex-shrink-0 px-2">
              <Card item={item} onClick={() => navigate(`/shop?brand=${encodeURIComponent(item.name)}`)} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

/* ── Card Component Matching Reference Image ────────────────── */
const Card = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center rounded-2xl bg-white border border-gray-200 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-300 w-full overflow-hidden h-full"
    >
      {/* Top Box with White Background & Brand Image/Logo */}
      <div className="w-full h-32 sm:h-36 bg-white flex flex-col items-center justify-center p-2 transition-all duration-300 relative overflow-hidden shrink-0">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : item.logoIcon ? (
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-xl mb-1">{item.logoIcon}</span>
            <span className="font-serif text-sm sm:text-base font-extrabold tracking-widest text-gray-900 uppercase leading-tight">
              {item.name}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="font-serif text-xs sm:text-sm font-extrabold tracking-widest text-gray-900 uppercase leading-tight">
              {item.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Box with Product Count */}
      <div className="w-full bg-white border-t border-gray-150 py-2.5 px-2 text-center mt-auto">
        <span className="text-[11px] font-medium text-gray-600 block truncate">
          {item.totalProducts !== undefined ? item.totalProducts : (item.count || 1)} Products
        </span>
      </div>
    </div>
  );
};

export default TopBrands;
