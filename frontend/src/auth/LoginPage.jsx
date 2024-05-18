import React, { useState, useEffect } from 'react';
import { LoginBG, Logo } from '@/public/images/public-images-index.js';
import { app } from '@/config/firebase.config.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setUserDetails, setUserName } from '@/context/actions/userActions.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { createCart } from '@/api/cart.js';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showRegisterPasswordRequirements, setRegisterPasswordRequirements] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // TODO: Default should be user
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const handleConfirmPasswordRegisterChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);

    const isValid = validatePasswordFields(
      registerPassword,
      newConfirmPassword,
    );
    setIsFormValid(isValid);
  };

  const validatePasswordFields = (password, confirmPassword) => {
    return (
      password.length >= 6 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password) &&
      password === confirmPassword
    );
  };

  const signUpWithEmailPass = async () => {
    setEmail('');
    setRegisterPassword('');
    setUsername('');
    setConfirmPassword('');

    try {
      const userCred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        registerPassword,
      );
      const userDetails = { ...userCred.user, displayName: username };
      await updateProfile(userCred.user, {
        displayName: username,
      });
      dispatch(setUserDetails(userDetails));
      dispatch(setUserName(username));
      // TODO: After confirming the email the user should be redirected to the login page
      // TODO: Create a verification page for the user to verify their email | maybe also setup a resend email verification?

      // Added timeout so the toast notifications dont stack
      setTimeout(() => {
        sendEmailVerification(firebaseAuth.currentUser).then(() => {
          toast('Email Sent!', {
            icon: '✉️',
          });
        });
      }, 2000);
      // NOTE: Upon registering this will create a cart for the user
      await createCart(userDetails.uid)
        .then(() => {
          console.log('Cart created');
          navigate('/login', { replace: true });
          toast.success('Account created successfully');
        });
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Email already exists');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format');
          break;
        default:
          toast.error('Something went wrong');
          break;
      }
    }
  };

  // TODO: Add a redirect, checking what the previous path was then redirecting the user after successful login
  const signInWithEmailPass = async () => {
    setEmail('');
    setLoginPassword('');
    try {
      const userCred = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        loginPassword,
      );

      const userDetails = userCred.user;
      dispatch(setUserDetails(userDetails));
      if (userDetails.emailVerified) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirectTo');

        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        toast.error('Email not verified');
      }
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-login-credentials':
          toast.error('Invalid credentials');
          break;
        case 'auth/user-disabled':
          toast.error('User disabled');
          break;
        default:
          toast.error('Something went wrong');
          break;
      }
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isLogin) {
      setEmail('');
      setLoginPassword('');
      signInWithEmailPass(event);
    } else {
      setEmail('');
      setRegisterPassword('');
      setUsername('');
      setConfirmPassword('');
      setIsPasswordVisible(false);
      setRegisterPasswordRequirements(false);
      signUpWithEmailPass(event);
    }
  };

  const toggleForm = () => {
    // To prevent the bug from when switching between states the form submits the form without the button being clicked we need to set the states to null between state changes
    setEmail('');
    setLoginPassword('');
    setRegisterPassword('');
    setUsername('');
    setConfirmPassword('');
    setRegisterPasswordRequirements(false);
    setIsPasswordVisible(false);
    setIsLogin(!isLogin);
  };

  // TODO: Setup routes
  // TODO: Try and setup components here to be reusable components NOTE: since these components takes props and states it might be harder to implement these
  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center">
      <img
        src={LoginBG}
        alt=""
        className="w-full h-full object-cover absolute inset-0 z-0"
      />
      <section className="z-10 items-center flex-shrink-0">
        <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto min-h-screen lg:py-0">
          <div className="w-full bg-white p-6 rounded-lg shadow dark:border max-w-md dark:bg-gray-800 dark:border-gray-700 border-b-4 border-t-4  border-rose-500 hover:border-animate">
            <div className="flex flex-col items-center justify-center  p-2 space-y-4">
              <NavLink
                to="/login"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
              >
                <img className="w-12 h-12 mr-2" src={Logo} alt="logo" />
                Ordering System
              </NavLink>
              <h1 className="font-bold leading-tight tracking-tight text-gray-900 text-xl dark:text-white">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </h1>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    id="password"
                    onKeyDown={() => {
                      if (!isLogin) {
                        setRegisterPasswordRequirements(true);
                      }
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                    value={isLogin ? loginPassword : registerPassword}
                    onChange={(e) =>
                      isLogin
                        ? setLoginPassword(e.target.value)
                        : setRegisterPassword(e.target.value)
                    }
                    required
                  />

                  <label className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 transform translate-y-1/2 mt-1.5">
                    <input
                      id="showPassword"
                      name="showPassword"
                      type="checkbox"
                      className="sr-only peer"
                      checked={isPasswordVisible}
                      onChange={() => {
                        setIsPasswordVisible(!isPasswordVisible);
                        if (isLogin) {
                          setIsConfirmPasswordVisible(!isPasswordVisible);
                        } else {
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                        }
                      }}
                    />
                    <span className="w-11 h-6 mb-10 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </span>
                  </label>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      id="confirmPassword"
                      onKeyDown={() => setRegisterPasswordRequirements(true)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordRegisterChange}
                      required
                    />

                    {registerPassword !== confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        ❌Passwords do not match
                      </p>
                    )}
                    {/* TODO: This can probably be set in another file to allow for better readability */}
                    {showRegisterPasswordRequirements && (
                      <>
                        <div className="space-y-2">
                          <p
                            className={`text-sm mt-1 transition-all duration-1000 ease-out ${registerPassword.length >= 6
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {registerPassword.length >= 6 ? '✅' : '❌'}{' '}
                            Password must be at least 6 characters
                          </p>

                          <p
                            className={`text-sm mt-1 transition-all duration-1000 ease-out ${/\d/.test(registerPassword)
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {/\d/.test(registerPassword) ? '✅' : '❌'} Include
                            at least one number
                          </p>

                          <p
                            className={`text-sm mt-1 transition-all duration-1000 ease-out ${/[A-Z]/.test(registerPassword)
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {/[A-Z]/.test(registerPassword) ? '✅' : '❌'}{' '}
                            Include at least one uppercase character
                          </p>

                          <p
                            className={`text-sm mt-1 transition-all duration-1000 ease-out ${/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(
                              registerPassword,
                            )
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(
                              registerPassword,
                            )
                              ? '✅'
                              : '❌'}{' '}
                            Include at least one special character
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLogin
                    ? email && loginPassword
                      ? 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      : 'bg-primary-300 cursor-not-allowed opacity-50'
                    : isFormValid
                      ? 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      : 'bg-primary-300 cursor-not-allowed opacity-50'
                    }`}
                  disabled={isLogin ? !(email && loginPassword) : !isFormValid}
                  title={
                    isLogin
                      ? email && loginPassword
                        ? ''
                        : 'Please enter your email and password'
                      : isFormValid
                        ? ''
                        : 'Please follow the registration requirements'
                  }
                >
                  {isLogin ? 'Sign in' : 'Create an account'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 items-center justify-center flex flex-col">
                  {isLogin
                    ? "Don't have an account yet?"
                    : 'Already have an account?'}
                  <button
                    onClick={toggleForm}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 p-2"
                  >
                    {isLogin ? ' Sign up' : ' Sign in'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
