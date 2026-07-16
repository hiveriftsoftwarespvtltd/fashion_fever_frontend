import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicBrands } from '../api/productService';

// ── Fallback images if API returns no brands ────────────────────────
import m1 from '../assets/1makeup.png';
import m2 from '../assets/2makeup.png';
import m3 from '../assets/3makeup.png';
import m4 from '../assets/4makeup.png';
import s1 from '../assets/1skincare.png';
import s2 from '../assets/2skincare.png';
import s3 from '../assets/3skincare.png';
import s4 from '../assets/4skincare.png';

// Speed in pixels per frame (at 60fps ≈ 0.7px/frame = ~42px/s — slow & smooth)
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
          if (Array.isArray(payload)) {
            // Deduplicate by brand name and map images correctly (both string and object schemas)
            const uniqueBrandsMap = {};
            payload.forEach(item => {
              if (item.brand) {
                const bName = item.brand.trim().toLowerCase();
                if (!uniqueBrandsMap[bName]) {
                  const imgUrl = typeof item.image === 'string' 
                    ? item.image 
                    : (item.image?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop');
                  uniqueBrandsMap[bName] = {
                    name: item.brand,
                    img: imgUrl,
                    totalProducts: item.totalProducts
                  };
                }
              }
            });
            const uniqueBrands = Object.values(uniqueBrandsMap);
            setBrands(uniqueBrands);
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

  const items = brands.length > 0 ? brands : [
    { img: m1, name: 'Lipstick' },
    { img: m2, name: 'Foundation' },
    { img: s1, name: 'Moisturizer' },
    { img: s2, name: 'Serum' },
    { img: m3, name: 'Eye Palette' },
    { img: s3, name: 'Sunscreen' },
    { img: m4, name: 'Blush' },
    { img: s4, name: 'Face Wash' }
  ];

  const tripled = [...items, ...items, ...items];

  // ── How many cards visible ──────────────────────────────────────
  const getN   = () => (window.innerWidth >= 640 ? 6 : 2);
  const getSetW = () => {
    const el = containerRef.current;
    if (!el) return 0;
    return (el.clientWidth / getN()) * items.length;
  };

  // ── Init scroll to the middle set ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const id = setTimeout(() => {
      el.scrollLeft = getSetW();
    }, 50);
    return () => clearTimeout(id);
  }, [brands]); // eslint-disable-line

  // ── RAF auto-scroll loop ────────────────────────────────────────
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
  }, [brands]); // eslint-disable-line

  // ── Touch events — pause RAF while user swipes ──────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = () => { isPausedRef.current = true; };
    const onTouchEnd   = () => {
      setTimeout(() => { isPausedRef.current = false; }, 1000);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);

  // ── Nav buttons — scroll by one card width, then resume ─────────
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
    <section className="w-full bg-white py-10 border-t border-gray-100">

      {/* Hide scrollbar, responsive card widths */}
      <style>{`
        .tb-scroll::-webkit-scrollbar { display: none; }
        .tb-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tb-card   { width: 50%; }
        @media (min-width: 640px) { .tb-card { width: calc(100% / 6); } }
      `}</style>

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
              Trending Now
            </p>
            <h2 className="text-2xl md:text-[28px] font-black text-gray-900 leading-tight">
              Top Brands
            </h2>
          </div>

          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              Luxe Labels
            </span>
          </div>
        </div>
      </div>

      {/* ── Ticker strip with overlaid nav arrows ──────────────── */}
      <div className="relative max-w-[1800px] mx-auto px-10 md:px-14">

        {/* ← Prev */}
        <button
          onClick={() => scrollByCard(-1)}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="absolute left-0 top-1/2 -translate-y-6 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-105"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* → Next */}
        <button
          onClick={() => scrollByCard(1)}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="absolute right-0 top-1/2 -translate-y-6 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-105"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable track */}
        <div
          ref={containerRef}
          className="tb-scroll flex overflow-x-auto py-2"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {tripled.map((item, i) => (
            <div key={i} className="tb-card flex-shrink-0 px-2 sm:px-2.5">
              <Card item={item} onClick={() => navigate('/shop')} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

/* ── Card ──────────────────────────────────────────────────────── */
const Card = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer flex flex-col items-center rounded-3xl bg-white border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(255,45,85,0.06)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 w-full overflow-hidden"
  >
    <div className="w-full aspect-[16/9] bg-gray-50 flex items-center justify-center transition-all duration-500">
      <img
        src={item.img}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop'; }}
      />
    </div>
    <div className="text-center w-full px-3 pb-4 pt-3">
      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 group-hover:text-primary transition-colors duration-300 block truncate">
        {item.name}
      </span>
      {item.totalProducts !== undefined && (
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">
          {item.totalProducts} Products
        </span>
      )}
    </div>
  </div>
);

export default TopBrands;
