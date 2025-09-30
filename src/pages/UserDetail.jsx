import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await API.get(`/admin/users/${id}`);
      setUser(res.data);
      setForm({
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        status: res.data.status || '',
        dob: res.data.dob || '',
        gender: res.data.gender || '',
        address: res.data.address || '',
        skills: res.data.skills || [],
        languages: res.data.languages || [],
        education: res.data.education || [],
        experience: res.data.experience || []
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Add & remove education
  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', institute: '', yearOfCompletion: '', marks: '' }]
    }));
  };
  const deleteEducation = (index) => {
    setForm(prev => {
      const arr = [...(prev.education || [])];
      arr.splice(index, 1);
      return { ...prev, education: arr };
    });
  };

  // Add & remove experience
  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { company: '', designation: '', from: '', to: '', responsibilities: '' }]
    }));
  };
  const deleteExperience = (index) => {
    setForm(prev => {
      const arr = [...(prev.experience || [])];
      arr.splice(index, 1);
      return { ...prev, experience: arr };
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    try {
      const data = new FormData();
      ['fullName','email','phone','status','dob','gender','address'].forEach(k => data.append(k, form[k] || ''));
      if (form.skills) data.append('skills', form.skills.join(','));
      if (form.languages) data.append('languages', form.languages.join(','));
      data.append('education', JSON.stringify(form.education || []));
      data.append('experience', JSON.stringify(form.experience || []));
      if (profilePhoto) data.append('profilePhoto', profilePhoto);
      if (resume) data.append('resume', resume);

      await API.put(`/admin/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('User updated successfully');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  };

  if (!user) return <div>Loading...</div>;





  return (
   <div className=" max-w-full mx-auto bg-gray-50 min-h-screen">
  <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
    
    {/* Header and Profile Photo Section */}
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-6 border-b border-gray-100">

        
        
        {/* Profile Photo Display and Upload */}
        <div className="flex items-center space-x-6 mb-6 sm:mb-0">

            
            {/* Image/Avatar */}
            <div className="relative flex-shrink-0">


                 


                {user.profilePhoto?.url ? (
                    <img 
                      src={user.profilePhoto.url} 
                      alt="profile" 
                      className="w-38 h-38 object-cover rounded-full ring-3 ring-offset-1 ring-black-500 shadow-md"
                    />
                ) : (
                    <div className="w-28 h-28 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-3xl font-bold border-2 border-blue-300">
                        {user.fullName ? user.fullName.charAt(0) : 'U'}
                    </div>
                )}
            </div>
            
            {/* Upload Control */}
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
                    Edit Profile 
                </h2>
                <label className="block text-sm font-medium text-gray-500 mb-2">Update Profile Photo</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setProfilePhoto(e.target.files[0])} 
                    className="block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 cursor-pointer"
                />
            </div>
        </div>

        {/* User Name Tag */}
        <div className="text-right">
            <button 
                    onClick={() => navigate('/admin')} 
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 border border-blue-400 py-2 px-4 rounded-full shadow-md transition duration-200 
                            hover:bg-blue-50 hover:border-blue-500 hover:shadow-lg transform hover:scale-[1.03]"
                    aria-label="Go back to admin page"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Back to Admin</span>
                </button>
            <p className="text-sm font-medium text-gray-500 mt-3">Currently editing:</p>
            <p className="text-2xl font-bold text-blue-600 ">{user.fullName}</p>
            <p className="text-xl font-bold text-black-600">{user.membershipId}</p>
        </div>
    </div>

    {/* Section 1: Basic Information (4-column layout for large screens) */}
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Personal Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      {/* Full Name */}
      <div className="space-y-1">
        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
        <input 
          id="fullName"
          name="fullName" 
          value={form.fullName} 
          onChange={handleChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
        />
      </div>
      
      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
        <input 
          id="email"
          name="email" 
          type="email"
          value={form.email} 
          onChange={handleChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
        />
      </div>
      
      {/* Phone */}
      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
        <input 
          id="phone"
          name="phone" 
          type="tel"
          value={form.phone} 
          onChange={handleChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
        />
      </div>
      
      {/* Status */}
      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">Account Status</label>
        <select 
          id="status"
          name="status" 
          value={form.status} 
          onChange={handleChange} 
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none bg-white"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      
      {/* DOB */}
      <div className="space-y-1">
        <label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</label>
        <input 
          id="dob"
          type="date" 
          name="dob" 
          value={form.dob ? form.dob.slice(0,10) : ''} 
          onChange={handleChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
        />
      </div>
      
      {/* Gender */}
      <div className="space-y-1">
        <label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</label>
        <select 
          id="gender"
          name="gender" 
          value={form.gender} 
          onChange={handleChange} 
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none bg-white"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>


       {/* Address */}
      <div >
        <label htmlFor="address" className="text-sm font-medium text-gray-700">Full Address</label>
        <input 
          id="address"
          name="address" 
          value={form.address} 
          onChange={handleChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
        />
      </div>
      
      {/* Empty divs to maintain grid alignment when fewer than 4 items */}
      <div className="hidden lg:block"></div>
      <div className="hidden lg:block"></div>

    </div>
    
    {/* Section 2: Address, Skills, Languages (Full-width fields) */}
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Abilities</h3>
    <div className="space-y-6 mb-10">
      
     
      
      {/* Skills & Languages (Side-by-side on wide screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="space-y-1">
          <label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input 
            id="skills"
            value={form.skills.join(', ')} 
            onChange={e => setForm({...form, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="e.g., React, Node.js, Tailwind CSS"
          />
        </div>
        
        {/* Languages */}
        <div className="space-y-1">
          <label htmlFor="languages" className="text-sm font-medium text-gray-700">Languages (comma separated)</label>
          <input 
            id="languages"
            value={form.languages.join(', ')} 
            onChange={e => setForm({...form, languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)})} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="e.g., English, Spanish, German"
          />
        </div>
      </div>
    </div>
    
    {/* Section 3: Education and Experience (2-column dynamic sections) */}
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">History</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      
      {/* Education */}
      <div className="border border-blue-200 p-5 rounded-xl bg-blue-50 shadow-inner">
        <h4 className="text-xl font-bold text-blue-700 mb-4">Education 🎓</h4>
        <div className="space-y-4">
          {form.education.map((ed,i) => (
            <div key={i} className="border border-blue-300 p-4 rounded-lg relative bg-white shadow-sm hover:shadow-md transition duration-200">
              <button 
                type="button" 
                onClick={() => deleteEducation(i)} 
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none p-1 rounded-full bg-red-50"
                aria-label="Remove education entry"
              >
                &times;
              </button>
              <input placeholder="Degree/Course" value={ed.degree || ''} onChange={e => { const arr=[...form.education]; arr[i].degree=e.target.value; setForm({...form, education:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm mb-2" />
              <input placeholder="Institute Name" value={ed.institute || ''} onChange={e => { const arr=[...form.education]; arr[i].institute=e.target.value; setForm({...form, education:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm mb-2" />
              <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Completion Year" value={ed.yearOfCompletion || ''} onChange={e => { const arr=[...form.education]; arr[i].yearOfCompletion=e.target.value; setForm({...form, education:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm" />
                  <input placeholder="Marks/GPA" value={ed.marks || ''} onChange={e => { const arr=[...form.education]; arr[i].marks=e.target.value; setForm({...form, education:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm" />
              </div>
            </div>
          ))}
        </div>
        <button 
          type="button" 
          onClick={addEducation} 
          className="w-full mt-4 text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition duration-200 font-semibold py-2 rounded-lg text-sm"
        >
          + Add New Education
        </button>
      </div>

      {/* Experience */}
      <div className="border border-green-200 p-5 rounded-xl bg-green-50 shadow-inner">
        <h4 className="text-xl font-bold text-green-700 mb-4">Experience 💼</h4>
        <div className="space-y-4">
          {form.experience.map((ex,i) => (
            <div key={i} className="border border-green-300 p-4 rounded-lg relative bg-white shadow-sm hover:shadow-md transition duration-200">
              <button 
                type="button" 
                onClick={() => deleteExperience(i)} 
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none p-1 rounded-full bg-red-50"
                aria-label="Remove experience entry"
              >
                &times;
              </button>
              <input placeholder="Company Name" value={ex.company || ''} onChange={e => { const arr=[...form.experience]; arr[i].company=e.target.value; setForm({...form, experience:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm mb-2" />
              <input placeholder="Designation" value={ex.designation || ''} onChange={e => { const arr=[...form.experience]; arr[i].designation=e.target.value; setForm({...form, experience:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm mb-2" />
              <div className="grid grid-cols-2 gap-2 mb-2">
                  <input placeholder="From Date" value={ex.from || ''} onChange={e => { const arr=[...form.experience]; arr[i].from=e.target.value; setForm({...form, experience:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm" />
                  <input placeholder="To Date/Present" value={ex.to || ''} onChange={e => { const arr=[...form.experience]; arr[i].to=e.target.value; setForm({...form, experience:arr}); }} className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm" />
              </div>
              <textarea placeholder="Key Responsibilities" value={ex.responsibilities || ''} onChange={e => { const arr=[...form.experience]; arr[i].responsibilities=e.target.value; setForm({...form, experience:arr}); }} rows="3" className="block w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm resize-none" />
            </div>
          ))}
        </div>
        <button 
          type="button" 
          onClick={addExperience} 
          className="w-full mt-4 text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white transition duration-200 font-semibold py-2 rounded-lg text-sm"
        >
          + Add New Experience
        </button>
      </div>
      
    </div>
    
    {/* Section 4: Resume Upload */}
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Resume</h3>
    <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
        <label className="block text-lg font-bold text-gray-700 mb-4">Resume Document 📄</label>
        
        {/* File Uploader */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Upload New Resume (.pdf, .doc, .docx)</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={e => setResume(e.target.files[0])} 
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-100 file:text-indigo-700
                hover:file:bg-indigo-200 cursor-pointer transition duration-150"
            />
        </div>
        
        {/* Resume Preview */}
        {user.resume?.url && (
          <div className="space-y-3 mt-6 p-4 border border-gray-300 rounded-lg bg-white">
            <h4 className="text-base font-medium text-gray-700 border-b pb-2">Current Resume Preview</h4>
            <iframe
              src={`https://docs.google.com/gview?url=${user.resume.url}&embedded=true`}
              title="Resume Preview"
              style={{ width: '100%', height: '550px', border: '1px solid #ccc', borderRadius: '4px' }}
              className="mb-2"
            />
            <a 
              href={user.resume.url} 
              download={user.resume.filename || 'resume.pdf'} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-150 flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Current Resume
            </a>
          </div>
        )}
      </div>

    {/* Save Button Footer */}
    <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
      <button 
        onClick={save} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Save All Changes
      </button>
    </div>
  </div>
</div>
  );
}
