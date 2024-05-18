import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Label, Modal, Select } from 'flowbite-react';
import { Dessert, Eye, Heart, Minus, Plus, Search, SearchX, Star } from 'lucide-react';
import { IoMdStar } from "react-icons/io";
import { GiWrappedSweet } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/context/actions/cartAction';
import { addToCartApi } from '@/api/cart';
import toast, { Toaster } from 'react-hot-toast';
import { MiniLoader } from '@/global-components/global-component-index.js';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

// TODO: This is correct now its adding the sizes and addons option to the base price which is correct however my products data is defined to provide the overall value not the added value to the base price. So I need to change the data to reflect the added value to the base price instead of the overall value.


const AnimatedNumber = ({ value, commas }) => {
  // TODO: The animation should start at the previous value, not 0 fix the quantity change which is causing this issue
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    let animationFrame;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newValue = easeInOut(progress, animatedValue, value - animatedValue);

      setAnimatedValue(newValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  const easeInOut = (t, b, c) => {
    t /= 0.5;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  return (
    <span>
      {commas ? Math.abs(animatedValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.abs(animatedValue).toFixed(2)}
    </span>
  );
};
// FIXME: Ensure the global store is initialized before accessing as it may cause undefined values
// TODO: Set add cart item to the global store
export const MenuItemProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedAddOn, setSelectedAddOn] = useState('');
  const [productIdentifier, setProductIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user);
  const productsList = useSelector((state) => state.product);
  const cartId = useSelector(state => state.cart.items.cartId);

  // FIXME: Sometimes this shit is undefined because of the redux state, properly configure the global store later
  // TODO: Save the item added to the cart to the global store
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchedItem = productsList.products.find((product) => product.productId === id);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    updateProductIdentifier(e.target.value, selectedAddOn);
  };

  const handleAddOnChange = (e) => {
    setSelectedAddOn(e.target.value);
    updateProductIdentifier(selectedSize, e.target.value);
  };

  const updateProductIdentifier = (size, addon) => {
    const updatedProductIdentifier = `${searchedItem.productId}-${size}-${addon}`;
    setProductIdentifier(updatedProductIdentifier);
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddCartItem = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Add better validation,

      // TODO: Add better validation,
      if (!user) {
        alert('Please login to add items to your cart.');
        setIsSubmitting(false);
        return;
      }

      if (!selectedSize) {
        alert('Please select a size.');
        setIsSubmitting(false);
        return;
      }
      if (!selectedAddOn) {
        alert('Please select an addon.');
        setIsSubmitting(false);
        return;
      }

      const productToAdd = {
        productId: searchedItem.productId,
        productQuantity: quantity,
        productAddons: [selectedAddOn],
        productSize: selectedSize
      };

      await addToCartApi(cartId, [productToAdd]);
      // REVIEW: This work fine, just need to adjust redux to reflect it to the UI,
      // FIXME: I need to fix the way redux is adding the items, to update the UI correctly, for a first item it correctly adds it with no problem however, the second item is not added correctly, it is added as an array of items instead of a single item, i presume, ill look into it
      dispatch(addToCart(productToAdd));
      setIsSubmitting(false);

      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >

          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={searchedItem.productImage}
                  alt={searchedItem.productName}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Added {searchedItem.productName} to your cart.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {quantity} x {selectedSize} {searchedItem.productName} with {selectedAddOn}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Error adding item to cart");
    } finally {
      setIsSubmitting(false);
      setQuantity(1);
    }
  };

  const handleCloseLoginModal = () => {
    // close the modal
    setShowLoginModal(false);
  };

  // TODO: Add better styling to this page
  if (!searchedItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm mx-auto border-b-2">
          <div className="flex flex-col items-center">
            <SearchX className="w-16 h-16 text-gray-500 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              We couldn't find the product you were looking for.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto pt-12 flex items-center justify-center">
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        {/* Product Card */}
        <div className="max-w-[26rem] h-full m-8">
          {/* Card Header */}
          <div className="relative rounded-lg overflow-hidden">
            <div className="flex items-center justify-center">
              <img
                src={productsList.products.imageUrl}
                alt={productsList.products.productName}
                className="max-h-[28rem] object-cover rounded-lg w-full"
              />
            </div>
            <span className='flex flex-col items-center justify-center font-bold text-2xl pt-4'>{productsList.products.productName}</span>
          </div>

          {/* Card Body */}
          <CardBody>
            <div className="mb-3 flex flex-col items-center justify-between">
              {/* Add a title or subtitle if needed */}
            </div>
            <Typography color="gray">
              <div className='flex flex-col'>
                {/* <span className='font-bold'>Product Description:</span> */}
                <span>{productsList.products.description}</span>
              </div>
            </Typography>
          </CardBody>
        </div>

        {/* Product Details */}
        <div className="flex flex-col ml-8 max-w-[16rem]">
          <h2 className="text-xl border-b-2 border-slate-300 font-bold text-center dark:text-white mb-4 "> Details</h2>
          <p className="font-bold">Base Price: ${searchedItem.basePrice}</p>

          <div className="mt-4">
            <span className="font-semibold mb-4 block border-b-2 border-slate-300">Variation</span>

            {/* Select Size Dropdown */}
            <div className="mb-4">
              <Label value="Select Size" />
              <div className="flex flex-col">
                {searchedItem.sizes.map((size, index) => (
                  <div key={index} className="mr-2 mb-4">
                    <input
                      type="radio"
                      id={`size-${index}`}
                      name="selectedSize"
                      value={size.name}
                      onChange={handleSizeChange}
                    />
                    <Label htmlFor={`size-${index}`} className="ml-2">
                      {size.name} (+${size.price})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Add-On Radio Buttons */}
            <div className="mb-4">
              <Label value="Select Addons" />
              <div className="flex flex-col">
                {searchedItem.addons.length > 0 ? (
                  searchedItem.addons.map((addon, index) => (
                    <div key={index} className="mr-2 mb-4">
                      <input
                        type="radio"
                        id={`addon-${index}`}
                        name="selectedAddon"
                        value={addon.name}
                        onChange={handleAddOnChange}
                      />
                      <Label htmlFor={`addon-${index}`} className="ml-2">
                        {addon.name} (+${addon.price})
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className='text-red-600'>No Addons Available</p>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className='flex items-center mb-4'>
              <Label htmlFor="addOns" value="Ingredients" className='pr-2 text-gray-600' />
              <Tooltip
                content={
                  <div className="w-80">
                    <Typography color="white" className="font-medium text-lg mb-2">
                      Ingredients Full List
                    </Typography>
                    <Typography variant="small" color="white" className="font-normal opacity-80">
                      <p className='leading-relaxed'>
                        <div className='font-semibold'>{searchedItem.ingredients.join(', ')}</div>
                      </p>
                    </Typography>
                  </div>
                }
              >
                <Eye className='w-5 h-5 hover:text-blue-600 cursor-pointer' />
              </Tooltip>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col mb-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="mr-2">Quantity:</span>
                <button
                  onClick={decrementQuantity}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-2 font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-x-2 mt-4 items-center">
                <button
                  onClick={handleAddCartItem}
                  className={`bg-red-600 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm flex-shrink-0 relative ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <MiniLoader message="Adding to Cart" />
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
