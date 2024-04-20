import React from 'react';
import { Badge } from 'flowbite-react';
import { CreditCardIcon, BanknotesIcon, WalletIcon } from "@heroicons/react/24/solid";
import { FaApple, FaBitcoin, FaCcDiscover, FaCcPaypal, FaGoogleWallet, FaLandmark, FaWallet, FaGooglePay } from "react-icons/fa6";

import { SiAmericanexpress } from "react-icons/si";
import { BiDollar, BiDollarCircle } from 'react-icons/bi';
import { TbMapDollar } from 'react-icons/tb';
import { CircleDollarSign } from 'lucide-react';
export const OrderHistory = () => {
  const orderHistory = [
    { orderNumber: '1234', date: 'March 1, 2023', paymentMethod: 'Visa', status: 'Complete' },
    { orderNumber: '1235', date: 'March 5, 2023', paymentMethod: 'Apple Pay', status: 'Refunded' },
    { orderNumber: '1236', date: 'March 10, 2023', paymentMethod: 'Cash on Delivery', status: 'Cancelled' },
  ];

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-500 text-white';
      case 'Refunded':
        return 'bg-yellow-300 text-black';
      case 'Cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // const getPaymentIcon = (method) => {
  //   switch (method) {
  //     case 'Visa':
  //     case 'Mastercard':
  //       return <CreditCardIcon className="h-5 w-5 text-gray-700" />;
  //     case 'Paypal':
  //       return <FaCcPaypal className="h-5 w-5 text-blue-700" />;
  //     case 'American Express':
  //       return <SiAmericanexpress className="h-5 w-5 text-blue-600" />;
  //     case 'Discover':
  //       return <FaCcDiscover className="h-5 w-5 text-blue-500" />;
  //     case 'Apple Pay':
  //       return <FaApple className="h-5 w-5 text-gray-800" />;
  //     case 'Google Pay':
  //       return <FaGooglePay className="h-5 w-5 text-gray-700" />;
  //     case 'Bitcoin':
  //       return <FaBitcoin className="h-5 w-5 text-amber-400" />;
  //     case 'Bank':
  //       return <FaLandmark className="h-5 w-5 text-gray-700" />;
  //     case 'In App Wallet':
  //       return <FaWallet className="h-5 w-5 text-emerald-500" />;
  //     default:
  //       return <CircleDollarSign className="text-green-700 h-5 w-5" />;
  //   }
  // };


  return (
    <div className="w-full px-6 py-8">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <div className="grid gap-6">
        {orderHistory.map((order, index) => (
          <div key={index} className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
            <div>
              <p className="text-lg font-bold">Order #{order.orderNumber}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-400">{order.date}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-400">Payment Method:  {order.paymentMethod}

                {/* {getPaymentIcon(order.paymentMethod)} */}

              </p>
            </div>
            <Badge className={`text-sm ${getBadgeColor(order.status)}`}>{order.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
