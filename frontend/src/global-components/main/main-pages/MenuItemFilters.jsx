import { Filter, X } from 'lucide-react';
import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { productsMockData } from '@/mock/productsMockData.js';
import { restaurantsMockData } from '@/mock/restaurantsMockData.js';
import { useDispatch, useSelector } from "react-redux";
import { productCategories } from '@/constants/products/categories';

// For Dynamically fetching the cuisine available
// TODO: This will need refactoring of the data model, not for now
const restaurantCuisine = productCategories.map(product => product);
const uniqueCuisine = [...new Set(restaurantCuisine.flat())];
console.log('Unique Cuisine:', uniqueCuisine);

// For Dynamically fetching the addonsStatus if available
const addonsStatus = productsMockData.map(product => (
  product.addons && product.addons.length > 0 ? 'With Addons' : 'Without Addons'
));

export const MenuItemFilters = () => {
  const productsList = useSelector((state) => state.product);
  let allSizes = new Set();
  let allAddons = new Set();

  productsList.products.forEach(product => {
    product.sizes.forEach(size => allSizes.add(size.name));
    product.addons.forEach(addon => allAddons.add(addon.name));
  });

  allSizes = Array.from(allSizes).sort();
  allAddons = Array.from(allAddons).sort();

  console.log('All Sizes:', allSizes);
  console.log('All Addons:', allAddons);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAddon, setSelectedAddon] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  console.log(selectedCategory, selectedAddon, selectedSize);
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAddon('');
    setSelectedSize('');
  };

  const renderSelectOptions = (optionsArray) => (
    <>
      <option value="" disabled>Select a {optionsArray === uniqueCuisine ? 'category' : optionsArray === allAddons ? 'addon' : 'size'}</option>
      {optionsArray.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </>
  );

  const scrollBarWidth = 165;

  return (
    <>
      <span className='mb-4 text-sm font-semibold'>Filters</span>
      <div className='flex'>
        {[uniqueCuisine, allAddons, allSizes].map((optionsArray, index) => (
          <div key={index} className='h-20'>
            <Scrollbars style={{ width: scrollBarWidth, height: 80 }}>
              <div className="py-4 px-3 text-xs md:w-1/2 lg:w-1/3 xl:w-1/4">
                <select
                  className={`rounded-3xl hover:bg-gray-100 cursor-pointer text-xs border-gray-300 px-2 ${selectedCategory !== '' ? 'text-blue-500' : ''}`}
                  value={index === 0 ? selectedCategory : index === 1 ? selectedAddon : selectedSize}
                  onChange={(e) => index === 0 ? setSelectedCategory(e.target.value) : index === 1 ? setSelectedAddon(e.target.value) : setSelectedSize(e.target.value)}
                >
                  {renderSelectOptions(optionsArray, index === 0 ? selectedCategory : index === 1 ? selectedAddon : selectedSize)}
                </select>
              </div>
            </Scrollbars>
          </div>
        ))}
        <button className="btn btn-circle flex items-center justify-center mb-4" onClick={clearFilters}>
          <div className='flex items-center justify-center'>
            <X className='w-6 h-6 border-2 hover:bg-red-500 hover:text-white rounded-full transform transition-transform duration-200 hover:scale-110' />
          </div>
        </button>
      </div>
    </>
  )
}
