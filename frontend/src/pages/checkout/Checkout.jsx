import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { Radio } from 'flowbite-react';
import { BsCashStack, BsPaypal } from "react-icons/bs";
import { useEffect, useState } from "react";
import { GrStripe } from "react-icons/gr";
import { set, useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "@/api/order";
import { useRef } from 'react';
import { toast } from "react-hot-toast";
import { MiniLoader } from '@/global-components/global-component-index.js';
import { clearCartItems } from "@/api/cart";
import { createStripeCheckoutSession } from "@/api/checkout";
// FIXME: Since the state of this isn't intialized here it throws and error if you reload within this page with visiting the root
export const Checkout = () => {
  const navigate = useNavigate();
  // FIXME:
  const cartItems = useSelector((state) => state.cart.items.items);
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user);

  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderButtonLoading, setOrderButtonLoading] = useState(false);
  const [orderDataList, setOrderDataList] = useState({});
  const [paymentError, setPaymentError] = useState('');

  const cartId = cart.cartId;
  const userId = user.uid;
  const customerName = user.displayName;
  const customerEmail = user.email;

  const cartLength = cart.length;
  const shippingFee = cartLength * 0.25;
  const subtotal = cart.totalPrice;
  const totalPrice = subtotal + shippingFee;

  const paymentMethodRef = useRef(null);

  // TODO: Add validation for the fields

  // TODO: Add validation, if no payment method is selected, show an error message, if no contact information is provided, show an error message, if no shipping information is provided, show an error message
  // TODO: Save this to the database after with the default

  // FIXME: Also fetch the cart items and set as the line items in the orderDataList object
  // TODO: Setup the shippingAddress and make sure the user object already has this information inputted in the database
  // TODO: Make sure to properly assign the line items which are based on the cart items
  const lineItems = cartItems.map(item => ({
    productId: item.productId,
    productIdentifier: item.productIdentifier,
    productQuantity: item.productQuantity,
    productPrice: item.productPrice,
    productName: item.productName,
  }));

  useEffect(() => {
    const orderData = {
      userId: userId,
      cartId: cartId,
      paymentChannel: selectedPayment,
      customerName: customerName,
      customerEmail: customerEmail,
      totalPrice: totalPrice,
      // TODO: Properly destructure the lineItems from the cart items from redux
      // TODO: This will be hardcoded for now, but it isn't actually required for the validation, im planning to create a gate, to not allow users to order until they've set an address and necessary information
      shippingAddress: {
        country: "Philippines",
        city: "Metro Manila",
        state: "NCR",
        postalCode: "1000",
        line1: "1234 Street",
        line2: "Unit 101",
      },
      lineItems: lineItems
    };
    setOrderDataList(orderData);
  }, [userId, cartId, selectedPayment, customerName, customerEmail, totalPrice]);

  const validatePaymentSelection = () => {
    if (!selectedPayment) {
      setPaymentError('Please choose a payment option.');
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    setPaymentError('');
    return true;
  };

  const onClickHandler = () => {
    const isValid = validatePaymentSelection();
    if (isValid) {
      setOrderButtonLoading(true);
      paymentCheckoutPage(selectedPayment)
        .catch((error) => {
          console.error('Payment checkout failed:', error);
        }).finally(() => {
          setOrderButtonLoading(false);
        })
    }
  };

  // TODO: Add Joi to validate the order data but it should also be based on whether or not the payment method is stripe or cash
  // FIXME: The url isn't being returned correctly for some reason.. even the api call is correct, i just forgot to import axios... tf
  // FIXME: If an error happens during stripe properly reset the loading button state
  const paymentCheckoutPage = (selectedPayment) => {
    setOrderButtonLoading(true);

    if (selectedPayment === 'stripe') {
      console.log("Redirect to Stripe [PAYMENT CHECKOUT PAGE]");
      createStripeCheckoutSession(cartId, userId)
        .then((url) => {
          if (url) {
            // todo: only clear when the payment is successful
            // clearCartItems(cartId);
            createOrder(orderDataList);
            window.location.href = url;
          } else {
            throw new Error("Failed to create Stripe checkout session");
          }
        })
        .catch((error) => {
          console.error("An error occurred during Stripe checkout:", error);
          toast.error(error.message);
        })
        .finally(() => {
          setOrderButtonLoading(false);
        });
    } else if (selectedPayment === 'cash') {
      createOrder(orderDataList)
        .then((result) => {
          if (result) {
            clearCartItems(cartId);
            navigate('/checkout/success', { replace: true });
          } else {
            throw new Error("Failed to create order");
          }
        })
        .catch((error) => {
          console.error("An error occurred during cash payment processing:", error);
          toast.error(error.message);
        })
        .finally(() => {
          setOrderButtonLoading(false);
        });
    }
  };

  return (
    <>
      <div className="gap-8 mx-auto px-16 py-4" >
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold my-6"> Checkout</h1>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
              <div ref={paymentMethodRef} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
                <div className="grid grid-cols-1 gap-y-4">
                  {['stripe', 'cash'].map((paymentMethod) => (
                    <label
                      key={paymentMethod}
                      htmlFor={paymentMethod}
                      className={`flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-blue-300 ${selectedPayment === paymentMethod ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                    >
                      <input
                        type="radio"
                        id={paymentMethod}
                        name="payment"
                        value={paymentMethod}
                        checked={selectedPayment === paymentMethod}
                        onChange={() => setSelectedPayment(paymentMethod)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-3 flex items-center">
                        {paymentMethod === 'stripe' && <GrStripe className='w-5 h-5 text-blue-500' />}
                        {paymentMethod === 'cash' && <BsCashStack className='w-5 h-5 text-green-500' />}
                        <span className="ml-2 text-sm font-medium text-gray-900">{`Pay with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {paymentError && <p className="text-red-500 text-md font-bold mt-2">{paymentError}</p>}
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4 shadow-lg">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Order Summary
                </h2>
                <div className="overflow-y-auto h-96">
                  <ul className="space-y-4">
                    {cartItems.map((product) => (
                      <li key={product.productId} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md border border-gray-300">
                          <img
                            src={product.image}
                            alt={product.imageAlt}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-semibold text-gray-900">
                            <NavLink href={product.href} className="hover:underline">
                              {product.name}
                            </NavLink>
                          </p>
                          <div className="flex flex-row justify-between items-center gap-6 p-6 bg-white">
                            <div className="flex flex-col justify-center items-start">
                              <p className="text-lg font-semibold text-gray-800">Price</p>
                              <p className="text-gray-600">$ {product.productPrice.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                              <p className="text-lg font-semibold text-gray-800">Qty</p>
                              <p className="text-gray-600">{product.productQuantity}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                              <p className="text-lg font-semibold text-gray-800">Addons</p>
                              <p className="text-gray-600">{product.productAddons.join(', ')}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                              <p className="text-lg font-semibold text-gray-800">Size</p>
                              <p className="text-gray-600">{product.productSize}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-1 pb-2 border-b-4 border-red-500">
                  <div className="flex justify-between text-v text-gray-700">
                    <span>Item Count:</span>
                    <span>{cartLength}</span>
                  </div>
                  <div className="flex justify-between text-md text-gray-700">
                    <span>Shipping:</span>
                    <span><span className="text-emerald-700 mr-1">$</span>{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-md text-gray-700">
                    <span>Subtotal:</span>
                    <span><span className="text-emerald-700 mr-1">$</span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span><span className="text-emerald-700 mr-1">$</span>{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="py-12 flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 col-span-2 mt-auto flex flex-col items-center justify-center">
              Customer Information
            </h2>
            <label className="text-gray-600 font-medium" htmlFor="mobile-number">
              Mobile Number
            </label>
            <input
              className="rounded-lg border-gray-300"
              id="mobile-number"
              placeholder="Enter your mobile number"
              type="tel"
            />
            <label className="text-gray-600 font-medium" htmlFor="name">
              Name
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="py-4 flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 col-span-2 mt-auto flex flex-col items-center justify-center">
              Shipping Information
            </h2>
            <label className="text-gray-600 font-medium" htmlFor="address-1">
              Address Line 1
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="address-1"
              placeholder="House Number etc"
            />
            <label className="text-gray-600 font-medium" htmlFor="address-2">
              Address Line 2
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="address-2"
              placeholder="Street etc"
            />
            <label className="text-gray-600 font-medium" htmlFor="city">
              City
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="city"
              placeholder="Enter your city"
            />
            <label className="text-gray-600 font-medium" htmlFor="state">
              State
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="state"
              placeholder="Enter your state"
            />
            <label className="text-gray-600 font-medium" htmlFor="country">
              Country
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="country"
              placeholder="Enter your country"
            />
            <label className="text-gray-600 font-medium" htmlFor="zip-code">
              Zip Code
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="zip-code"
              placeholder="Enter your zip code"
            />
          </div> */}

        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <button onClick={onClickHandler} className={`mt-4 mb-8 w-1/4 rounded-md bg-red-600 hover:bg-red-900/75 px-6 py-3 font-medium text-white ${orderButtonLoading ? 'cursor-not-allowed' : ''}`}
          disabled={orderButtonLoading}
        >
          {orderButtonLoading ? (
            <MiniLoader message="Placing Order" className="text-black" />
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </>
  )
}