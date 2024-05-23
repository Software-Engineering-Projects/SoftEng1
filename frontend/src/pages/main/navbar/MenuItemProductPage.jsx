import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Label, Modal, Select } from 'flowbite-react';
import { Clock, Dessert, Eye, Heart, Minus, Plus, Search, SearchX, ShoppingBasket, Star } from 'lucide-react';
import { IoMdStar } from "react-icons/io";
import { GiWrappedSweet } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
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
import { getUserCart } from '@/api/cart';
import { setCartItems } from '@/context/actions/cartAction';
import { Logo } from '@/public/images/public-images-index';
import { BiDollar } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
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

      await addToCartApi(cartId, [productToAdd])
        .then(async () => {
          setIsSubmitting(true)
          try {
            const fetchedCart = await getUserCart(user.uid);
            dispatch(setCartItems(fetchedCart.data));
            console.log(fetchedCart.data);
          } catch (error) {
            console.error('Failed to fetch cart:', error);
          } finally {
            setIsSubmitting(false)
          }
        });
      // REVIEW: This work fine, just need to adjust redux to reflect it to the UI,
      // FIXME: I need to fix the way redux is adding the items, to update the UI correctly, for a first item it correctly adds it with no problem however, the second item is not added correctly, it is added as an array of items instead of a single item, i presume, ill look into it
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >

          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <ProductImage searchedItem={searchedItem} />
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

  // TODO: Create a modal login signup/sign-in component
  const handleCloseLoginModal = () => {
    // close the modal
    setShowLoginModal(false);
  };



  // TODO: Add better styling to this page
  if (!searchedItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-sm mx-auto border-b-2 border-rose-400">
          <div className="flex flex-col items-center">
            <SearchX className="w-16 h-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              We couldn't find the product you were looking for. Please try searching again or browse our categories.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105"
              type="button"
            >
              <NavLink to="/menu">
                Browse Products
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log(searchedItem)

  // TODO: Make this use image kit
  const ProductImage = ({ searchedItem }) => {
    const imageSrc = searchedItem.imageUrl || Logo;

    return (
      <div className="flex-shrink-0 pt-0.5">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={imageSrc}
          alt={searchedItem.productName}
        />
      </div>
    );
  };

  const ProductCard = ({ productSrc, productName, productDescription, productPreparationTime }) => {
    const imageSrc = productSrc || Logo;

    return (
      <div className="max-w-full xl:max-w-[40rem] h-full bg-white rounded-lg shadow-lg overflow-hidden relative border-b-8 border-rose-400 border-x-4 border-t-4">
        <div>
          {/* TODO: List of Vouchers */}
          <div className="absolute top-4 left-4 bg-red-700 text-white px-2 py-1 text-xs font-semibold rounded-br-lg rounded-tl-lg flex flex-col space-y-2 items-center justify-center">
            <span className="text-lg font-semibold flex items-center justify-center">
              <BiDollar className='w-[20px] h-[20px] ' />10 Off: first-time</span>
          </div>

          <div className="flex items-center justify-center bg-gray-100">
            <img
              src={imageSrc}
              alt={productName}
              className="max-h-[28rem] object-cover w-full"
            />
          </div>

          <div className="text-center py-6 bg-gray-100">
            <span className="text-4xl font-bold text-gray-800 transition-colors duration-500 ease-in-out hover:text-gray-600">
              {productName}
            </span>
          </div>
        </div>

        <div className="p-6 bg-zinc-200">
          <div className="flex flex-col items-center font-bold text-center text-2xl transition-colors duration-500 ease-in-out hover:text-gray-600">
            <span>{productDescription}</span>
          </div>
        </div>
        {productPreparationTime && (
          <div className="flex items-center justify-between space-x-8 bg-gray-100 h-[106px] p-4 rounded-lg shadow-md">
            <div className="text-lg font-semibold text-gray-800 ">
              Preparation Time
              <div className='flex items-center justify-center'>
                <Clock className="w-6 h-6 mr-2" />
                {productPreparationTime} Minutes
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-800 ">
              Estimated Delivery Time
              <div className='flex items-center justify-center'>
                <Clock className="w-6 h-6 mr-2" />
                {productPreparationTime} Minutes
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto pt-8 flex items-center justify-center bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Product Card */}
        <ProductCard productSrc={searchedItem.imageUrl} productName={searchedItem.productName} productDescription={searchedItem.description} productPreparationTime={searchedItem.preparationTime} />

        <div className="flex flex-col bg-white rounded-lg shadow-lg p-8 h-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b pb-2">{searchedItem.productName}</h2>
          <div className="flex flex-col space-y-2 mb-2 text-xl font-bold">
            <p className="font-semibold text-gray-700">
              Base Price: {" "}
              <span className="font-normal text-gray-900">
                ${searchedItem.basePrice}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-center text-gray-800">
              Variations
            </h3>
            <div className=" mb-4 border-b pb-2" />
            <div className="space-y-4">
              <p className="text-2xl font-medium text-gray-800">
                Sizes
              </p>
              <div className="flex flex-wrap gap-4">
                {searchedItem.sizes.map((size, index) => (
                  <label
                    key={index}
                    htmlFor={`size-${index}`}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id={`size-${index}`}
                      name="selectedSize"
                      value={size.name}
                      onChange={handleSizeChange}
                      className="text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                    />
                    <div className='text-xl flex space-x-2 items-center justify-between'>
                      <span className="text-lg font-medium text-gray-700">{size.name}</span>
                      <span className="text-gray-600">+${size.price}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className=" mb-4 border-b pb-2" />
            <div className="space-y-4">
              <p className="text-2xl font-medium text-gray-800">Addons</p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {searchedItem.addons.length > 0 ? (
                    searchedItem.addons.map((addon, index) => (
                      <label key={index} htmlFor={`addon-${index}`} className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          id={`addon-${index}`}
                          name="selectedAddon"
                          value={addon.name}
                          onChange={handleAddOnChange}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-lg font-medium text-gray-700">{addon.name}</span>
                        <span className="text-gray-600">+${addon.price}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-red-600">No Addons Available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" mb-4 border-b pb-2" />

          {/* Ingredients */}
          <div className="flex items-center mb-6">
            <Label htmlFor="addOns" value="Ingredients" className="pr-2 text-gray-800 text-2xl" />
            <Tooltip
              content={
                <div className="w-80">
                  <Typography color="white" className="font-medium text-lg mb-2">
                    Ingredients Full List
                  </Typography>
                  <Typography variant="small" color="white" className="font-normal opacity-80">
                    <p className="leading-relaxed">
                      <div className="font-semibold">{searchedItem.ingredients.join(', ')}</div>
                    </p>
                  </Typography>
                </div>
              }
            >
              <Eye className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
            </Tooltip>
          </div>
          <div className=" mb-4 border-b pb-2" />

          {/* Quantity Controls */}
          <div className="flex flex-col mb-6 justify-between">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-lg font-semibold text-gray-800">Quantity:</span>
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <button
                  onClick={decrementQuantity}
                  className="text-gray-600 font-bold py-1 px-2 rounded-md focus:outline-none hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-2 font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="text-gray-600 font-bold py-1 px-2 rounded-md focus:outline-none hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleAddCartItem}
              className={`bg-red-600 w-full hover:bg-red-700 text-white font-bold py-3 rounded-md text-lg flex-shrink-0 bottom-0 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <MiniLoader message="Adding to Cart" />
              ) : (
                <div className='flex items-center justify-center mr-2'>
                  <ShoppingBasket className='mr-2' />
                  Add to Cart
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
