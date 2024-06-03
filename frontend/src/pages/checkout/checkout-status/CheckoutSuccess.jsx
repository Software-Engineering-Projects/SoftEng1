import React, { useState, useEffect } from 'react';
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from 'react-confetti';
import { NavLink, useParams } from 'react-router-dom';

import { FaCheckCircle } from "react-icons/fa";

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
        <div className="flex flex-col items-center justify-center space-y-4 p-12 bg-white rounded-lg shadow-lg">
          <FaCheckCircle className="text-green-500 w-20 h-20 mb-4" />
          <p className="text-3xl font-semibold text-gray-800">
            Your order has been placed successfully.
          </p>
          <p className="text-xl text-gray-600">
            Thank you for choosing our service!
          </p>
          {/* TODO: Based on the most recent order that is just made, share the state of that order id */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <NavLink to="/checkout/order-tracker">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                Track Order
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

