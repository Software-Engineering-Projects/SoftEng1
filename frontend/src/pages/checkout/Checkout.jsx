import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { Radio } from 'flowbite-react';
import { BsCashStack, BsPaypal } from "react-icons/bs";
import { useEffect, useState } from "react";
import { GrStripe } from "react-icons/gr";
import { set, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { createOrder } from "@/api/order";
import { useRef } from 'react';
import { toast } from "react-hot-toast";
import { MiniLoader } from '@/global-components/global-component-index.js';
import { clearCartItems } from "@/api/cart";
import { createStripeCheckoutSession } from "@/api/checkout";
import { Logo } from '@/public/images/public-images-index.js';
import { setCartItems } from "../../context/actions/cartAction";
import { getUserCart } from '@/api/cart'
import { Loader } from "@/global-components/global-component-index.js";

// FIXME: Since the state of this isn't intialized here it throws and error if you reload within this page with visiting the root
export const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // FIXME:
  const cartItems = useSelector((state) => state.cart.items.items);
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user);

  if (!cartItems || cartItems.length === 0 || !user) {
    navigate('/menu', { replace: true });
  }

  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderButtonLoading, setOrderButtonLoading] = useState(false);
  const [orderDataList, setOrderDataList] = useState({});
  const [paymentError, setPaymentError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cartId = cart.cartId;
  const userId = user.uid;
  const customerName = user.displayName;
  const customerEmail = user.email;

  const cartLength = cart.length;
  const shippingFee = cartLength * 0.25;
  const subtotal = cart.totalPrice;
  const totalPrice = subtotal + shippingFee;

  const paymentMethodRef = useRef(null);

  useEffect(() => {
    // Only proceed when loading is false
    if (!isLoading) {
      const orderData = {
        userId: userId,
        cartId: cartId,
        paymentChannel: selectedPayment,
        customerName: customerName,
        customerEmail: customerEmail,
        totalPrice: totalPrice,
        // TODO: This will be hardcoded for now, but it isn't actually required for the validation, im planning to create a gate, to not allow users to order until they've set an address and necessary information
        shippingAddress: {
          country: "Philippines",
          city: "Metro Manila",
          state: "NCR",
          postalCode: "1000",
          line1: "1234 Street",
          line2: "Unit 101",
        },
        lineItems: cartItems.map(item => ({
          productId: item.productId,
          productIdentifier: item.productIdentifier,
          productQuantity: item.productQuantity,
          productPrice: item.productPrice,
          productName: item.productName,
        }))
      };
      setOrderDataList(orderData);
    }
  }, [isLoading, userId, cartId, selectedPayment, customerName, customerEmail, totalPrice, cartItems]);

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
  // REVIEW:
  const paymentCheckoutPage = async (selectedPayment) => {
    setOrderButtonLoading(true);

    try {
      if (selectedPayment === 'stripe') {
        console.log("Redirect to Stripe [PAYMENT CHECKOUT PAGE]");
        const url = await createStripeCheckoutSession(cartId, userId);
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("Failed to create Stripe checkout session");
        }
      } else if (selectedPayment === 'cash') {
        const result = await createOrder(orderDataList);
        if (result) {
          setIsLoading(true);
          navigate('/checkout/success', { replace: true });
        } else {
          throw new Error("Failed to create order");
        }
      }
      await clearCartItems(cartId);
      const fetchedCart = await getUserCart(user.uid);
      dispatch(setCartItems(fetchedCart.data));
    } catch (error) {
      console.error("An error occurred during payment processing:", error);
      toast.error(error.message);
    } finally {
      setOrderButtonLoading(false);
    }

  };

  const ImageComponent = ({ src, alt }) => {
    const imageSrc = src || Logo;
    return (
      <img src={imageSrc} alt={alt} className="h-full w-full object-cover object-center" />
    );
  };

  if (isLoading) {
    return <Loader variant="cart" className="text-black h-screen w-full" />;
  }

  return (
    <>
      <div className="gap-8 mx-auto px-16 py-4" >
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold my-6">
            Checkout
          </h1>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
              <div ref={paymentMethodRef} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Method
                </h2>
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
                {paymentError && <p className="text-red-500 text-md font-bold mt-2">
                  {paymentError}
                </p>}
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
                          <ImageComponent src={product.imageUrl} alt={product.productName} />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-semibold text-gray-900">
                            <NavLink to={`/menu/${product.productId}`} className="hover:underline">
                              {product.productName}
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