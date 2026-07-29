import React from 'react';
import InstaStories from '../components/InstaStories';
import Hero from '../components/Hero';
import TopBrands from '../components/TopBrands';
import ProductSection from '../components/ProductSection';
import BookingsSection from '../components/BookingsSection';
import TopSellingProducts from '../components/TopSellingProducts';
import AcademySection from '../components/AcademySection';
import TopTrendingProducts from '../components/TopTrendingProducts';

const Home = () => {
    return (
        <div className="w-full flex flex-col overflow-x-hidden bg-white">
            <InstaStories />
            <Hero />
            <TopBrands />
            <ProductSection />
            <TopSellingProducts />
            <TopTrendingProducts />
            {/* <Promotions /> */}
            {/* <BrandBanners /> */}
            {/* <LastChance /> */}
            {/* <BirthdayCarousel />
  <FeatureBanner />
  <FinalPromo />
  <HeroPromotion />
  <UnlockMoreBeauty />
  <MoreBeautyToLove />
  <BeautyBFF />
  <BuyingGuides /> */}
           
            <AcademySection />
             <BookingsSection />
        </div>
    );
};

export default Home;
