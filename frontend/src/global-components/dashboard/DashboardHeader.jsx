// TODO: Setup the admin role
// TODO: Add the admin user profile
import React from 'react';

import { useLocation, useNavigate } from "react-router-dom";
import { NotificationBell } from "./NotificationBell";
import { PiSignOutBold } from "react-icons/pi";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Badge } from "flowbite-react";
import { Lock } from "lucide-react";

export const DashboardHeader = () => {
  // Getting the current route path last sub route
  const navigate = useNavigate();
  const auth = getAuth();

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const properCaseRouteLastWord =
    lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  return (
    <div className="flex flex-wrap justify-between">
      <div className="font-bold text-2xl">{properCaseRouteLastWord} Page</div>

      <div className="flex flex-col items-center">
        <div className="flex ">
          <NotificationBell />
          <div>
            <Badge
              color="green"
              icon={Lock}
              className="items-center justify-center"
            >
              <p>Admin</p>
            </Badge>
          </div>
        </div>

        <button
          onClick={() => {
            auth
              .signOut()
              .then(() => {
                console.log("User signed out");
                navigate("/login", { replace: true });
                toast("Bye for now", {
                  icon: "👋",
                });
              })
              .catch((error) => {
                console.error("Error signing out: ", error);
                toast.error("Something went wrong");
              });
          }}
          className="ml-10 flex item-center opacity-80 justify-center text-gray-900 rounded-lg border-spacing-2 dark:text-white p-2 hover:text-red-600"
        >
          <div className="flex items-center justify-center">
            <PiSignOutBold className="w-4 h-4" />
            <span className="px-1">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

