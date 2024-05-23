import React, { useState, useEffect } from 'react';
import { getOrderStatus } from '@/api/index.js';
import { PieChartReport } from '@/global-components/dashboard/dashboard-report/dashboard-report-index.js';

export const DashboardReports = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchOrderStatus = async () => {
      const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
      const results = [];

      try {
        setIsLoading(true)
        const response = await getOrderStatus(statuses);
        if (response && response.orders) {
          for (let status of statuses) {
            results.push({ name: status, value: response.orders[status] });
          }
          setData(results);
        } else {
          console.error(`No data returned from getOrderStatus`);
        }
        setIsLoading(false)

      } catch (error) {
        console.error(`Error fetching order statuses:`, error);
        setIsLoading(false)
      }
    };

    fetchOrderStatus();
  }, []);

  return (
    <div className="p-8 mx-auto">
      <h1 className='text-3xl font-bold mb-6'>Order Status Report</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          {isLoading && <p>Loading Results...</p>}
          {!isLoading && <PieChartReport data={data} />}
        </div>
      </div>
    </div>
  );
}
