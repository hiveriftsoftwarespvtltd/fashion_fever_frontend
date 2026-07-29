import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInfluencerStories } from '../api/influencerService';
import { getImageUrl } from '../utils/imageUrl';

const defaultStories = [
  {
    id: 1,
    title: 'Bridal Glam',
    thumbnail: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-lipstick-in-front-of-a-mirror-40662-large.mp4',
    ctaText: 'Shop Bridal Lipsticks',
    ctaLink: '/shop?category=6a180e248ad1fb7eba90b29c' // using typical categories or shop
  },
  {
    id: 2,
    title: 'Skin Glow',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-applying-face-cream-40685-large.mp4',
    ctaText: 'Shop Skincare Serums',
    ctaLink: '/shop?category=6a180e248ad1fb7eba90b29c'
  },
  {
    id: 3,
    title: 'Hair Secrets',
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-brushing-her-hair-40645-large.mp4',
    ctaText: 'Shop Haircare Oils',
    ctaLink: '/shop'
  },
  {
    id: 4,
    title: 'Eye Drama',
    thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&h=1067&q=80',
    ctaText: 'Shop Mascara & Eyeliner',
    ctaLink: '/shop'
  },
  {
    id: 5,
    title: 'Scent Edit',
    thumbnail: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&h=1067&q=80',
    ctaText: 'Shop Luxury Fragrances',
    ctaLink: '/shop'
  },
  {
    id: 6,
    title: 'Gold Glow',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&h=150&q=80',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=1067&q=80',
    ctaText: 'Shop Highlighter Palettes',
    ctaLink: '/shop'
  }
];

const InstaStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState(defaultStories);
  const [isOpen, setIsOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [viewedStories, setViewedStories] = useState({});

  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const IMAGE_STORY_DURATION = 5000; // 5 seconds for image stories

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getInfluencerStories();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item, idx) => {
            const isVideo = item.storyUrl?.toLowerCase().endsWith('.mp4') || item.storyUrl?.includes('mixkit.co');
            const isImage = item.storyUrl?.toLowerCase().endsWith('.jpg') || item.storyUrl?.toLowerCase().endsWith('.png') || item.storyUrl?.toLowerCase().endsWith('.jpeg') || item.storyUrl?.includes('images.unsplash.com');
            
            const defaultImages = [
              'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&h=1067&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&h=1067&q=80',
              'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&h=1067&q=80',
              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=1067&q=80'
            ];
            
            const defaultThumbnails = [
              'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&h=150&q=80',
              'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=150&h=150&q=80',
              'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=150&h=150&q=80'
            ];

            const selectedDefaultImage = defaultImages[idx % defaultImages.length];
            const selectedDefaultThumb = defaultThumbnails[idx % defaultThumbnails.length];

            let normalizedUrl = item.storyUrl;
            if (normalizedUrl && !normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
              normalizedUrl = 'https://' + normalizedUrl;
            }

            return {
              id: item._id || idx + 100,
              title: item.influencerName || 'Creator Story',
              thumbnail: getImageUrl(item.thumbnail) || selectedDefaultThumb,
              type: isVideo ? 'video' : 'image',
              mediaUrl: getImageUrl(isVideo || isImage ? normalizedUrl : selectedDefaultImage),
              ctaText: `View ${item.influencerName || 'Creator'}'s Link`,
              ctaLink: normalizedUrl || '/shop',
              isExternal: true
            };
          });
          setStories(mapped);
        } else {
          setStories(defaultStories);
        }
      } catch (err) {
        console.error('Failed to load influencer stories:', err);
        setStories(defaultStories);
      }
    };
    fetchStories();
  }, []);

  const activeStory = stories[activeStoryIndex] || stories[0];

  // Mark story as viewed
  useEffect(() => {
    if (isOpen && activeStory) {
      setViewedStories(prev => ({
        ...prev,
        [activeStory.id]: true
      }));
    }
  }, [activeStoryIndex, isOpen, activeStory]);

  // Handle play/pause sync with state changes
  useEffect(() => {
    if (!isOpen || !activeStory) return;
    if (activeStory.type === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log('Video autoplay error:', err));
      }
    }
  }, [isPaused, activeStoryIndex, isOpen, activeStory]);

  // Manage story ticking timer for images
  useEffect(() => {
    if (!isOpen || !activeStory) return;
    
    // Clear any existing progress ticks
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    setProgress(0);
    
    if (activeStory.type === 'image') {
      const intervalTime = 50; // increment every 50ms
      progressIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressIntervalRef.current);
              handleNextStory();
              return 100;
            }
            return prev + (intervalTime / IMAGE_STORY_DURATION) * 100;
          });
        }
      }, intervalTime);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeStoryIndex, isOpen, isPaused, activeStory]);

  // Sync video timeline to progress bar
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !isPaused) {
      const { currentTime, duration } = videoRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const openStoryPlayer = (index) => {
    setActiveStoryIndex(index);
    setIsOpen(true);
    setProgress(0);
    setIsPaused(false);
  };

  const closeStoryPlayer = () => {
    setIsOpen(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleNextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      closeStoryPlayer();
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  if (!activeStory) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-4 border-b border-gray-100 dark:border-gray-900 select-none">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        
        {/* Horizontal Circle Row */}
        <div className="flex items-center gap-5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {stories.map((story, index) => {
            const hasViewed = viewedStories[story.id];
            return (
              <div 
                key={story.id} 
                onClick={() => openStoryPlayer(index)}
                className="flex flex-col items-center gap-1.5 cursor-pointer snap-start flex-shrink-0 group"
              >
                {/* Glowing border ring */}
                <div className={`p-[3px] rounded-full transition-all duration-300 transform group-hover:scale-105 active:scale-95 ${
                  hasViewed 
                    ? 'border-2 border-gray-300 dark:border-gray-700' 
                    : 'bg-gradient-to-tr from-primary via-pink-500 to-amber-500 animate-gradient-bg'
                }`}>
                  <div className="p-0.5 bg-white dark:bg-gray-950 rounded-full">
                    <img 
                      src={story.thumbnail} 
                      alt={story.title} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale-0 group-hover:grayscale-[20%] transition-all"
                    />
                  </div>
                </div>
                {/* Caption label */}
                <span className={`text-xs font-bold uppercase tracking-wider text-center transition-colors ${
                  hasViewed ? 'text-gray-400 dark:text-gray-600' : 'text-white'
                }`}>
                  {story.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Popup Story Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main vertical layout card */}
          <div className="relative w-full max-w-[460px] h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between bg-zinc-950 select-none">
            
            {/* Top segment indicator row */}
            <div className="absolute top-4 left-0 right-0 z-50 px-4 flex gap-1">
              {stories.map((story, index) => {
                let barProgress = 0;
                if (index < activeStoryIndex) barProgress = 100;
                if (index === activeStoryIndex) barProgress = progress;
                return (
                  <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${barProgress}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Header / Info Row */}
            <div className="absolute top-8 left-0 right-0 z-50 px-4 flex items-center justify-between text-white/90">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStory.thumbnail} 
                  alt={activeStory.title} 
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-black tracking-wider uppercase">{activeStory.title}</span>
              </div>
              <div className="flex items-center gap-4">
                {activeStory.type === 'video' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer active:scale-95 transition-all"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); closeStoryPlayer(); }}
                  className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer active:scale-95 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Central Media Container */}
            <div className="flex-1 w-full h-full flex items-center justify-center relative bg-black">
              {activeStory.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={activeStory.mediaUrl}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  playsInline
                  autoPlay
                  muted={isMuted}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleNextStory}
                />
              ) : (
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              )}

              {/* Navigation overlays for desktop click areas */}
              <div className="absolute inset-y-0 left-0 w-1/4 z-40 cursor-w-resize" onClick={(e) => { e.stopPropagation(); handlePrevStory(); }} />
              <div className="absolute inset-y-0 right-0 w-1/4 z-40 cursor-e-resize" onClick={(e) => { e.stopPropagation(); handleNextStory(); }} />
            </div>

            {/* Bottom CTA overlay */}
            <div className="absolute bottom-6 left-0 right-0 z-50 px-6 flex flex-col items-center gap-3">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  closeStoryPlayer();
                  if (activeStory.isExternal) {
                    window.open(activeStory.ctaLink, '_blank');
                  } else {
                    navigate(activeStory.ctaLink);
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-pink-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 cursor-pointer active:scale-95 transition-all"
              >
                {activeStory.ctaText}
              </button>
              <span className="text-sm text-white/50 font-bold uppercase tracking-widest">Swipe Up / Tap to Shop</span>
            </div>

            {/* Sidebar Navigation buttons (Hidden on tiny screens) */}
            {activeStoryIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevStory(); }}
                className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center cursor-pointer transition-all active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {activeStoryIndex < stories.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleNextStory(); }}
                className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center cursor-pointer transition-all active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default InstaStories;
