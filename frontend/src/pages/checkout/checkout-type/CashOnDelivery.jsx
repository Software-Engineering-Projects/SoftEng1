import { CheckCircle, ClipboardCopyIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getOrderById } from '@/api/order';

import { FaCheckCircle } from "react-icons/fa";

export const CashOnDelivery = () => {
  const [isCopied, setCopied] = useState(false);

  const [orderLink, setOrderLink] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  // TODO:
  const orderId = "FfH7aNw3wOWoXwrlLdpp"; // This should be dynamic based on your application's state or props

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOrderById(orderId);
        const orderTrackerUrl = result.orderTrackerUrl;
        const orderStatus = result.status;
        const orderTotalPrice = result.totalPrice;
        setOrderLink(orderTrackerUrl);
        setOrderStatus(orderStatus);
        setOrderTotalPrice(orderTotalPrice);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };

    fetchOrder();
  }, [orderId]);


  const onCopy = () => {
    navigator.clipboard.writeText(orderLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  // TODO: Update the styles a bit more
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] ">
      <div className="flex flex-col items-center justify-center space-y-4 p-12">
        <FaCheckCircle className="text-green-500 w-20 h-20 mb-4" />
        <p className="text-3xl">
          Make sure to have ${orderTotalPrice} ready for your order.
        </p>
        <div className="flex flex-col items-center justify-center pt-2">
          <p className="font-bold text-2xl">
            Order Tracker URL
          </p>
          <button
            onClick={onCopy}
            disabled={isCopied}
            className="flex items-center justify-center px-4 py-2 text-black font-bold rounded-lg shadow-lg bg-gray-100space-x-2 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-green-200"
            title={isCopied ? "Copied!" : "Click to copy your Order ID"}
          >
            {isCopied ? (
              <div className='flex items-center'>
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
        <div className="bg-gray-100 p-3 rounded-md shadow-md text-center">
          <p className="text-lg font-semibold text-blue-600">
            Order Status: {orderStatus.toUpperCase()}
          </p>
        </div>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
            Continue Shopping
          </button>
          {/* TODO: */}
          <button className="px-10 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50">
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  )
}
