// import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
// import { label } from "@/components/ui/label"
// import { input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { Radio } from 'flowbite-react';
import { BsCashStack, BsPaypal } from "react-icons/bs";
import { useEffect, useState } from "react";
import { GrStripe } from "react-icons/gr";
import { set, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/order";
import { useRef } from 'react';
import { toast } from "react-hot-toast";

// FIXME: Since the state of this isn't intialized here it throws and error if you reload within this page with visiting the root
export const Checkout = () => {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user);

  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderButtonLoading, setOrderButtonLoading] = useState(false);
  const [orderDataList, setOrderDataList] = useState({});
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [cartGrandTotal, setCartGrandTotal] = useState(0);
  const [paymentError, setPaymentError] = useState('');

  const cartId = cartItems.cartId;
  const userId = user.uid;
  const customerName = user.displayName;
  const customerEmail = user.email;

  const cartLength = cartItems.items.length;
  const shippingFee = cartLength * 0.25;
  const subtotal = cartItems.totalPrice
  const totalPrice = subtotal + shippingFee;

  const paymentMethodRef = useRef(null);

  const validatePaymentSelection = () => {
    if (!selectedPayment) {
      setPaymentError('Please choose a payment option.');
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    setPaymentError('');
    return true;
  };
  // TODO: Add validation for the fields

  // TODO: Add validation, if no payment method is selected, show an error message, if no contact information is provided, show an error message, if no shipping information is provided, show an error message
  // TODO: Save this to the database after with the default

  // FIXME: userId is required????, its in the orderDataList object though
  // FIXME: Properly handle the validation error from the createOrder api action
  // FIXME: Also fetch the cart items and set as the line items in the orderDataList object
  // TODO: Setup the shippingAddress and make sure the user object already has this information inputted in the database
  useEffect(() => {
    const orderData = {
      userId: userId,
      cartId: cartId,
      paymentChannel: selectedPayment,
      // orderDate: new Date().toISOString(),
      customerName: customerName,
      customerEmail: customerEmail,
      // status: 'pending',
      totalPrice: totalPrice,
    };
    setOrderDataList(orderData);
  }, [userId, cartId, selectedPayment, customerName, customerEmail, totalPrice]);
  console.log("Order Data", orderDataList)

  const onClickHandler = () => {
    const isValid = validatePaymentSelection();
    if (isValid) {
      paymentCheckoutPage(selectedPayment);
    }
  }

  // TODO: Add Joi to validate the order data but it should also be based on whether or not the payment method is stripe or cash
  const paymentCheckoutPage = async (selectedPayment) => {
    try {
      if (selectedPayment === 'stripe') {
        console.log("Redirect to Stripe [PAYMENT CHECKOUT PAGE]");
        // Spread the orderDataList object into the createOrder call
        await createOrder({ orderDataList });
      } else if (selectedPayment === 'cash') {
        console.log(orderDataList);
        try {
          await createOrder({ orderDataList });
          navigate('/checkout/cash-on-delivery', { replace: true });
        } catch (error) {
          console.error("An error occurred during payment checkout:", error);
        }
        console.log("Make sure to have cash ready [PAYMENT CHECKOUT PAGE]");
      }
    } catch (error) {
      console.error("An error occurred during payment checkout:", error);
      if (selectedPayment === 'stripe') {
        console.error("Stripe payment error:", error);
        toast.error("An error occurred during stripe checkout")
      } else if (selectedPayment === 'cash') {
        console.error("Cash payment error:", error);
        toast.error("An error occurred during cash checkout")
      }
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
            <div className="w-full lg:w-1/2 px-4">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Order Summary
                </h2>
                <div className="overflow-y-auto h-96">
                  <ul className="space-y-4">
                    {cartItems.items.map((product) => (
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
                            <a href={product.href} className="hover:underline">
                              {product.name}
                            </a>
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
                <div className="mt-1">
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
        <button onClick={onClickHandler} className="mt-4 mb-8 w-1/4 rounded-md bg-red-600 hover:bg-red-900/75 px-6 py-3 font-medium text-white">
          Place Order
        </button>
      </div>
    </>
  )
}