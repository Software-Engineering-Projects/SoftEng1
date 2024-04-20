// import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
// import { label } from "@/components/ui/label"
// import { input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { Radio } from 'flowbite-react';
import { BsCashStack, BsPaypal } from "react-icons/bs";
import { Coins } from 'lucide-react';
import { useState } from "react";
import { GrStripe } from "react-icons/gr";
import { SiVisa } from "react-icons/si";
import { FaCcVisa } from "react-icons/fa6";
export const Checkout = () => {

  const cartItems = useSelector((state) => state.cart.items);
  console.log("Cart Items", cartItems)
  const totalPriceArray = cartItems.map((item) => item.options.totalPrice * item.quantity);
  const cartTotalPrice = totalPriceArray.reduce((a, b) => a + b, 0);
  const cartLength = cartItems.length;
  const shippingFee = cartLength * 1.5;
  const cartGrandTotal = cartTotalPrice + shippingFee;
  console.log("Total Price Array", totalPriceArray)
  console.log("Cart Total Price", cartTotalPrice)
  const [selectedPayment, setSelectedPayment] = useState('');
  console.log("Selected Payment", selectedPayment)

  // TODO: Add validation, if no payment method is selected, show an error message, if no contact information is provided, show an error message, if no shipping information is provided, show an error message
  const onClickHandler = () => {
    paymentCheckoutPage();
    console.log("Pay Order")
  }
  // TODO: Add all the different payment channels
  const paymentCheckoutPage = () => {
    if (selectedPayment === 'stripe') {
      console.log("Redirect to Stripe [PAYMENT CHECKOUT PAGE]")
    }
    if (selectedPayment === 'cash') {
      console.log("Make sure to have cash ready [PAYMENT CHECKOUT PAGE]")
    }
    if (selectedPayment === 'paypal') {
      console.log("Redirect to PayPal [PAYMENT CHECKOUT PAGE]")
    }
    if (selectedPayment === 'appWallet') {
      console.log("Use In-App Credits [PAYMENT CHECKOUT PAGE]")
    }
  }
  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto p-4">
      <div className="col-span-2">
        <h1 className="text-3xl font-bold my-6 text-center">Checkout</h1>
      </div>

      <div className="border-b pb-4 mb-4 col-span-2 md:col-span-1">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Payment Method</h2>
        <div className="flex flex-col items gap-y-2">
          <label
            htmlFor="stripe"
            className={`flex items-center bg-white border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-white dark:border-gray-700 dark:text-gray-900 me-2 mb-2 ${selectedPayment === 'stripe' ? 'ring-2 ring-[#3182ce]' : ''
              }`}
          >
            <Radio
              id="stripe"
              name="payment"
              value="stripe"
              checked={selectedPayment === 'stripe'}
              onChange={() => setSelectedPayment('stripe')}
            />
            <span className="flex items-center">
              <GrStripe className='w-6 h-6 ml-2 text-blue-500' />
              <span className="w-4 h-4 me-2 -ms-4 text-[#626890]"></span>
              Pay with Stripe
            </span>
          </label>

          <label
            htmlFor="cash"
            className={`flex items-center bg-white border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-white dark:border-gray-700 dark:text-gray-900 me-2 mb-2 ${selectedPayment === 'cash' ? 'ring-2 ring-[#3182ce]' : ''
              }`}
          >
            <Radio
              id="cash"
              name="payment"
              value="cash"
              checked={selectedPayment === 'cash'}
              onChange={() => setSelectedPayment('cash')}
            />
            <span className="flex items-center">
              <BsCashStack className='w-6 h-6 ml-2 text-emerald-700' />

              <span className="w-4 h-4 me-2 -ms-4 text-[#626890]"></span>
              Cash on Delivery
            </span>
          </label>

          <label
            htmlFor="paypal"
            className={`flex items-center bg-white border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-white dark:border-gray-700 dark:text-gray-900 me-2 mb-2 ${selectedPayment === 'paypal' ? 'ring-2 ring-[#3182ce]' : ''
              }`}
          >
            <Radio
              id="paypal"
              name="payment"
              value="paypal"
              checked={selectedPayment === 'paypal'}
              onChange={() => setSelectedPayment('paypal')}
            />
            <span className="flex items-center">
              <BsPaypal className='w-6 h-6 ml-2 text-blue-500' />
              <span className="w-4 h-4 me-2 -ms-4 text-[#626890]"></span>
              Pay with PayPal
            </span>
          </label>

          <label
            htmlFor="appWallet"
            className={`flex items-center bg-white border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-white dark:border-gray-700 dark:text-gray-900 me-2 mb-2 ${selectedPayment === 'appWallet' ? 'ring-2 ring-[#3182ce]' : ''
              }`}
          >
            <Radio
              id="appWallet"
              name="payment"
              value="appWallet"
              checked={selectedPayment === 'appWallet'}
              onChange={() => setSelectedPayment('appWallet')}
            />
            <span className="flex items-center">
              <Coins className="w-6 h-6 ml-2 text-yellow-500" />
              <span className="w-4 h-4 me-2 -ms-4 text-[#626890]"></span>
              In-App Credits
            </span>
          </label>
        </div>
      </div>

      <div className="border-b pb-4 mb-4 col-span-2 md:col-span-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Order Summary</h2>
        <div className="overflow-y-auto max-h-96">
          <ul className="space-y-4">
            {cartItems.map((product) => (
              <li key={product.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex-grow">
                  <p className="text-lg font-semibold">
                    <a href={product.href} className="text-blue-500 hover:underline cursor-pointer">
                      {product.name}
                    </a>
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Price: ${product.options.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-700">Addons: {product.options.addons}</p>
                      <p className="text-sm text-gray-700">Size: {product.options.size}</p>
                      <p className="text-gray-500">Qty {product.quantity}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-gray-700 text-sm py-4">Item Count: {cartLength}</span>
          <div className="flex justify-between">
            <span className="text-gray-700 text-sm">Shipping: </span> <span>${shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 text-sm">Subtotal </span>
            <span className="">${cartTotalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-bold text-lg">Total: </span>  <span className="text-black font-bold text-lg">${cartGrandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex flex-col col-span-2 mt-auto">Contact Information</h2>
      <div className="border-b pb-8 mb-4 col-span-2 md:col-span-1 space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium" htmlFor="mobile-number">
            Mobile Number
          </label>
          <input
            className="rounded-lg border-gray-300"
            id="mobile-number"
            placeholder="Enter your mobile number"
            type="tel"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium" htmlFor="name">
            Name
          </label>
          <input
            className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            id="name"
            placeholder="Enter your name"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 col-span-2 mt-auto ">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-4">
        <div className="space-y-4">
          {/* Address Line 1 */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="address-1">
              Address Line 1
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="address-1"
              placeholder="House Number etc"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="address-2">
              Address Line 2
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="address-2"
              placeholder="Street etc"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="city">
              City
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="city"
              placeholder="Enter your city"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="state">
              State
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="state"
              placeholder="Enter your state"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="country">
              Country
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="country"
              placeholder="Enter your country"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="zip-code">
              Zip Code
            </label>
            <input
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              id="zip-code"
              placeholder="Enter your zip code"
            />
          </div>
        </div>
      </div>

      {/* TODO: Add Stripe Redirect to this */}
      {/* TODO: Add modal to confirm all the details input */}
      <button onClick={onClickHandler} className="col-span-2 mt-4 mb-8 w-full rounded-md bg-red-600 hover:bg-red-700 px-6 py-3 font-medium text-white">
        Place Order
      </button>
    </div >
  )
}