// import React from 'react';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { PieChart, Pie, Cell } from 'recharts';
// import { getUserList } from '../../../../api';
// import { setUserListDetails } from '../../../../context/actions/userListAction';
// import { useDispatch } from 'react-redux';
// export const DashboardOverview = () => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false);

// // TODO: Fix the user role
//   // const userList = useSelector((state) => state.userList);
//   const userCount = userList.length;
//   const verifiedEmailCount = userList.filter(user => user.emailVerified).length;

//   useEffect(() => {
//     setIsLoading(true);
//     if (!userList) {
//       getUserList()
//         .then((data) => {
//           dispatch(setUserListDetails(data));
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching user list: ', error);
//           setIsLoading(false);
//         });
//     }
//   }, [dispatch, userList]);

//   const data = [
//     { name: "Group A", value: 100 },
//     { name: "Group B", value: 300 },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   const RADIAN = Math.PI / 180;
//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//     index
//   }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="white"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <PieChart width={400} height={400}>
//       <Pie
//         data={data}
//         cx={200}
//         cy={200}
//         labelLine={false}
//         label={renderCustomizedLabel}
//         outerRadius={80}
//         fill="#8884d8"
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// }

export const DashboardOverview = () => {
  return (
    <div>Dashboard Overview</div>
  )

}