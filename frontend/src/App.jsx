import React, { useEffect, useState, useCallback } from "react";
import './index.css'
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { app } from "./config/firebase.config.js";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "./context/actions/userActions.js";
import { Loader } from "@/global-components/global-component-index.js";
import AllRoutes from "./routes.jsx";
import { setRoleType, setRoleNull } from "./context/actions/userRoleAction";
import { getAllProducts, getUserRole } from "./api/index.js";
import { getProducts } from "./context/actions/productAction.js";
import { getUserCart } from "./api/cart.js";
import { setCartItems } from "./context/actions/cartAction.js";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);
  const user = useSelector((state) => state.user);
  const productsList = useSelector((state) => state.product)
  const firebaseAuth = getAuth();

  const addLoading = () => {
    setLoadingCount((count) => count + 1);
    setIsLoading(true);
  };
  const removeLoading = () => {
    setLoadingCount((count) => {
      if (count <= 1) setIsLoading(false);
      return Math.max(0, count - 1);
    });
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        addLoading();
        try {
          const fetchedRole = await getUserRole(user.uid);
          setRole(fetchedRole);
        } catch (error) {
          console.error('Failed to fetch role:', error);
        } finally {
          removeLoading();
        }
      }
    };
    fetchRole();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
      addLoading();
      if (authUser) {
        dispatch(setUserDetails(authUser));
        dispatch(setRoleType(role));
      } else {
        dispatch(setRoleNull());
      }
      removeLoading();
      return () => unsubscribe();
    });
  }, [dispatch, firebaseAuth, navigate, role]);

  useEffect(() => {
    const fetchProductsList = async () => {
      if (productsList.products.length === 0) {
        addLoading();
        try {
          const fetchedProductsList = await getAllProducts();
          if (fetchedProductsList) {
            dispatch(getProducts(fetchedProductsList));
          }
        } catch (error) {
          console.error('Failed to fetch products:', error);
        } finally {
          removeLoading();
        }
      }
    };
    fetchProductsList();
  }, [dispatch, productsList.products.length]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        addLoading();
        try {
          const fetchedCart = await getUserCart(user.uid);
          dispatch(setCartItems(fetchedCart.data));
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          removeLoading();
        }
      }
    };
    fetchCart();
  }, [user, dispatch]);

  const showLoader = isLoading && loadingCount > 0;

  return (
    <div>
      {showLoader ? <Loader /> : (
        <>
          <Toaster />
          <Routes>
            <Route path="/*" element={<AllRoutes />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
