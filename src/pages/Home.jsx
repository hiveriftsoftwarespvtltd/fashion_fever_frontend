import React from 'react'
import Hero from '../components/Hero'
import TopBrands from '../components/TopBrands'
import HeroPromotion from '../components/HeroPromotion'
import Promotions from '../components/Promotions'
import BrandBanners from '../components/BrandBanners'
import LastChance from '../components/LastChance'
import BirthdayCarousel from '../components/BirthdayCarousel'
import PromoBanner from '../components/PromoBanner'
import FeatureBanner from '../components/FeatureBanner'
import FinalPromo from '../components/FinalPromo'
import UnlockMoreBeauty from '../components/UnlockMoreBeauty'
import MoreBeautyToLove from '../components/MoreBeautyToLove'
import BeautyBFF from '../components/BeautyBFF'
import BuyingGuides from '../components/BuyingGuides'
import ProductSection from '../components/ProductSection'

const Home = () => {
 return (
 <div className="w-full flex flex-col overflow-x-hidden">
  <Hero />
  <TopBrands />
  <ProductSection />
  <Promotions />
  <BrandBanners />
  <LastChance />
  <BirthdayCarousel />
  <FeatureBanner />
  <FinalPromo />
  <HeroPromotion />
  <UnlockMoreBeauty />
  <MoreBeautyToLove />
  <BeautyBFF />
  <BuyingGuides />
 </div>
 )
}
export default Home;
