import React from 'react';
import { Button } from 'flowbite-react';
import { Clock, DollarSign, Eye, EyeOffIcon, Filter, Heart, Info, InfoIcon } from 'lucide-react';
import { MenuItemFilters } from '@/global-components/main/main-pages/main-pages-component-index.js';
import { FaCartArrowDown } from 'react-icons/fa6';
import { Label, Select } from 'flowbite-react';
import { Tooltip, Typography } from "@material-tailwind/react";
import { productsMockData } from '@/mock/productsMockData.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { MenuItemProductPage } from './MenuItemProductPage';
import toast from "react-hot-toast";

const menuItems = productsMockData.map(product => ({
  id: product.id,
  imageSrc: product.productImage,
  itemName: product.productName,
  basePrice: product.basePrice,
  sizes: product.sizes,
  addOns: product.addons,
  ingredients: product.ingredients,
  description: product.description,
}));

const renderImages = (imageSrc, itemName) => {
  if (Array.isArray(imageSrc)) {
    return imageSrc.map((src, index) => (
      <img
        key={index}
        alt={itemName}
        className="w-full h-56 object-cover transform transition-transform duration-200 hover:scale-105"
        height="200"
        src={src}
        style={{
          aspectRatio: "200/200",
          objectFit: "cover",
        }}
        width="200"
      />
    ));
  } else {
    return (
      <img
        alt={itemName}
        className="w-full h-56 object-cover transform transition-transform duration-200 hover:scale-105"
        height="200"
        src={imageSrc}
        style={{
          aspectRatio: "200/200",
          objectFit: "cover",
        }}
        width="200"
      />
    );
  }
};

const MenuItem = ({ id, imageSrc, itemName, basePrice, ingredients, description }) => {
  const maxLength = 65;
  const truncateDescription = (description) => {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  };

  // TODO: Add to favorites
  // TODO: Check preparation time
  const handleAddFavorite = () => {
    toast.success("Added to favorites")
    console.log('Added to favorites');
  };

  const handleCheckPreparationTime = () => {
    toast.success("15 Mins")
    console.log('Check preparation time');
  }

  return (
    <Link to={`/menu/${id}`}>
      <div className="relative overflow-hidden shadow-lg rounded-lg h-96 w-80 mx-auto cursor-pointer transition-transform duration-300 transform hover:scale-105">
        {renderImages(imageSrc, itemName)}

        <button onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleAddFavorite(e);
        }} className="absolute top-4 right-4 text-red-600 bg-white p-3 rounded-full hover:text-red-800">
          <Heart className='w-4 h-4' />
        </button>
        {/* TODO: When hovered show the preparation time */}
        <button onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleCheckPreparationTime(e);
        }}
          className="absolute top-4 left-4 text-gray-800 bg-white p-3 rounded-full  hover:bg-black hover:text-white">
          <Clock className='w-4 h-4' />
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col space-y-4">
          <div className='flex justify-between'>
            <span className="text-gray-800 dark:text-white text-xl font-semibold">{itemName}</span>

            <div className='flex flex-col items-center justify-center'>
              <span className='text-sm text-red-500 underline font-semibold'>Starts at</span>
              <p className="text-gray-800 dark:text-white flex items-center text-2xl font-medium">
                <DollarSign className='w-5 h-5 mr-1' /> {basePrice}
              </p>
            </div>
          </div>
          <div className='text-gray-700 dark:text-white text-base leading-relaxed'>
            {truncateDescription(description)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const MenuPage = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <section className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Menu</h2>

        <div className='flex items-center mb-8'>
          <MenuItemFilters />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              itemName={item.itemName}
              basePrice={item.basePrice}
              sizes={item.sizes}
              addOns={item.addOns}
              imageSrc={item.imageSrc}
              ingredients={item.ingredients}
              description={item.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};