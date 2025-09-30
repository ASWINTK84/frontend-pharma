import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('password', form.password);
      if (profilePhoto) data.append('profilePhoto', profilePhoto);
      if (resume) data.append('resume', resume);
      const res = await API.post('/auth/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg(res.data.message);
      navigate('/')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-t-8 border-indigo-600 transform transition duration-500 hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
            Join Our Community 
        </h2>
        
        
        {msg && (
            <div className="mb-6 p-4 text-center text-md font-semibold text-red-700 bg-red-50 border border-red-300 rounded-xl">
                {msg}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            
            
            <input 
                required 
                placeholder="Full Name" 
                value={form.fullName} 
                onChange={e => setForm({...form, fullName: e.target.value})} 
                className="w-full p-4 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition duration-200 placeholder-gray-500 shadow-sm text-gray-800"
            />
            <input 
                required 
                type="email" 
                placeholder="Email Address" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full p-4 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition duration-200 placeholder-gray-500 shadow-sm text-gray-800"
            />
            <input 
                placeholder="Phone Number (Optional)" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                className="w-full p-4 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition duration-200 placeholder-gray-500 shadow-sm text-gray-800"
            />
            <input 
                required 
                type="password" 
                placeholder="Create Password" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                className="w-full p-4 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition duration-200 placeholder-gray-500 shadow-sm text-gray-800"
            />

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (JPG/PNG)</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setProfilePhoto(e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resume (PDF/DOC)</label>
                    <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,application/msword,application/pdf" 
                        onChange={e => setResume(e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 cursor-pointer transition"
                    />
                </div>
            </div>

        
            <button 
                type="submit" 
                className="w-full mt-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-[1.01]"
            >
                Register
            </button>
        </form>

         <div className="mt-6 text-center text-sm">
                
                <p className="mt-2 text-gray-600">
                    Already have an account? 
                    <a href="/" className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline">
                        Login
                    </a>
                </p>
            </div>
    </div>
</div>
  );
}
