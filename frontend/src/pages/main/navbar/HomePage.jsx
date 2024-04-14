import React from 'react';
import { FeaturedItemsCarousel } from '@/global-components/main/main-pages/main-pages-component-index.js';
import { AboutPage } from './AboutPage';
import { Footer } from '@/global-components/main/main-pages/main-pages-component-index.js';
import { FuturePlans } from './FuturePlans';
import { FAQPage } from '@/pages/main/navbar/navbar-pages-index.js';
import { TextBanner } from '@/global-components/main/main-pages/TextBanner';
export const HomePage = () => {
  return (
    <div>
      <div className=' flex flex-col items-center bg-slate-50 mt-1.5'>
        <FeaturedItemsCarousel />
        <TextBanner />
        <FAQPage />
        {/* <FuturePlans /> */}
      </div>
      <Footer />
    </div>
  )
};

