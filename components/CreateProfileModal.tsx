
import React, { useState } from 'react';
import { X, Upload, User, Mail, Phone, MapPin, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    location: '',
    source: 'Direct',
    skills: ''
  });

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload(e.dataTransfer.files[0]?.name);
  };

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setTimeout(() => {
        setUploading(false);
        // Simulate parsing
        setFormData({
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex.morgan@example.com',
            phone: '+1 (555) 012-3456',
            title: 'Senior Software Engineer',
            company: 'TechFlow Inc.',
            location: 'San Francisco, CA',
            source: 'Upload',
            skills: 'React, TypeScript, Node.js'
        });
        setActiveTab('manual'); // Switch to review
        addToast("Resume parsed successfully! Please review details.", "success");
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Profile created for ${formData.firstName} ${formData.lastName}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Create New Profile</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6">
            <div className="flex gap-4 mb-6 border-b border-slate-100 pb-1">
                <button 
                    onClick={() => setActiveTab('upload')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'upload' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Upload Resume
                </button>
                <button 
                    onClick={() => setActiveTab('manual')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'manual' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Manual Entry
                </button>
            </div>

            {activeTab === 'upload' ? (
                <div 
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                            <p className="text-slate-600 font-medium">Parsing resume...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <Upload size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Drop resume here</h3>
                            <p className="text-sm text-slate-500 mb-6">Supported formats: PDF, DOCX, TXT</p>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                                Browse Files
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <form id="create-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">First Name *</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="John"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Last Name *</label>
                        <input 
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                            placeholder="Doe"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email *</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Job Title</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Current Company</label>
                        <input 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                            placeholder="Current Employer"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="City, State"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Skills (Comma separated)</label>
                        <textarea 
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none h-20 resize-none"
                            placeholder="Java, Python, Leadership, etc."
                        />
                    </div>
                </form>
            )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancel</button>
            {activeTab === 'manual' ? (
                <button form="create-profile-form" type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-colors text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> Create Profile
                </button>
            ) : (
                <button onClick={() => setActiveTab('manual')} className="px-6 py-2 bg-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-300 transition-colors text-sm">
                    Skip Upload
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
