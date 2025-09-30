import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
   const navigate = useNavigate();

  useEffect(()=>{ load(); },[]);
  async function load() {
    try {
      const d = await API.get('/admin/dashboard');
      setStats(d.data);
      const u = await API.get('/admin/users');
      setUsers(u.data);
    } catch (err) {
      setMsg('Error loading admin data');
    }
  }

  async function blockUser(id) {
    await API.post(`/admin/users/${id}/block`);
    load();
  }

  async function unblockUser(id) {
    await API.post(`/admin/users/${id}/unblock`);
    load();
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await API.delete(`/admin/users/${id}`);
    load();
  }

  if (msg) return <div>{msg}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
 <div className="flex justify-between items-center mb-6 border-b pb-2">
    <h2 className="text-3xl font-extrabold text-gray-900">
      Admin Dashboard
    </h2>

    <button 
      onClick={() => navigate('/')} 
      className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 border border-blue-400 py-2 px-4 rounded-full shadow-md transition duration-200 
                 hover:bg-blue-50 hover:border-blue-500 hover:shadow-lg transform hover:scale-[1.03]"
      aria-label="Go back to admin page"
    >
      <FaArrowLeft className="w-4 h-4" />
      <span>Back to Login</span>
    </button>
  </div>

  

 
  {stats && (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500">Blocked</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.blocked}</p>
        </div>
      </div>
    </>
  )}

 

  


  <div className="bg-white shadow-xl rounded-xl overflow-hidden">
    <h3 className="text-2xl font-semibold p-6 text-gray-800 border-b">Users Management</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membership
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(u => (
            <tr key={u._id} className="hover:bg-indigo-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {u.membershipId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {u.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {u.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
               
                <span
                  className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${u.status === 'active' ? 'bg-green-100 text-green-800' :
                      u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      u.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                >
                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-3">
                
                  {u.status !== 'blocked' ? (
                    <button
                      onClick={() => blockUser(u._id)}
                      className="text-red-600 hover:text-red-900 font-medium p-2 rounded-lg hover:bg-red-50 transition duration-150"
                      title="Block User"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => unblockUser(u._id)}
                      className="text-green-600 hover:text-green-900 font-medium p-2 rounded-lg hover:bg-green-50 transition duration-150"
                      title="Unblock User"
                    >
                      Unblock
                    </button>
                  )}

                
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-gray-600 hover:text-gray-900 font-medium p-2 rounded-lg hover:bg-gray-50 transition duration-150"
                    title="Delete User"
                  >
                    Delete
                  </button>
                  
                  
                  <a
                    href={`/admin/users/${u._id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium p-2 rounded-lg hover:bg-indigo-50 transition duration-150"
                    title="View/Edit User"
                  >
                    View / Edit
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}
