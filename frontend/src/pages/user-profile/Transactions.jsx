import React from 'react';
import { Coffee, Gift, Pizza, Wallet } from 'lucide-react';

// TODO: It might be hard to map over all types of icons and return the correct one as there might be some custom foods,etc not including within the cuisine types placeholders for now
const getIcon = (type) => {
  switch (type) {
    case 'wallet':
      return <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    case 'coffee':
      return <Coffee className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    case 'pizza':
      return <Pizza className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    case 'gift':
      return <Gift className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    default:
      return null;
  }
};

// TODO: Fetch the transactions data from the backend, create an API endpoint for it
const transactionsData = [
  {
    date: 'Nov 9, 2023',
    transactions: [
      {
        type: 'wallet',
        title: 'Restaurant Bill Payment',
        category: 'Customer',
        details: 'Restaurant: Happy Diner, Meal: Dinner',
        amount: -45,
      },
      {
        type: 'coffee',
        title: 'Coffee Shop Payment',
        category: 'Customer',
        details: 'Shop: Morning Brew, Item: Latte, Quantity: 2',
        amount: -10,
      },
    ],
  },
  {
    date: 'Nov 8, 2023',
    transactions: [
      {
        type: 'pizza',
        title: 'Pizza Delivery Payment',
        category: 'Customer',
        details: 'Pizzeria: Bella Napoli, Pizza: Margherita, Quantity: 1',
        amount: -20,
      },
      {
        type: 'gift',
        title: 'Gift Card Purchase',
        category: 'Customer',
        details: 'Restaurant: Happy Diner, Card Value: $50',
        amount: 50,
      },
      {
        type: 'gift',
        title: 'E-Wallet TopUp',
        category: 'Customer',
        details: 'Restaurant: Happy Diner, Card Value: $50',
        amount: 25,
      },
    ],
  },
];

export const Transactions = () => {
  return (
    <div className="flex flex-col space-y-4 p-12">
      {transactionsData.map((day, index) => (
        <div key={index}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {day.date}
          </h2>
          {day.transactions.map((transaction, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-slate-200 mt-4 shadow-md"
            >
              <div className="flex items-center space-x-6">
                {getIcon(transaction.type)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 border-b">
                    {transaction.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.details}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
              >
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

