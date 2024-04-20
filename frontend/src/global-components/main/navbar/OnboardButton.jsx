import React from 'react';

import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";
export const OnboardButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-3 pr-4 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
        onClick={() => {
          navigate("/login", { replace: true });
        }}
      >
        <TbLogin2 className="w-5 h-5 mr-2 shrink-0 " />
        <span className="flex-shrink-0">Sign In</span>
      </button>
    </>
  );
}
