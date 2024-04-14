import React, { useEffect, useState } from "react";
import './index.css'
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { app } from "./config/firebase.config.js";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setUserDetails, setUserNull } from "./context/actions/userActions.js";
import { Loader } from "@/global-components/global-component-index.js";
import AllRoutes from "./routes.jsx";
import { setRoleType, setRoleNull } from "./context/actions/userRoleAction";
import { getUserRole } from "./api/index.js";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firebaseAuth = getAuth();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const fetchedRole = await getUserRole(user.uid);
        console.log(user.uid);
        setRole(fetchedRole);
      }
    };
    fetchRole();
  }, [user]);

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
      if (authUser) {
        dispatch(setUserDetails(authUser));
        dispatch(setRoleType(role));
      } else {
        dispatch(setRoleNull());
        // navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, firebaseAuth, navigate, role]);

  return (
    <div>
      {isLoading && <Loader />}
      <Toaster />
      <Routes>
        <Route path="/*" element={<AllRoutes />} />
      </Routes>
    </div>
  );
};

export default App;
