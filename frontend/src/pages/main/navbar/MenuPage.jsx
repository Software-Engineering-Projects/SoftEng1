import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react';
import { Clock, DollarSign, Eye, EyeOffIcon, Filter, Heart, Info, InfoIcon, RefreshCcw } from 'lucide-react';
import { MenuItemFilters } from '@/global-components/main/main-pages/main-pages-component-index.js';
import { FaCartArrowDown } from 'react-icons/fa6';
import { Label, Select } from 'flowbite-react';
import { Tooltip, Typography } from "@material-tailwind/react";
import { productsMockData } from '@/mock/productsMockData.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { MenuItemProductPage } from './MenuItemProductPage';
import toast from "react-hot-toast";
import { getAllProducts } from '@/api';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '@/context/actions/productAction';
import { storage } from '@/config/firebase.config.js';
import { getStorage, ref, listAll } from "firebase/storage";
import { Logo } from '@/public/images/public-images-index.js';
import { imageNotFound } from '@/public/images/public-images-index.js';

// TODO: Make this use redux
// TODO: Properly fetch image
// TODO: Add conditional to check whether or not the menu item is published only then display the item, in admin view display all items, and have a badge to show if the item is published or not
// TODO: Fetch from firebase storage
// TODO: Make this into a reusable component, but the style need to be different obviously set the classnames as a prop instead or just style it directly

const ImageWithPlaceholder = ({ imageUrl, itemName }) => {
  const optimizedImageUrl = imageUrl.replace(
    "https://firebasestorage.googleapis.com",
    `https://ik.imagekit.io/${import.meta.env.VITE_IMAGE_KIT_KEY_API_ID}`
  );
  // FIXME: This initial low quality place holder is not working
  // FIXME: Some images are not loading properly??
  const placeholderUrl = `${optimizedImageUrl}?tr=bl-6`;

  const [src, setSrc] = useState(placeholderUrl);

  useEffect(() => {
    const img = new Image();
    img.src = optimizedImageUrl;
    img.onload = () => setSrc(optimizedImageUrl);
  }, [optimizedImageUrl]);

  return (
    <img
      alt={itemName}
      className="w-full h-56 object-cover transform transition-transform duration-200 hover:scale-105"
      height="200"
      src={src}
      style={{
        aspectRatio: "200/200",
        objectFit: "cover",
      }}
      width="200"
      onError={() => setSrc(imageNotFound)}
    />
  );
};

ImageWithPlaceholder.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
};

const renderImages = (imageSrc, itemName) => {
  const imageComponents = [];

  const imageSrcArray = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
  for (const src of imageSrcArray) {
    console.log('Adding image to components from imageSrc:', src);
    imageComponents.push(
      <ImageWithPlaceholder
        key={src}
        imageUrl={src}
        itemName={itemName}
      />
    );
  }

  console.log("Final image components:", imageComponents);
  return imageComponents;
};

const MenuItem = ({ id, imageSrc, itemName, basePrice, description, isPublished, role }) => {
  const [images, setImages] = useState([]);
  console.log(images);
  const maxCharacterLength = 65;

  useEffect(() => {
    const fetchImages = async () => {
      const imageComponents = await renderImages(imageSrc, itemName); // Ensure renderImages is async
      setImages(imageComponents);
    };

    fetchImages();
  }, [imageSrc, itemName]);

  const truncateDescription = (description) => {
    if (description.length > maxCharacterLength) {
      return `${description.substring(0, maxCharacterLength)}...`;
    }
    return description;
  };

  const handleAddFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toast.success("Added to favorites");
    console.log('Added to favorites');
  };

  const handleCheckPreparationTime = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toast.success("15 Mins");
    console.log('Check preparation time');
  };

  return (
    <Link to={`/menu/${id}`}>
      <div className="relative overflow-hidden shadow-lg rounded-lg h-96 w-80 mx-auto cursor-pointer transition-transform duration-300 transform hover:scale-105">
        {/* Render a badge indicating whether the product is published or not */}
        {(role === 'admin') && (
          <>
            <div className={`absolute top-0 left-0 ${isPublished ? 'bg-green-500' : 'bg-red-500'} text-white py-1 px-3 rounded-br-lg font-semibold text-xs z-20`}>
              {isPublished ? 'Published' : 'Not Published'}
            </div>
            {/* TODO: These can be also the same way a voucher is rendered */}
            {/* <div className={`absolute top-10 left-0 ${isPublished ? 'bg-green-500' : 'bg-red-500'} text-white py-1 px-3 rounded-br-lg font-semibold text-xs z-20`}>
              {isPublished ? 'Published' : 'Not Published'}
            </div> */}
          </>
        )}
        {images.length > 0 && images.map((imageComponent, index) => (
          <div key={index}>{imageComponent}</div>
        ))}
        <button onClick={handleAddFavorite} className="absolute top-4 right-4 text-red-600 bg-white p-3 rounded-full hover:text-red-800">
          <Heart className='w-4 h-4' />
        </button>
        <button onClick={handleCheckPreparationTime} className="absolute top-4 left-4 text-gray-800 bg-white p-3 rounded-full hover:bg-black hover:text-white">
          <Clock className='w-4 h-4' />
        </button>
        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col space-y-4 h-full w-full">
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
  const productsList = useSelector((state) => state.product);
  const role = useSelector((state) => state.roleType);

  if (!productsList || !productsList.products || productsList.products.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 h-screen flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center space-x-2">
          <RefreshCcw className="text-gray-800 dark:text-white w-10 h-10" />
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            Problem fetching product list
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  let menuItems = [];
  if (role === 'admin') {
    menuItems = productsList.products;
  } else {
    menuItems = productsList.products.filter(product => product.isPublished);
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <section className="container mx-auto py-20 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menuItems.map(item => (
            <MenuItem
              key={item.productId}
              id={item.productId}
              itemName={item.productName}
              basePrice={item.basePrice}
              sizes={item.sizes}
              addOns={item.addons}
              imageSrc={item.imageUrl}
              ingredients={item.ingredients}
              description={item.description}
              isPublished={item.isPublished}
              role={role}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
