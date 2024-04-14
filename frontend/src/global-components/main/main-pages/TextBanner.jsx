import React from 'react'
import { breakfast, onlineGrocery, orderConfirm, shoppingApp } from '../../../../public/images/public-images-index.js'

export const TextBanner = () => {
  const images = [breakfast, onlineGrocery, orderConfirm, shoppingApp];
  const imageHeader = ['Spend less time waiting', 'Foods you love', 'On-Demand Delivery', 'Fresh of the shelf'];
  const imageDescription = ['Leap over long lines with our lightning-fast service', 'Dive into a sea of culinary delights, tailored to tantalize your taste buds', 'Cravings don’t follow a schedule, and neither do we. Get your favorites delivered anytime', 'Savor the freshness in every bite with our daily-sourced ingredients']

  return (
    <>
      {/* <span className='mt-12 text-6xl font-semibold'>Why Choose Us?</span> */}
      <div className="object-cover grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-24 ">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={image} alt="" className="w-64 h-64 object-contain overflow-hidden" />
            <h2 className="mt-4 text-xl font-semibold">{imageHeader[index]}</h2>
            <p className="mt-2">{imageDescription[index]}</p>
          </div>
        ))}
      </div>
    </>
  )
}
