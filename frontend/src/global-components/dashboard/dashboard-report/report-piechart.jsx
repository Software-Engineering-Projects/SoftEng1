import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Label } from 'recharts';

const COLORS = ['#00215E', '#FFC100', '#FC4100', '#C40C0C', '#8DECB4'];

// This function is used to render the labels for each sector in the pie chart
const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; 
    // Calculate the x and y coordinates for the labels
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);
  
    // Don't display the percentage for zero values
    if (percent === 0) {
      return;
    }
  
    // Render the label for each sector
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // This component renders a pie chart with customized labels
  export const PieChartReport = ({ data }) => (
    <PieChart width={1500} height={800}>
      <Pie
        data={data}
        cx={1600 / 2}
        cy={400  / 2}
        innerRadius={120}
        outerRadius={160}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        labelLine={false}
        label={renderCustomizedLabel}
        minAngle={3} // Add a minimum angle to each sector
      >
        {data.map((entry, index) => (
          // Render a cell for each data entry
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
