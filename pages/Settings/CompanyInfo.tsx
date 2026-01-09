
import React, { useState, useRef } from 'react';
import { 
  Building2, Globe, Save, Upload, MapPin, Clock, 
  Settings, Image, FileText, CheckCircle, AlertCircle 
} from '../../components/Icons';
import { useToast } from '../../components/Toast';

export const CompanyInfo = () => {
  const { addToast, addPromise } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [shortLogoPreview, setShortLogoPreview] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: 'MapRecruit Inc.',
    companyAlias: 'MapRecruit',
    description: 'AI-driven recruitment platform transforming how companies hire.',
    url: 'https://maprecruit.ai',
    department: 'Human Resources',
    
    // Location & Locale
    continent: 'North America',
    country: 'United States',
    countryCode: 'US',
    companyLocations: 'San Francisco, CA; New York, NY; Austin, TX',
    intlPhoneCode: '+1',
    currency: 'USD - US Dollar',
    language: 'English (US)',
    
    // Time & Date
    timeZone: '(GMT-08:00) Pacific Time (US & Canada)',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Configurations
    excludeAllDay: true,
    snoozeNotifications: '1 Hour',
    profileActivityDuration: 90, // Days
    jobRecAccessLevel: 'Company'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const saveAction = new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("Saving Company Info:", formData);
            resolve();
        }, 1000);
    });

    await addPromise(saveAction, {
        loading: 'Saving company settings...',
        success: 'Company information updated successfully.',
        error: 'Failed to save settings.'
    });
  };

  // Mock Image Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'short') => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'main') setLogoPreview(e.target?.result as string);
        else setShortLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Building2 size={24} className="text-emerald-600 dark:text-emerald-400" />
                    Company Information
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Manage your organization's profile, branding, and global settings.
                </p>
            </div>
            <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
            >
                <Save size={18} /> Save Changes
            </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Branding & Basic Info */}
            <div className="xl:col-span-2 space-y-8">
                
                {/* Branding Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Image size={16} className="text-slate-400" /> Branding & Logos
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        {/* Main Logo */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Logo</label>
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative group">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Building2 size={32} className="text-slate-300 dark:text-slate-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer p-2 text-white">
                                            <Upload size={20} />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'main')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 text-xs text-slate-500 dark:text-slate-400">
                                    <p>Recommended size: 400x400px.</p>
                                    <p className="mt-1">JPG, PNG, or SVG allowed.</p>
                                    <label className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer mt-2 block">
                                        Upload New
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'main')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Short Logo */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Short Logo</label>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative group">
                                    {shortLogoPreview ? (
                                        <img src={shortLogoPreview} alt="Icon" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-300 dark:text-slate-600">M</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer p-2 text-white">
                                            <Upload size={16} />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'short')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 text-xs text-slate-500 dark:text-slate-400">
                                    <p>Company Short Logo will be used for favicon not for a collapsed side bar</p>
                                    <p className="mt-1">Recommended size: 64x64px.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Name</label>
                            <input 
                                type="text" 
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Name Alias</label>
                            <input 
                                type="text" 
                                name="companyAlias"
                                value={formData.companyAlias}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company URL</label>
                            <div className="flex">
                                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-600 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-lg text-slate-500 dark:text-slate-300 text-sm">https://</span>
                                <input 
                                    type="text" 
                                    name="url"
                                    value={formData.url.replace('https://', '')}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-r-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 resize-none custom-scrollbar"
                            />
                        </div>
                    </div>
                </div>

                {/* Locations & Geography */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Globe size={16} className="text-slate-400" /> Geography & Location
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Continent</label>
                            <select 
                                name="continent"
                                value={formData.continent}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>North America</option>
                                <option>Europe</option>
                                <option>Asia</option>
                                <option>Australia</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Country</label>
                            <select 
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>India</option>
                                <option>Canada</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Country Code</label>
                            <input 
                                type="text" 
                                name="countryCode"
                                value={formData.countryCode}
                                readOnly
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Intl. Phone Code</label>
                            <input 
                                type="text" 
                                name="intlPhoneCode"
                                value={formData.intlPhoneCode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Locations</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <textarea 
                                name="companyLocations"
                                value={formData.companyLocations}
                                onChange={handleInputChange}
                                placeholder="Enter addresses separated by semicolons"
                                rows={2}
                                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 resize-none custom-scrollbar"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">Separate multiple locations with a semicolon (;)</p>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Settings & Configuration */}
            <div className="space-y-8">
                
                {/* Regional Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" /> Regional & Format
                    </h4>
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Default Language</label>
                            <select 
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Currency</label>
                            <select 
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>USD - US Dollar</option>
                                <option>EUR - Euro</option>
                                <option>GBP - British Pound</option>
                                <option>INR - Indian Rupee</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Time Zone</label>
                            <select 
                                name="timeZone"
                                value={formData.timeZone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>(GMT-08:00) Pacific Time</option>
                                <option>(GMT-05:00) Eastern Time</option>
                                <option>(GMT+00:00) UTC</option>
                                <option>(GMT+01:00) Central European Time</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date Format</label>
                                <select 
                                    name="dateFormat"
                                    value={formData.dateFormat}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                >
                                    <option>MM/DD/YYYY</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Time Format</label>
                                <select 
                                    name="timeFormat"
                                    value={formData.timeFormat}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                >
                                    <option>12h (AM/PM)</option>
                                    <option>24h</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Configuration */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Settings size={16} className="text-slate-400" /> System Configuration
                    </h4>
                    
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Department</label>
                            <input 
                                type="text" 
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Snooze Notifications</label>
                            <select 
                                name="snoozeNotifications"
                                value={formData.snoozeNotifications}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>15 Minutes</option>
                                <option>30 Minutes</option>
                                <option>1 Hour</option>
                                <option>4 Hours</option>
                                <option>1 Day</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Profile Activity Duration</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="profileActivityDuration"
                                    value={formData.profileActivityDuration}
                                    onChange={handleInputChange}
                                    className="w-full pl-3 pr-16 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                />
                                <span className="absolute right-3 top-2.5 text-sm text-slate-500 dark:text-slate-400">Days</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Time before a profile is considered inactive.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Job Rec. Access Level</label>
                            <select 
                                name="jobRecAccessLevel"
                                value={formData.jobRecAccessLevel}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                            >
                                <option>Private (Owner Only)</option>
                                <option>Team Level</option>
                                <option>Company Level</option>
                            </select>
                        </div>

                        <label className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Exclude All Day Events</span>
                            <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.excludeAllDay ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.excludeAllDay ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <input 
                                type="checkbox" 
                                name="excludeAllDay"
                                checked={formData.excludeAllDay}
                                onChange={handleInputChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-bold mb-1">Company-Wide Settings</p>
                        <p className="text-xs opacity-90">Changes made here will affect all users within this organization tenant. Ensure accuracy before saving.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
