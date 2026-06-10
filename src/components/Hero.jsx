import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import CategoryStrip from './CategoryStrip';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import { getHomeContentsPublic } from '../api/adminService';
import config from '../config/config';

const Hero = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fallbackSlides = [
    {
      _id: 'fallback-1',
      title: 'Wakeup Makeup',
      computerImage: hero1,
      mobileImage: hero2,
      backgroundColor: '#dd8e7f',
      redirectType: 'NONE',
      isFallback: true
    },
    {
      _id: 'fallback-2',
      title: 'Premium Beauty',
      computerImage: hero2,
      mobileImage: hero1,
      backgroundColor: '#3d0d43',
      redirectType: 'NONE',
      isFallback: true
    }
  ];

  const resolveImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') {
      if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('blob:')) {
        return img;
      }
      if (/^[0-9a-fA-F]{24}$/.test(img)) {
        return `${config.API_URL}/file/get-file/${img}`;
      }
      return img;
    }
    if (typeof img === 'object' && img?.url) {
      return img.url;
    }
    return '';
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getHomeContentsPublic();
        if (res?.success) {
          const fetchedData = res.data?.data || res.data || [];
          // Filter to show only active slides of type BANNER
          const activeBanners = fetchedData
            .filter(item => item.isActive && item.contentType === 'BANNER')
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          
          if (activeBanners.length > 0) {
            setSlides(activeBanners);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic banners:', err);
      }
      
      // Fallback slides if API fails or returns no active banners
      setSlides(fallbackSlides);
      setLoading(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = (e) => {
    e.stopPropagation();
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentSlide(index);
  };

  const handleSlideClick = (slide) => {
    if (!slide) return;
    if (slide.isFallback) {
      navigate('/shop');
      return;
    }
    
    const { redirectType, redirectId, redirectUrl } = slide;
    if (redirectType === 'PRODUCT' && redirectId) {
      navigate(`/product/${redirectId}`);
    } else if (redirectType === 'CATEGORY' && redirectId) {
      navigate(`/shop?category=${redirectId}`);
    } else if (redirectType === 'EXTERNAL' && redirectUrl) {
      const url = redirectUrl.trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    } else {
      navigate('/shop');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <CategoryStrip />
        <AnnouncementBar />
        <div className="max-w-[1800px] mx-auto md:px-6">
          <div className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[600px] xl:h-[680px] rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-900 animate-pulse relative overflow-hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Curating offers...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* These move here to become part of Hero */}
      <CategoryStrip />
      <AnnouncementBar />

      <div className="max-w-[1800px]   mx-auto   md:px-6">
        {/* Interactive Banner Carousel */}
        <div className="relative w-full overflow-hidden  shadow-md group">

          {/* Slides Strip — fixed height, object-contain, bg matched to image edge color */}
          <div
            className="flex transition-transform duration-[800ms] ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => {
              const compImg = resolveImageUrl(slide.computerImage);
              const mobImg = resolveImageUrl(slide.mobileImage || slide.computerImage);
              const bgCol = slide.backgroundColor || '#dd8e7f';
              
              return (
                <div
                  key={slide._id || index}
                  onClick={() => handleSlideClick(slide)}
                  className="min-w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[600px] xl:h-[680px] cursor-pointer flex items-center justify-center relative select-none"
                  style={{ backgroundColor: bgCol }}
                >
                  <picture className="w-full h-full">
                    {mobImg && <source media="(max-width: 640px)" srcSet={mobImg} />}
                    <img
                      src={compImg}
                      alt={slide.title || `Wakeup Makeup Banner ${index + 1}`}
                      className="w-full h-full object-contain sm:object-cover object-center"
                    />
                  </picture>
                </div>
              );
            })}
          </div>

          {/* Left Navigation Chevron */}
          {slides.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Navigation Chevron */}
          {slides.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Dot Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToSlide(index, e)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index 
                      ? 'w-6 h-2 bg-primary shadow-sm' 
                      : 'w-2 h-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>


  {/* Full-width background for 3 Grid Cards */}
  {/* <div className="bg-[#f8f8dd] ">
  <div className="container mx-auto">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 ">
   {[1, 2, 3].map((item) => (
    <div key={item} className="group relative cursor-pointer overflow-hidden rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[350px] lg:h-[450px]">
    <img
     src={cardImg}
     alt={`Card ${item}`}
     className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
    />

    
    <div className="absolute top-0 left-0 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-br-[16px] shadow-sm">
     <span className="text-[10px] lg:text-[12px] font-bold text-black uppercase text-center block">
     {item === 1 ? 'Clinique' : item === 2 ? 'Carolina' : 'Milk'}
     </span>
    </div>


    </div>
   ))}
   </div>
  </div>
  </div> */}
 </div>
 );
};

export default Hero;
