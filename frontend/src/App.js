import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { app } from "./config/firebase.config.js";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setUserDetails, setUserNull } from "./context/actions/userActions";
import { GlobalAlert } from "./containers/components/main/GlobalAlert.jsx";
import { Loader } from "./components/Loader.jsx";
import AllRoutes from "./routes.js";
import { NotFoundPage } from "./components/NotFoundPage.jsx";

const App = () => {
  const firebaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = React.useState(false);
  // TODO: Remove abundant css classes from .js and .jsx files, components should be separate to make it easier to read and understand each components and to also allow for setting reusable components
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    setIsLoading(true);
    // Checking the global store for the user details, if none setting user details to null
    const sessionExpire = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserDetails(user));
      } else {
        dispatch(setUserNull());
      }

      setIsLoading(false);
    });

    return () => sessionExpire();
  }, [dispatch, firebaseAuth, navigate]);

  // FIXME: Properly setup the 404 route since putting sub routes might mess with it
  return (
    // To make the animations pause if the page is still loading but excluding the loader from the animation pause
    <div className={isLoading ? "animation-paused" : "animation-running"}>
      {isLoading && <Loader />}
      <div className="animate-children">
        <Toaster />
        <Routes>
          {/* TODO: This is set to use a wildcard in order to make sub routes work but this makes the 404 page not work correctly */}
          <Route path="/*" element={<AllRoutes />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
        {!isLoading && alert?.type && (
          <GlobalAlert type={alert.type} message={alert.type} />
        )}
      </div>
    </div>
  );
};

export default App;
