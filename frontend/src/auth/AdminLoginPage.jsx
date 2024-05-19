import React, { useState } from 'react';
import { LoginBG, Logo } from '../../public/images/public-images-index.js';
import { app } from '../config/firebase.config.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setUserDetails, setUserName } from '@/context/actions/userActions.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { NavLink } from 'react-router-dom';
// TODO: Import the API for fetching the role of the current user

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      // TODO: Await the response from the API Role fetch endpoint
      // TODO: Chain the admin role check here
      if (user) {
        dispatch(setUserDetails(user));
        dispatch(setUserName(user.displayName));
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
      // TODO: Add error.code object switch case checks to provide a more descriptive and cleaner toast error response 
    } catch (error) {
      toast.error(error.message);
    }
  };

return (
  <div className="flex items-center justify-center h-screen bg-gray-200">
    <form className="p-6 bg-white rounded shadow-md" onSubmit={handleLogin}>
      <h1 className="mb-6 text-3xl font-bold text-center">Admin Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-6 text-black border-b-2 border-blue-500 outline-none focus:bg-gray-300"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-6 text-black border-b-2 border-blue-500 outline-none focus:bg-gray-300"
        required
      />
      {/* FIXME: This button is disabled because of the disabled attribute always being false */}
      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  </div>
);
}
