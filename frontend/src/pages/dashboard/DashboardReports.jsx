import React, { useState } from 'react';
import { getOrderStatus } from '@/api/index.js';
import { ToggleButton, PieChartReport } from '@/global-components/dashboard/dashboard-report/dashboard-report-index.js';

export const DashboardReports = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [data, setData] = useState([]);

  const handleClick = async () => {
    const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    const results = [];
  
    for (let status of statuses) {
      try {
        const result = await getOrderStatus(status);
        if (result) {
          results.push({ name: status, value: result.length });
        } else {
          console.error(`No data returned for status ${status}`);
        }
      } catch (error) {
        console.error(`Error fetching order status for ${status}:`, error);
      }
    }

    setData(results);
    setButtonClicked(true);
  }

  return (
    <div>
      <div><h1 style={{ fontSize: '20px' }}><b>Order Status Report</b></h1>
        <div>
          <ToggleButton onClick={handleClick}>Generate</ToggleButton>
            <div>
              {buttonClicked && (
                <PieChartReport data={data} />
              )}
            </div>
        </div>
      </div>
    </div>
  );
}