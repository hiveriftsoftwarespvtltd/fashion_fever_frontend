import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Palette, Droplets } from 'lucide-react';

// ── Makeup images ─────────────────────────────────────────────────
import m1 from '../assets/1makeup.png';
import m2 from '../assets/2makeup.png';
import m3 from '../assets/3makeup.png';
import m4 from '../assets/4makeup.png';
import m5 from '../assets/5makeup.png';
import m6 from '../assets/6makeup.png';
import m7 from '../assets/7makeup.png';
import m8 from '../assets/8makeup.png';

// ── Skincare images ───────────────────────────────────────────────
import s1 from '../assets/1skincare.png';
import s2 from '../assets/2skincare.png';
import s3 from '../assets/3skincare.png';
import s4 from '../assets/4skincare.png';
import s5 from '../assets/5skincare.png';
import s6 from '../assets/6skincare.png';
import s7 from '../assets/7skincare.png';
import s8 from '../assets/8skincare.png';

const TABS = [
  {
    key: 'makeup',
    icon: Palette,
    label: 'Makeup',
    items: [
      { img: m1, name: 'Lipstick' },
      { img: m2, name: 'Foundation' },
      { img: m3, name: 'Eye Palette' },
      { img: m4, name: 'Blush' },
      { img: m5, name: 'Mascara' },
      { img: m6, name: 'Highlighter' },
      { img: m7, name: 'Lip Liner' },
      { img: m8, name: 'Concealer' },
    ],
  },
  {
    key: 'skincare',
    icon: Droplets,
    label: 'Skincare',
    items: [
      { img: s1, name: 'Moisturizer' },
      { img: s2, name: 'Serum' },
      { img: s3, name: 'Sunscreen' },
      { img: s4, name: 'Face Wash' },
      { img: s5, name: 'Toner' },
      { img: s6, name: 'Eye Cream' },
      { img: s7, name: 'Face Mask' },
      { img: s8, name: 'Scrub' },
    ],
  },
];

// Speed in pixels per frame (at 60fps ≈ 0.7px/frame = ~42px/s — slow & smooth)
const SPEED = 0.7;

const TopBrands = () => {
  const navigate              = useNavigate();
  const [activeTab, setActiveTab] = useState('makeup');
  const containerRef          = useRef(null);
  const isPausedRef           = useRef(false);
  const rafRef                = useRef(null);

  const tab     = TABS.find((t) => t.key === activeTab);
  const items   = tab.items;
  // Triple the items — we scroll from set 1 to set 2 then loop back
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
    // Small delay to let layout settle
    const id = setTimeout(() => {
      el.scrollLeft = getSetW();
    }, 50);
    return () => clearTimeout(id);
  }, [activeTab]); // eslint-disable-line

  // ── RAF auto-scroll loop ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tick = () => {
      if (!isPausedRef.current) {
        el.scrollLeft += SPEED;
        const setW = getSetW();
        // Seamless loop: past the 2nd copy → jump back to 1st copy
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
  }, [activeTab]); // eslint-disable-line

  // ── Touch events — pause RAF while user swipes ──────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = () => { isPausedRef.current = true; };
    const onTouchEnd   = () => {
      // Resume after a short settle delay
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
              Top Brand 
            </h2>
          </div>

          <div className="flex gap-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-all duration-200 ${
                    activeTab === t.key
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                      : 'text-gray-500 border-gray-200 hover:border-primary hover:text-primary bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
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
    className="group cursor-pointer flex flex-col items-center gap-2.5"
  >
    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-primary/25 transition-all duration-300">
      <img
        src={item.img}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-primary transition-colors duration-200 pb-1">
      {item.name}
    </span>
  </div>
);

export default TopBrands;
