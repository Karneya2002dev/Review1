import React from 'react'
import Header from './Header'
import HeroBanner from './HeroBanner'
import CuratedCategories from './CuratedCategory'
import ShopByCategory from './ShopByCategory'
import Banner from './Banner'
import BrandCategory from './BrandCategory'
import BrandBanner from './BrandBanner'
import Thist from './Thist'
import CleanBanner from './CleanBanner'
import BabyBanner from './BabyBanner'
import ProductSection from './ProductSection'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <Header />

      {/* Add padding-top SAME as header height */}
      <div className="pt-35 space-y-4">
        <HeroBanner />
        <CuratedCategories />
    
        <ShopByCategory />
        <Banner />
        <BrandCategory />
        <BrandBanner />
        <Thist />
        <CleanBanner />
        <ProductSection />
        <BabyBanner />
      </div>
      <Footer />
    </>
  )
}

export default Home