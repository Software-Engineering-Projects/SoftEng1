import React, { useState } from 'react';
import { LoginBG, Logo } from '@/public/images/public-images-index.js';
import { app } from '../config/firebase.config.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setUserDetails, setUserName } from '@/context/actions/userActions.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { fetchRole } from '@/api/user.js';

export const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      const role = await fetchRole(user.uid);
      if (user && role === 'user') {
        dispatch(setUserDetails(user));
        dispatch(setUserName(user.displayName));
        navigate('/dashboard');
        setTimeout(() => {
          toast.success('Logged in successfully');
        }, 2000);
      } else {
        toast.error('You are not an admin');
      }
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

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form className="p-6 bg-white rounded shadow-md" onSubmit={handleLogin}>
        <h1 className="mb-6 text-3xl font-bold text-center mr-4">
          <img src={Logo} alt="Logo" className="w-12 h-12 inline-block mr-4" />
          Admin Login
        </h1>
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
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-700}`}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}