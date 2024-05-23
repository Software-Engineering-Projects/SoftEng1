import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

// This function is used to render the labels for each sector in the pie chart
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  // Calculate the x and y coordinates for the labels
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Don't display the percentage for zero values
  if (percent === 0) {
    return;
  }

  // Render the label for each sector
  return (
    <text x={x} y={y} fill="#555" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// This component renders a pie chart with customized labels
export const PieChartReport = ({ data }) => (
  <PieChart width={500} height={350}>
    <Pie
      data={data}
      cx={250}
      cy={150}
      innerRadius={100}
      outerRadius={140}
      fill="#8884d8"
      paddingAngle={5}
      dataKey="value"
      labelLine={false}
      label={renderCustomizedLabel}
      minAngle={3} // Add a minimum angle to each sector
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend align="center" verticalAlign="bottom" layout="horizontal" />
  </PieChart>
);
