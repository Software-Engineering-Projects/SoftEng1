// TODO:
import { IoSettingsOutline } from 'react-icons/io5';
import { RxDashboard, RxHamburgerMenu } from 'react-icons/rx';
import React, { useState, useEffect } from 'react';
import {
  PackageSearch,
  ShoppingBag,
  Store,
  Users,
  AreaChart,
  Home,
  ArrowBigLeft,
  LogIn,
  ShieldX,
} from 'lucide-react';
import { DashboardHeader } from '@/global-components/dashboard/dashboard-component-index.js';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCount } from '@/api/index.js';
import { setUserCount } from '@/context/actions/userCountAction';
import { Logo } from '@/public/images/public-images-index';
import { NavLink } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app } from '@/config/firebase.config';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'flowbite-react';
import { Outlet } from 'react-router-dom';

export const MainDashboard = () => {
  // TODO: Add check on whether the current user is an admin or not
  // TODO: Orders, Products, Restaurants, Reports, Settings Create the functionality for each of these pages
  // TODO: The main dashboard content should be dependent on the restaurant, since this dashboard is for the restaurant owner but you should be able to switch between restaurants seamlessly
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  // TODO: set modal state to false when not testing
  // NOTE: To being redirected to the login page, set the state below to false
  const [openModal, setOpenModal] = useState(true);
  const dispatch = useDispatch();

  const roleType = useSelector((state) => state.roleType);
  const userCount = useSelector((state) => state.userCount);

  console.log('roleType:', roleType);
  const [redirectCounter, setRedirectCounter] = useState(5);
  const user = useSelector((state) => state.user);

  // REMOVING THIS NOW FOR TESTING PURPOSES
  // NOTE: Set roletype to 'user' to avoid redirection
  useEffect(() => {
    const checkUserRole = async () => {
      if (user && roleType !== 'admin') {
        setOpenModal(true);
        setIsLoading(true);
      } else {
        setOpenModal(false);
      }
      setIsLoading(false);
    };
    checkUserRole();
  }, [user, roleType]);

  useEffect(() => {
    if (redirectCounter > 0) {
      const timerId = setInterval(() => {
        setRedirectCounter((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (redirectCounter === 0) {
      if (openModal) {
        navigate('/', { replace: true });
      }
    }
  }, [redirectCounter, navigate, openModal]);


  useEffect(() => {
    getUserCount().then((userCount) => {
      dispatch(setUserCount(userCount));
    });
  }, [dispatch]);

  // Size of the screen when the hamburger menu should be toggled
  const screenSizeToggled = 767;
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > screenSizeToggled,
  );

  // FIXME: Weird visual bug when clicking on a link while the page is loading
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > screenSizeToggled);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // TODO: Create the reusable component for the navbars to make it more reusable
  const getNavLinkStyle = (isActive) => {
    const baseStyle = "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700 group opacity-80 hover:opacity-100";
    const activeStyle = "text-red-500 opacity-100";
    return `${baseStyle} ${isActive ? activeStyle : ''}`;
  };

  const badgeStyle = "inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300";

  return (
    <div>
      {/* TODO: Set to true when not testing */}
      {/* Remove ! from openModal if not in testing */}
      {(user === null || roleType !== 'admin') && (
        <Modal show={openModal} className="backdrop-blur backdrop-filter-blur-sm">
          <Modal.Body>
            <div className="space-y-6">
              <ShieldX className="w-24 h-24 mx-auto text-red-600" />
              <h1 className="flex items-center justify-center font-semibold text-red-600 text-3xl">
                Unauthorized Access
              </h1>
              <p className="flex items-center justify-center font-semibold">
                You must be an ADMIN to access the dashboard
              </p>
              <div className='flex flex-col items-center justify-center font-semibold'>
                <p>Redirecting in <span className='text-red-600 '>{redirectCounter}</span> seconds...</p>
              </div>
            </div>
          </Modal.Body>
          <div className="flex flex-col items-center justify-center w-full">
            <Modal.Footer>
              <Button
                onClick={() => {
                  setOpenModal(false);
                  const currentRoute = window.location.pathname;
                  navigate(`/login?redirectTo=${currentRoute}`, {
                    replace: true,
                  });
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>

              <Button
                color="gray"
                className="hover:bg-blue-400"
                onClick={() => {
                  setOpenModal(false);
                  navigate('/', { replace: true });
                }}
              >
                <ArrowBigLeft className="w-6 h-6" />
                Home
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <RxHamburgerMenu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <aside
          onMouseLeave={() => {
            if (window.innerWidth <= screenSizeToggled) {
              setIsSidebarOpen(false);
            }
          }}
          className={`fixed top-0 left-0 z-40 w-64 h-screen  transition-transform ${isSidebarOpen ? 'translate-x-0 ' : '-translate-x-full'
            } sm:translate-x-0 `}
          aria-label="Sidebar"
        >
          {/* Not using the Navlink because this must have a full reload*/}
          <div className="h-full bg-slate-50 px-3 py-4 overflow-y-auto  dark:bg-gray-800 ">
            <ul className="space-y-2 font-medium ">
              <NavLink
                to="/"
                className="flex justify-center items-center transition duration-300 ease-in-out transform hover:scale-110"
              >
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-12 h-12"
                />
              </NavLink>

              <li>
                <NavLink
                  to="/dashboard"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard')}
                >
                  <RxDashboard className="w-6 h-6" />
                  <span className="ml-3">Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/orders"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/orders')}
                >
                  <PackageSearch className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">Orders</span>
                  <span className={badgeStyle}>
                    23 Fake
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/users"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/users')}
                >
                  <Users className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                  <span className={badgeStyle}>

                    {userCount}
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/products"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/products')}
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Products
                  </span>
                  <span className={badgeStyle}>

                    34 Fake
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/restaurants"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/restaurants')}
                >
                  <Store className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Restaurants
                  </span>
                  <span className={badgeStyle}>

                    12 Fake
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/reports"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/reports')}
                >
                  <AreaChart className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings"
                  className={getNavLinkStyle(window.location.pathname === '/dashboard/settings')}
                >
                  <IoSettingsOutline className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Settings
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* Grid Layout */}
      <div className="px-4 pt-4 md:ml-64">
        <DashboardHeader />
        <div className="p-4 rounded-lg">
          {/* This Outlet will render the matched child route component */}
          <Outlet />
        </div>
      </div>
      {/* | above Grid Layout */}
    </div>
  );
};

