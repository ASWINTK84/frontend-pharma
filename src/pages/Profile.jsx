import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await API.get('/profile');
      const data = res.data;


      if (data.skills && typeof data.skills === 'string') data.skills = data.skills.split(',').map(s => s.trim());
      if (data.languages && typeof data.languages === 'string') data.languages = data.languages.split(',').map(l => l.trim());

      setUser(data);
      setForm(data);
    } catch (err) {
      console.error(err);
    }
  }

  console.log(user);
  


  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', institute: '', yearOfCompletion: '', marks: '' }]
    }));
  };
  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { company: '', designation: '', from: '', to: '', responsibilities: '' }]
    }));
  };

 
  const deleteEducation = index => {
    setForm(prev => {
      const arr = [...(prev.education || [])];
      arr.splice(index, 1);
      return { ...prev, education: arr };
    });
  };
  const deleteExperience = index => {
    setForm(prev => {
      const arr = [...(prev.experience || [])];
      arr.splice(index, 1);
      return { ...prev, experience: arr };
    });
  };


  const save = async () => {
    try {
      const data = new FormData();
      ['fullName', 'dob', 'gender', 'address', 'phone'].forEach(k => data.append(k, form[k] || ''));
      if (form.skills) data.append('skills', form.skills.join(','));
      if (form.languages) data.append('languages', form.languages.join(','));
      data.append('education', JSON.stringify(form.education || []));
      data.append('experience', JSON.stringify(form.experience || []));
      if (profilePhoto) data.append('profilePhoto', profilePhoto);
      if (resume) data.append('resume', resume);

      await API.put('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };


const generateShareLink = async () => {
  if (!user) return;
  try {
    const res = await API.post('/share/create', { userId: user._id, days: 2 });
    console.log(res.data);
    navigator.clipboard.writeText(res.data.shareLink);
    alert('Shareable link copied to clipboard!');
  } catch (err) {
    console.error(err);
    alert('Failed to generate shareable link');
  }
};


  if (!user) return <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700">Loading ...</p>
        </div>
      </div>;

  return (


   <div className=" min-h-screen bg-gray-100"> 
    <div className="mx-auto bg-white shadow-2xl rounded-xl  lg:p-12"> 
         <div className="flex justify-between items-center mb-6 border-b pb-2">
    <h2 className="text-3xl font-extrabold text-gray-900">
      My Professional Profile
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
   

        {!editing ? (
            <div className="space-y-10">
          
                <div className="lg:flex lg:space-x-12 p-8 bg-white border border-gray-200 rounded-xl shadow-xl hover:shadow-2xl transition duration-300"> 
                  
                    <div className="flex-shrink-0 mb-6 lg:mb-0 relative">
                        <img
                            src={user.profilePhoto?.url || 'https://via.placeholder.com/150'}
                            alt="profile photo"
                           
                            className="w-48 h-48 object-cover rounded-full   shadow-2xl mx-auto lg:mx-0"
                        />
                    </div>
                    
               
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 lg:border-l lg:pl-8 border-gray-100"> 
                        
                      
                        <div className="md:col-span-2">
                            <p className="text-3xl font-extrabold text-gray-900">{user.fullName}</p>
                            <p className="text-xl text-indigo-700 font-medium mb-4">{user.email}</p>
                            
                            <div className="grid grid-cols-2 gap-y-2 text-sm"> 
                                <p className="text-gray-600"><strong>Membership ID:</strong></p>
                                <p className="font-semibold text-gray-800">{user.membershipId}</p>

                                <p className="text-gray-600"><strong>Phone:</strong></p>
                                <p className="font-semibold text-gray-800">{user.phone || '-'}</p>

                                <p className="text-gray-600"><strong>Gender:</strong></p>
                                <p className="font-semibold text-gray-800">{user.gender || '-'}</p>
                                
                                <p className="text-gray-600"><strong>D.O.B:</strong></p>
                                <p className="font-semibold text-gray-800">{user.dob ? new Date(user.dob).toLocaleDateString() : '-'}</p>
                            </div>

                            <p className="text-base text-gray-600 mt-4 pt-2 border-t border-gray-200">
                                <strong>Address:</strong> <span className="font-medium text-gray-800">{user.address || '-'}</span>
                            </p>
                        </div>
                        
                       
                        <div className="pt-4 md:pt-0">
                            <p className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">Skills</p>
                            <span className="flex flex-wrap gap-2">
                                {(user.skills || []).length ? user.skills.map((skill, i) => (
                                   
                                    <span key={i} className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md hover:bg-indigo-700 transition">{skill}</span>
                                )) : <span className="text-gray-400 italic text-sm">No skills listed</span>}
                            </span>
                            
                            <p className="text-lg font-bold text-gray-800 mt-6 mb-3 border-b border-gray-300 pb-1">Languages</p>
                            <span className="flex flex-wrap gap-2">
                                {(user.languages || []).length ? user.languages.map((lang, i) => (
                                    
                                    <span key={i} className="bg-pink-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md hover:bg-pink-700 transition">{lang}</span>
                                )) : <span className="text-gray-400 italic text-sm">No languages listed</span>}
                            </span>
                        </div>
                    </div>
                </div>

          
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Education 🎓</h3>
                        {(user.education || []).length ? (
                            <div className="space-y-4">
                                {user.education.map((ed, i) => (
                                    <div key={i} className="p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                        <p className="font-bold text-xl text-gray-900 uppercase mt-1 mb-2">{ed.degree}</p>
                                        <p className="text-md font-bold text-gray-700">{ed.institute} <span className="font-normal text-sm text-gray-500">({ed.yearOfCompletion})</span></p>
                                        <p className="text-sm text-gray-500 mt-1">Marks/GPA: <span className="font-medium text-gray-600">{ed.marks}</span></p>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No education data entered.</div>}
                    </div>

               
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Experience 💼</h3>
                        {(user.experience || []).length ? (
                            <div className="space-y-4">
                                {user.experience.map((ex, i) => (
                                    <div key={i} className="p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                        <p className="font-bold mb-2 text-xl text-gray-900 uppercase">{ex.designation}</p>
                                        <p className="text-md text-purple-700 font-bold">{ex.company} <span className="font-normal text-sm text-gray-500">({ex.from} - {ex.to})</span></p>
                                        <p className="text-sm mt-2">
                                            <strong className="text-gray-700">Responsibilities:</strong> <span className="text-gray-600 italic">{ex.responsibilities}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No experience data entered.</div>}
                    </div>
                </div>
                
             
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Resume 📄</h3>
                    {user.resume?.url ? (
                        <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        
                            <a
                                href={user.resume.url}
                                download={user.resume.filename || 'resume.pdf'}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                            >
                                Download Resume
                                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            </a>
                            
                            
                            <iframe
                                src={`https://docs.google.com/gview?url=${user.resume.url}&embedded=true`}
                                title="Resume Viewer"
                                style={{ width: '100%', height: '700px', border: 'none' }}
                                className="rounded-lg shadow-xl mt-4"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No resume uploaded.</div>
                    )}
                </div>


              
                <div className="space-x-6 pt-6 border-t border-gray-200">
                    <button
                        onClick={generateShareLink}
                        className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]"
                    >
                        Share Profile
                    </button>
                    <button
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-10 p-8 bg-white rounded-xl shadow-2xl border border-indigo-100"> 
    
    <p className="text-3xl font-extrabold border-b-4 border-indigo-400 pb-3">Edit Profile Details </p>

   
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> 
        
        
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 shadow-sm" 
                   value={form.fullName || ''} 
                   onChange={e => setForm({ ...form, fullName: e.target.value })} 
                   placeholder="Enter your full name" />
        </div>
        
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-gray-700 transition duration-150 shadow-sm" 
                   type="date" 
                   value={form.dob ? form.dob.slice(0, 10) : ''} 
                   onChange={e => setForm({ ...form, dob: e.target.value })} />
        </div>
        
       
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex w-full bg-gray-200 rounded-lg p-0.5 shadow-inner">
                {['Male', 'Female', 'Other'].map(g => (
                    <button 
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 text-sm font-semibold py-2 rounded-lg transition duration-200 
                            ${form.gender === g ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'}
                        `}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>

       
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 shadow-sm" 
                   value={form.phone || ''} 
                   onChange={e => setForm({ ...form, phone: e.target.value })} 
                   placeholder="Phone" />
        </div>

      
        <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 shadow-sm" 
                      value={form.address || ''} 
                      onChange={e => setForm({ ...form, address: e.target.value })} 
                      placeholder="Full Address" 
                      rows="3" />
        </div>
    </div>

    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 shadow-sm" 
                   value={(form.skills || []).join(',')} 
                   onChange={e => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()) })} 
                   placeholder="e.g., React, Python, SQL" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
            <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 shadow-sm" 
                   value={(form.languages || []).join(',')} 
                   onChange={e => setForm({ ...form, languages: e.target.value.split(',').map(l => l.trim()) })} 
                   placeholder="e.g., English, Spanish" />
        </div>
    </div>

  
    <div className="space-y-4 p-6 border border-indigo-300 rounded-lg bg-indigo-50 shadow-lg">
        <h3 className="text-xl font-bold text-indigo-800 flex items-center">
            Education Entries <span className="ml-2 text-base text-gray-500 font-normal">(Most Recent First)</span>
        </h3>
        {(form.education || []).map((ed, i) => (
            <div key={i} className="p-4 bg-white border border-indigo-200 rounded-lg relative space-y-3 shadow-md">
                <button type="button" className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition" onClick={() => deleteEducation(i)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Degree" value={ed.degree || ''} onChange={e => { const arr = [...form.education]; arr[i].degree = e.target.value; setForm({ ...form, education: arr }); }} />
                <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Institute" value={ed.institute || ''} onChange={e => { const arr = [...form.education]; arr[i].institute = e.target.value; setForm({ ...form, education: arr }); }} />
                <div className="grid grid-cols-2 gap-3">
                    <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Year of Completion" value={ed.yearOfCompletion || ''} onChange={e => { const arr = [...form.education]; arr[i].yearOfCompletion = e.target.value; setForm({ ...form, education: arr }); }} />
                    <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Marks/GPA" value={ed.marks || ''} onChange={e => { const arr = [...form.education]; arr[i].marks = e.target.value; setForm({ ...form, education: arr }); }} />
                </div>
            </div>
        ))}
        <button onClick={addEducation} className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg mt-2">
            Add Education Entry
        </button>
    </div>


    <div className="space-y-4 p-6 border border-indigo-300 rounded-lg bg-indigo-50 shadow-lg">
        <h3 className="text-xl font-bold text-indigo-800 flex items-center">
            Experience Entries <span className="ml-2 text-base text-gray-500 font-normal">(Most Recent First)</span>
        </h3>
        {(form.experience || []).map((ex, i) => (
            <div key={i} className="p-4 bg-white border border-indigo-200 rounded-lg relative space-y-3 shadow-md">
                <button type="button" className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition" onClick={() => deleteExperience(i)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Company" value={ex.company || ''} onChange={e => { const arr = [...form.experience]; arr[i].company = e.target.value; setForm({ ...form, experience: arr }); }} />
                <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Designation" value={ex.designation || ''} onChange={e => { const arr = [...form.experience]; arr[i].designation = e.target.value; setForm({ ...form, experience: arr }); }} />
                <div className="grid grid-cols-2 gap-3">
                    <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="From (Year/Month)" value={ex.from || ''} onChange={e => { const arr = [...form.experience]; arr[i].from = e.target.value; setForm({ ...form, experience: arr }); }} />
                    <input className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="To (Year/Month)" value={ex.to || ''} onChange={e => { const arr = [...form.experience]; arr[i].to = e.target.value; setForm({ ...form, experience: arr }); }} />
                </div>
                <textarea className="border p-3 w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500" placeholder="Key Responsibilities" value={ex.responsibilities || ''} onChange={e => { const arr = [...form.experience]; arr[i].responsibilities = e.target.value; setForm({ ...form, experience: arr }); }} rows="3" />
            </div>
        ))}
        <button onClick={addExperience} className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg mt-2">
            Add Experience Entry
        </button>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-300">
        <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Profile Photo 📸</label>
            <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={e => setProfilePhoto(e.target.files[0])}
             
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-indigo-400 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer w-full"
            />
        </div>
        <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Resume (PDF, DOC) 📥</label>
            <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={e => setResume(e.target.files[0])}
         
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-indigo-400 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer w-full"
            />
        </div>
    </div>

  
    <div className="space-x-4 pt-8 border-t border-gray-300 flex justify-end">
        <button onClick={() => setEditing(false)} className="px-10 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300">
            Cancel
        </button>
        <button onClick={save} className="px-10 py-3 bg-green-600 text-white font-extrabold rounded-lg shadow-xl hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]">
            Save Changes
        </button>
    </div>
</div>
        )}
    </div>
</div>
  );
}
