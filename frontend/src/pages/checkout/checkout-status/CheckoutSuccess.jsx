import React, { useState, useEffect } from 'react';
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from 'react-confetti';
import { FaCircleCheck } from "react-icons/fa6";

// TODO: Create a checkbox success component, that will display a progress bar of the current order example the initial state is pending -> confirmed, shipped, delivered, and a message that the order has been successfully placed.
// TODO: Destructure more of the appropriate order details

export const CheckoutSuccess = () => {
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        gravity={0.5}
        recycle={false}
      />
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center justify-center space-y-4 p-12">
          <FaCircleCheck className="text-green-500 w-20 h-20 mb-4" />
          <p className="text-3xl">
            Thank you for your order!
          </p>
          <p className="bg-gray-100 rounded-full ">
            Your Order ID is : TODO:
          </p>
          <div className="">
            Order Status : TODO:
            {/* <OrderStatusTimeline /> */}
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button className="px-4 py-2 bg-blue-400">
              Continue Shopping
            </button>
            <button className="px-10 py-2 bg-blue-400">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

