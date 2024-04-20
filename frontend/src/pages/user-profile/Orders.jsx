import React from 'react';

// TODO: Add the orders from the backend
// TODO: The user should be able to view the order details
export const Orders = () => {
  const orderSummary = [
    { title: 'Total Orders', count: 3 },
    { title: 'Completed Orders', count: 1 },
    { title: 'Refunded Orders', count: 1 },
    { title: 'Cancelled Orders', count: 1 },
  ];

  return (
    <div className="mt-8 p-12">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="grid gap-6">
        {orderSummary.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm font-bold">{item.title}</p>
            <p className="text-2xl">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
