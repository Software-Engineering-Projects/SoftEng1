
import { CheckCircle, ClipboardCopyIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '@/api/order';
import toast from 'react-hot-toast';
import { FaCheckCircle } from "react-icons/fa";
import { Button } from 'flowbite-react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { Logo } from '@/public/images/public-images-index.js';

// TODO: Create a form input to allow for the user to input their order ID
export const OrderTracker = () => {

  const [isCopied, setCopied] = useState(false);
  const [orderLink, setOrderLink] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [searchedOrderId, setSearchedOrderId] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [isResult, setIsResult] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [lineItems, setLineItems] = useState([])
  // TODO: Make this into a query param instead since i will later make the user input their order id instead
  const navigate = useNavigate();
  // TODO: Create a redux action and reducer to keep track of the current user's orders, there is already an api action anyway just create the redux store for it
  const orderId = searchParams.get('orderId');
  // TODO: For security purposes
  useEffect(() => {
    if (orderId && searchParams) {
      const fetchOrder = async () => {
        try {
          const result = await getOrderById(orderId);
          console.log(result)
          setOrderLink(result.orderTrackerUrl);
          setOrderStatus(result.status);
          setOrderTotalPrice(result.totalPrice);
          setPaymentChannel(result.paymentChannel)
          setLineItems(result.lineItems);
          setIsResult(true);
        } catch (error) {
          console.error('Failed to fetch order:', error);
          setSearchParams("");
          toast.error("Order not found")
          setIsResult(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`?orderId=${searchedOrderId}`);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(orderLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const ImageComponent = ({ src, alt }) => {
    const imageSrc = src || Logo;
    return (
      <img src={imageSrc} alt={alt} className="h-10 w-10 flex flex-col items-center justify-center object-cover object-center" />
    );
  };

  // TODO: Update the styles a bit more
  // TODO: Conditional rendering if no order is found dont render the bottom part
  // TODO: Upon reloading the query param is still in the url so the order not found gets thrown multiple times, upon reloading remove the state? idk
  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      {!isResult && (
        <>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Order Tracker</h1>
            <p className="pb-6">Input your order ID</p>
          </div>

          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchedOrderId}
              onChange={(e) => setSearchedOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-colors duration-300 ease-in-out w-96"
              required
            />
            {/* TODO: Add the loader to here as well */}
            <Button variant="destructive" type="submit" className="ml-2">
              <FaMagnifyingGlass className="size-4 mr-2" />
              Search
            </Button>
          </form>
        </>
      )}
      {isResult && (
        <div className="flex flex-col items-center justify-center space-y-4 p-12">
          <FaCheckCircle className="text-green-500 w-20 h-20 mb-4" />
          {paymentChannel === "cash" ? (
            <p className="text-3xl">
              Make sure to have ${orderTotalPrice} ready for your order.
            </p>
          ) : (
            <p className="text-3xl">
              Your order has been successfully placed.
            </p>
          )}
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>
            <div className="bg-gray-100 p-3 rounded-md shadow-md text-center">
              <p className="text-lg font-semibold text-blue-600">
                Order Status: {orderStatus.toUpperCase()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {lineItems.map((item, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-md flex flex-col">
                  <ImageComponent src={item.image} alt={item.imageAlt} />
                  <p className="text-lg font-semibold mb-2">{item.productQuantity}x {item.productIdentifier}</p>
                  <p className="text-gray-600">Price: ${item.productPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="text-2xl font-extrabold text-gray-800 pt-2">
              Total Price: ${orderTotalPrice.toFixed(2)}
            </div>
          </div>
          {/* TODO: */}
          {orderLink && (
            <div className="flex flex-col items-center justify-center pt-2">
              <p className="font-bold text-2xl">Order Tracker URL</p>
              <button
                onClick={onCopy}
                disabled={isCopied}
                className="flex items-center justify-center px-4 py-2 text-black font-bold rounded-lg shadow-lg bg-gray-100 space-x-2 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-green-200"
                title={isCopied ? "Copied!" : "Click to copy your Order ID"}
              >
                {isCopied ? (
                  <div className="flex items-center">
                    Copied Successfully
                    <FaCheckCircle className="w-6 h-6 ml-2" />
                  </div>
                ) : (
                  <>
                    {orderLink}
                  </>
                )}
              </button>
            </div>
          )}
          <div className="flex justify-center items-center space-x-4 pt-6">
            <button className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
              Track another Order
            </button>
            {/* TODO: */}
            <button className="px-10 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50">
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>

  )
}

export default OrderTracker;
