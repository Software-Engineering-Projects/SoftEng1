import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Minus, Plus, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, increaseQuantity, reduceQuantity } from '@/context/actions/cartAction';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { deleteCartItem } from '@/api/cart.js';
import { updateCartItemQuantity } from '@/api/cart.js';
import { MiniLoader } from '@/global-components/global-component-index.js';
import { setCartItems } from '@/context/actions/cartAction.js';
import { NavLink } from 'react-router-dom'
// TODO: Update the cart when choosing different sizes and addons from initial product page, and add the price of the addons to the total price
// TODO: Fix image to be displayed in the cart, for now its the local JSON, but im setting up the firebase functionality already
// TODO: The addons and size should be fetched from the backend
// TODO: Add the addons price, which must also be fetched from the backend

// TODO: Add the increment and decrement function for the quantity

// TODO: Fetch the cart data from the global store
// TODO: Set the button actions
export const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true)
  const [removingStatus, setRemovingStatus] = useState({});
  const [increasingStatus, setIncreasingStatus] = useState({});
  const [decreasingStatus, setDecreasingStatus] = useState({});

  // Used to disable all cart button actions when one is being processed
  const [massDisable, setMassDisable] = useState(false);
  const cart = useSelector((state) => state.cart)

  const cartItems = useSelector((state) => state.cart.items.items)
  const cartId = useSelector((state) => state.cart.items.cartId);
  console.log(cartId);
  const totalPrice = useSelector((state) => state.cart.items.totalPrice);
  console.log(totalPrice)
  const cartLength = cart.items.length
  console.log(cartLength)

  const totalPriceArray = totalPrice || 0

  // TODO: When the API endpoints are made, fetch the cart items from the backend
  // TODO: The api action are being called correctly and is being updated in the backend, however the UI is not updating, and the catch block is being called
  // FIXME: This error that is happening is the frontend is most likely due to redux
  // REVIEW: Create a state to keep track of individual product quantity action and remove action, to have the appropriate loader for that button
  // TODO:
  const handleRemoveCartItem = async (productIdentifier) => {
    const productId = cartItems.find((item) => item.productIdentifier === productIdentifier).productId;
    setRemovingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: true }));
    setMassDisable(true);
    console.log(productId);
    try {
      if (productIdentifier) {
        console.log("Product Identifier remove Cart Item", productIdentifier);
        await deleteCartItem(cartId, productId, productIdentifier);
        dispatch(removeFromCart(productIdentifier));
      }
      else {
        console.error("Could not find productIdentifier in the cart.");
      }
    } catch (error) {
      // FIXME: Throws an error here, because of redux but the action is being called correctly, and the API is working correctly and the changes are reflected in the database
      console.error("Error removing item from cart", error);
      toast.error("Error removing item from cart");
    }
    finally {
      setRemovingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: false }));
      setMassDisable(false);
    }
  };

  const handleIncreaseQuantity = async (productIdentifier) => {
    const product = cartItems.find((item) => item.productIdentifier === productIdentifier);
    setIncreasingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: true }));
    setMassDisable(true);

    try {
      if (product) {
        const newQuantity = Number(product.productQuantity) + 1;
        await updateCartItemQuantity(cartId, product.productId, newQuantity, productIdentifier);
        dispatch(increaseQuantity(productIdentifier));

        const updatedCartItems = cartItems.map(item => {
          if (item.productIdentifier === productIdentifier) {
            return { ...item, productQuantity: newQuantity };
          }
          return item;
        });
      } else {
        console.error("Could not find productIdentifier in the cart.");
      }
    } catch (error) {
      // FIXME: Throws an error here, because of redux but the action is being called correctly, and the API is working correctly and the changes are reflected in the database
      console.error("Error increasing item quantity", error);
      toast.error("Error increasing item quantity");
    }
    finally {
      setIncreasingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: false }));
      setMassDisable(false);
    };
  };

  const handleDecreaseQuantity = async (productIdentifier) => {
    const product = cartItems.find((item) => item.productIdentifier === productIdentifier);
    setDecreasingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: true }));
    setMassDisable(true);

    try {
      if (product) {
        const newQuantity = Math.max(product.productQuantity - 1, 1);
        await updateCartItemQuantity(cartId, product.productId, newQuantity, productIdentifier);
        dispatch(reduceQuantity(productIdentifier));

        const updatedCartItems = cartItems.map(item => {
          if (item.productIdentifier === productIdentifier) {
            return { ...item, productQuantity: newQuantity };
          }
          return item;
        });

      } else {
        console.error("Could not find productIdentifier in the cart.");
      }
    } catch (error) {
      // FIXME: Throws an error here, because of redux but the action is being called correctly, and the API is working correctly and the changes are reflected in the database
      console.error("Error decreasing item quantity", error);
      toast.error("Error decreasing item quantity");
    }
    finally {
      setDecreasingStatus(prevStatus => ({ ...prevStatus, [productIdentifier]: false }));
      setMassDisable(false);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-700"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {cartLength === 0 ? (
                        <div className="absolute top-12 ml-24 mt-72 flex flex-col items-center justify-center">
                          <p className="text-2xl font-semibold text-gray-800">Your cart is empty</p>
                          <MdOutlineRemoveShoppingCart className="w-24 h-24 mt-8 text-red-600" />
                        </div>
                      ) : (
                        <>
                          <div className="mt-8">
                            <div className="flow-root">
                              <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {cartItems.map((product) => (
                                  <li key={product.productIdentifier} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img src={product.image} alt={product.imageAlt} className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3><NavLink href={product.href}>{product.name}</NavLink></h3>
                                          <p className="ml-4">${' '}{product.productPrice.toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700">Addons: {product?.productAddons}</p>
                                        <p className="mt-1 text-sm text-gray-700">Size: {product.productSize}</p>
                                        <p className="text-gray-500 ">Qty : <span className='text-gray-900 font-bold'>{product.productQuantity}</span></p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-xs">
                                        <div className="gap-x-2 flex">
                                          <button onClick={() => handleDecreaseQuantity(product.productIdentifier)} disabled={massDisable} className={`${massDisable ? 'cursor-not-allowed' : ''}`}>
                                            {decreasingStatus[product.productIdentifier] ? (
                                              <MiniLoader className="text-black" />
                                            ) : (
                                              <Minus className="w-4 h-4 hover:text-blue-600" />
                                            )}
                                          </button>
                                          <button onClick={() => handleIncreaseQuantity(product.productIdentifier)} disabled={massDisable} className={`${massDisable ? 'cursor-not-allowed' : ''}`}>
                                            {increasingStatus[product.productIdentifier] ? (
                                              <MiniLoader className="text-black" />
                                            ) : (
                                              <Plus className="w-4 h-4 hover:text-blue-600" />
                                            )}
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveCartItem(product.productIdentifier)}
                                          disabled={massDisable}
                                          className={`px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium ${massDisable ? 'bg-red-800 hover:bg-red-800 cursor-not-allowed' : ''}`}
                                        >
                                          {removingStatus[product.productIdentifier] ? (
                                            <MiniLoader />
                                          ) : (
                                            <Trash2Icon className='w-4 h-4' />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>${' '}{totalPriceArray.toFixed(2)}</p>
                      </div>
                      {(cartLength > 0) && (
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              setOpen(false);
                              navigate('/checkout', { replace: true });
                            }}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
                          >
                            Checkout
                          </button>
                        </div>
                      )}
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-700">
                        <p>
                          <button
                            type="button"
                            className="font-medium text-blue-600 hover:text-blue-500"
                            onClick={() => {
                              setOpen(false);
                              navigate('/menu', { replace: true });
                            }}
                          >
                            Continue Browsing
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}