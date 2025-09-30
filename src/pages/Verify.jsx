import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

export default function Verify() {
  const { token } = useParams();
  const [msg, setMsg] = useState('Verifying...');

  useEffect(() => {
    async function run() {
      try {
        const res = await API.get(`/auth/verify/${token}`);
        setMsg(res.data.message || 'Verified');
      } catch (err) {
        setMsg(err.response?.data?.message || 'Error verifying');
      }
    }
    run();
  }, [token]);

  return <div className="p-4 rounded-lg bg-green-100 border border-green-400 text-center font-medium shadow-md mx-auto max-w-lg">
    <p className="text-green-800 flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{msg}</span>
    </p>
</div>
}
