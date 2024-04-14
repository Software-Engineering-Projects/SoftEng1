import React from 'react';
import { defaultUser } from '../../../public/images/public-images-index'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table';
import { Home, Pencil, Phone } from 'lucide-react';

const ProfileSection = ({ title, value, icon, editButtonLabel }) => (
  <div className="flex items-center justify-between space-x-4">
    <div className="text-lg font-medium">{title}</div>
    <div className="flex items-center space-x-2">
      {icon}
      <Button variant="link">{editButtonLabel}</Button>
    </div>
  </div>
);

export const UserProfile = () => {
  // TODO: Hardcoded data fetch these data from the backend once the api endpoints are made
  const profileData = {
    username: 'Current',
    phoneNumber: 'Phone Number',
    // addressBook: 'Address Book',
  };

  const walletBalance = '$124.56';

  const recentOrders = [
    { orderId: '123456', date: 'Nov 1, 2023', total: '$50.00' },
    { orderId: '123457', date: 'Oct 31, 2023', total: '$75.00' },
    { orderId: '123458', date: 'Oct 30, 2023', total: '$100.00' },
  ];

  // TODO: Fix the naming of the variables

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    alt="User avatar"
                    src={defaultUser}
                  />
                  <AvatarFallback>UP</AvatarFallback>
                </Avatar>
                <Button variant="outline">Upload Photo</Button>
              </div>
              <ProfileSection
                title={profileData.username}
                icon={<Pencil className="h-5 w-5 text-gray-500 dark:text-gray-300" />}
                editButtonLabel="Edit"
              />
              <ProfileSection
                title={profileData.phoneNumber}
                value={profileData.phoneNumber}
                icon={<Phone className="h-5 w-5 text-gray-500 dark:text-gray-300" />}
                editButtonLabel="Edit"
              />
              <ProfileSection
                title="Address Book"
                // value={profileData.addressBook}
                icon={<Home className="h-5 w-5 text-gray-500 dark:text-gray-300" />}
                editButtonLabel="Edit"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletBalance}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

