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

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      if (user) {
        dispatch(setUserDetails(user));
        dispatch(setUserName(user.displayName));
        toast.success('Logged in successfully');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={!isFormValid}>Sign In</button>
      </form>
    </div>
  );
};