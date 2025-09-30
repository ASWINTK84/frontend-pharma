import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

export default function SharedView() {
  const { token } = useParams();
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function run() {
      try {
        const res = await API.get(`/share/view/${token}`);
        setProfile(res.data);
      } catch (err) {
        setMsg(err.response?.data?.message || 'Error');
      }
    }
    run();
  }, [token]);

  if (msg) return <div>{msg}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
   <div className="min-h-screen bg-gray-50 p-8 sm:p-12">

    {/* Centered Profile Card - Increased max-width for more content space */}
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl space-y-8 border-t-8 border-indigo-600 p-8">
        
        {/* Profile Header and Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 pb-8 border-b border-gray-200">
            
            {/* Profile Image */}
            <img 
                src={profile.photo} 
                alt={`${profile.fullName}'s profile`}
                className="w-32 h-32 object-cover rounded-full ring-4 ring-indigo-300 shadow-xl"
            />
            
            {/* Name and Membership */}
            <div className="text-center sm:text-left pt-2">
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                    {profile.fullName}
                </h2>
                <div className="text-md font-medium text-indigo-700 mt-2">
                    <span className="text-gray-500">Membership ID:</span> {profile.membershipId}
                </div>

                <div className="text-md font-medium text-indigo-700 mt-2">
                    <span className="text-gray-500">Email ID:</span> {profile.email}
                </div>
            </div>
        </div>
        
        {/* --- */}

        {/* Main Content Area: Education and Experience in a Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column (Education, Skills, Languages) */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* Education Section */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-indigo-700 border-l-4 border-indigo-500 pl-3">Education 🎓</h3>
                    <div className="space-y-4">
                        {profile.education?.map((e, i) => (
                            <div key={i} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
                                <div className="text-lg font-semibold text-gray-800">{e.degree}</div>
                                <div className="text-sm text-gray-600 italic">
                                    {e.institute} <span className="font-medium text-gray-500">({e.yearOfCompletion})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Skills 💡</h3>
                    <div className="flex flex-wrap gap-2">
                        {(profile.skills || []).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded-full hover:bg-gray-300 transition">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Languages */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Languages 🗣️</h3>
                    <div className="flex flex-wrap gap-2">
                        {(profile.languages || []).map((lang, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded-full hover:bg-gray-300 transition">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Column (Experience and Resume) */}
            <div className="lg:col-span-2 space-y-8">

                {/* Experience Section */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-700 border-l-4 border-indigo-500 pl-3">Experience 💼</h3>
                    <div className="space-y-6">
                        {profile.experience?.map((x, i) => (
                            <div key={i} className="p-5 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition duration-200">
                                <div className="text-xl font-extrabold text-gray-800">{x.designation}</div>
                                <div className="text-md text-purple-700 font-semibold mt-1">
                                    {x.company} 
                                    <span className="text-gray-500 text-sm ml-2 font-normal">({x.from} - {x.to})</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-line">{x.responsibilities}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Resume Download (Integrated into the right column) */}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-indigo-700 border-l-4 border-indigo-500 pl-3 mb-4">Resume 📄</h3>
                    {profile.resume ? (
                        <a 
                            href={profile.resume} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-xl hover:bg-green-700 transition duration-300 transform hover:scale-[1.01] space-x-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Download Resume (PDF/DOC)</span>
                        </a>
                    ) : (
                        <div className="text-gray-500 italic p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            No resume file has been uploaded for this profile.
                        </div>
                    )}
                </div>

            </div>
        </div>

    </div>
</div>
  );
}
