import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      nav('/profile');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="w-full max-w-sm">
        <form 
            onSubmit={submit} 
            className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 transform hover:shadow-3xl"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome Back 👋
                </h2>
                <p className="text-sm text-gray-500 mt-1">Sign in to your account.</p>
            </div>

           
            {msg && (
                <div className="text-center text-sm font-medium p-3 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                    {msg}
                </div>
            )}

            <div className="space-y-5">
                
                <div>
                    <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input 
                        id="user-email"
                        required 
                        placeholder="yourname@example.com" 
                        value={form.email} 
                        onChange={e => setForm({...form, email:e.target.value})} 
                       
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                                   focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 text-base" 
                    />
                </div>

                
                <div>
                    <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input 
                        id="user-password"
                        required 
                        type="password" 
                        placeholder="••••••••" 
                        value={form.password} 
                        onChange={e => setForm({...form, password:e.target.value})} 
                        
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                                   focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 text-base" 
                    />
                </div>

                
                <button 
                    type="submit"
                  
                    className="w-full bg-blue-600 text-white font-bold tracking-wide py-3 mt-3 rounded-xl shadow-lg transition duration-200 
                               hover:bg-blue-700 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
                >
                    Login
                </button>
            </div>
            
           
            <div className="mt-6 text-center text-sm">
                
                <p className="mt-2 text-gray-600">
                    Don't have an account? 
                    <a href="/register" className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
             <div className="mt-6 text-center text-sm">
                
                <p className="mt-2 text-gray-600">
                    Admin?
                    <a href="/admin/login" className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline">
                        AdminLogin
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
  );
}
