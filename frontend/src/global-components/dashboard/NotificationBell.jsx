import { BiBell } from "react-icons/bi";
import React from 'react';

export const NotificationBell = () => {
  return (
    <div>
      <button
        id="dropdownNotificationButton"
        data-dropdown-toggle="dropdownNotification"
        className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400 w-full right-0 sm:right-auto sm:left-0 ml-auto"
        type="button"
      >
        <BiBell className="w-6 h-6 transform transition-transform duration-200 hover:scale-110 text-gray-500 dark:text-gray-700 hover:text-gray-700 dark:hover:text-gray-800" />
        <div className="relative flex">
          <div className="relative inline-flex w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-2 right-3 dark:border-gray-900"></div>
        </div>
      </button>
    </div>
  );
};
