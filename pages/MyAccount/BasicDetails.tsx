
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
   User, Upload, Search, ChevronDown, Check, ChevronLeft,
   MapPin, Mail, Phone, Briefcase, Building2, Users, X
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { useUserProfile } from '../../hooks/useUserProfile';
import { COLORS } from '../../data/profile';
import { userService } from '../../services/api';
import { Save } from '../../components/Icons'; // Ensure Save icon is imported
import PROFILE_SCHEMA from '../../Schema/UserProfileSchema.json';

// --- Constants ---

const ALL_COUNTRIES = [
   { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
   { code: 'US', name: 'USA', dial: '+1', flag: '🇺🇸' },
   { code: 'GB', name: 'UK', dial: '+44', flag: '🇬🇧' },
   { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
   { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
   { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
   { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
   { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
];

// In a real app, this would come from global company settings
const OPERATING_COUNTRIES_CODES = ['US', 'IN', 'GB'];

const COUNTRIES = ALL_COUNTRIES.filter(c => OPERATING_COUNTRIES_CODES.includes(c.code));

// --- Helper Components ---

const ColorDropdown = ({ selected, onSelect }: { selected: string, onSelect: (c: string) => void }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [search, setSearch] = useState('');
   const dropdownRef = useRef<HTMLDivElement>(null);

   const filteredColors = COLORS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-left flex items-center justify-between focus:ring-2 focus:ring-emerald-500 outline-none"
         >
            <span className="text-sm text-slate-700 dark:text-slate-200">{selected || 'Select Colour'}</span>
            <ChevronDown size={16} className="text-slate-400" />
         </button>

         {isOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
               <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="relative">
                     <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                     <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:outline-none dark:text-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                     />
                  </div>
               </div>
               <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredColors.map(color => (
                     <button
                        key={color.name}
                        type="button"
                        onClick={() => { onSelect(color.name); setIsOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between ${selected === color.name ? 'bg-blue-50 dark:bg-blue-900/20 text-emerald-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
                     >
                        <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 rounded-full ${color.class.split(' ')[0]}`}></div>
                           <span>{color.name}</span>
                        </div>
                        {selected === color.name && <Check size={14} />}
                     </button>
                  ))}
                  {filteredColors.length === 0 && (
                     <div className="px-3 py-2 text-xs text-slate-400 text-center">No colors found</div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

const ClientMultiSelect = ({ selected = [], options = [], onSelect }: { selected: string[], options: string[], onSelect: (selected: string[]) => void }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [search, setSearch] = useState('');
   const dropdownRef = useRef<HTMLDivElement>(null);

   const filteredOptions = options.filter(opt => {
      const label = typeof opt === 'string' ? opt : (opt.clientName || opt.name || '');
      return label.toLowerCase().includes(search.toLowerCase());
   });

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const toggleOption = (option: string) => {
      const newSelected = selected.includes(option)
         ? selected.filter(s => s !== option)
         : [...selected, option];
      onSelect(newSelected);
   };

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-left flex items-center justify-between focus:ring-2 focus:ring-emerald-500 outline-none"
         >
            <div className="flex flex-wrap gap-1 max-w-[90%]">
               {selected.length > 0 ? (
                  selected.map(s => (
                     <span key={s} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-semibold">
                        {s}
                     </span>
                  ))
               ) : (
                  <span className="text-sm text-slate-400">Select Clients access...</span>
               )}
            </div>
            <ChevronDown size={16} className="text-slate-400 shrink-0" />
         </button>

         {isOpen && (
            <div className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden min-w-[240px]">
               <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="relative">
                     <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                     <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:outline-none dark:text-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                     />
                  </div>
               </div>
               <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredOptions.map(opt => {
                     const isSelected = selected.includes(opt);
                     return (
                        <button
                           key={opt}
                           type="button"
                           onClick={() => toggleOption(opt)}
                           className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                           <span>{typeof opt === 'string' ? opt : (opt.clientName || opt.name)}</span>
                           {isSelected && (
                              <div className="flex items-center justify-center w-4 h-4 rounded bg-emerald-500 text-white">
                                 <Check size={12} strokeWidth={3} />
                              </div>
                           )}
                        </button>
                     );
                  })}
                  {filteredOptions.length === 0 && (
                     <div className="px-3 py-2 text-xs text-slate-400 text-center">No clients found</div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

// --- Main Component ---

interface BasicDetailsProps {
   userOverride?: any; // If provided, we are editing this user instead of the logged-in user
   onSaveOverride?: (data: any) => void; // If provided, calls this instead of global save
   onBack?: () => void; // If provided, shows back button
}

export const BasicDetails = ({ userOverride, onSaveOverride, onBack }: BasicDetailsProps) => {
   const { t } = useTranslation();
   const { addToast, addPromise } = useToast();
   const { userProfile, clients, saveProfile } = useUserProfile();

   const userId = userOverride?._id || userOverride?.id;
   const isCreating = userOverride && !userId;
   const isSelf = !userOverride;

   // Start in edit mode only if creating a new user, otherwise read mode
   const [isEditing, setIsEditing] = useState(isCreating);

   // Initialize with override data or global profile data
   const [formData, setFormData] = useState(userOverride || userProfile);
   const [zoomLevel, setZoomLevel] = useState(1);
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Sync formData with global state when not editing or when global state changes externally
   // Only if NOT using an override
   useEffect(() => {
      if (!isEditing && !userOverride) {
         setFormData(userProfile);
      }
   }, [userProfile, isEditing, userOverride]);

   // Fix: Sync formData with userOverride when it finishes loading (admin editing another user)
   useEffect(() => {
      if (userOverride) {
         setFormData(userOverride);
      }
   }, [userOverride]);

   const selectedCountry = COUNTRIES.find(c => c.code === formData.countryCode) || COUNTRIES[0];
   const selectedColorObj = COLORS.find(c => c.name === formData.color) || COLORS[0];

   const getInitials = (fname: string, lname: string) => {
      return (fname.charAt(0) + lname.charAt(0)).toUpperCase();
   };

   const handleFileDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      processFile(file);
   };

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
         processFile(e.target.files[0]);
      }
   };

   const processFile = async (file: File) => {
      if (!file) return;
      if (!file.type.match('image.*')) {
         addToast('Only image files (JPG, PNG, GIF) are supported.', 'error');
         return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
         setFormData((prev: any) => ({ ...prev, avatar: e.target?.result as string }));
         setZoomLevel(1);
      };
      reader.readAsDataURL(file);
   };

   const handleSave = async () => {
      // If override is provided, we delegate saving to parent
      if (onSaveOverride) {
         onSaveOverride(formData);
         return;
      }


      // Default behavior: Save via API or local hook fallback
      const saveAction = (async () => {
         if (isCreating) {
            // Create new user (from Users list)
            await userService.create(formData);
         } else if (userId) {
            // Update existing user (Admin override mode)
            await userService.update(userId, formData);
         } else if (isSelf) {
            // My Account (Logged in user) - Save to DB AND update local state
            await userService.update(userProfile._id, formData);
            saveProfile({ ...formData });
         }
      })();

      await addPromise(saveAction, {
         loading: isCreating ? 'Creating user...' : 'Updating profile...',
         success: isCreating ? 'User created successfully.' : 'Profile details updated successfully.',
         error: 'Failed to save changes.'
      });

      if (onBack && isCreating) {
         // If we were creating, go back to list
         onBack();
      } else {
         setIsEditing(false);
      }
   };

   return (
      <div className="p-8 lg:p-12">
         <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
               <div className="flex items-center gap-3">
                  {onBack && (
                     <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                        <ChevronLeft size={20} />
                     </button>
                  )}
                  <div>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <User size={20} className="text-slate-400" /> {isCreating ? t('Create User') : (userOverride ? t('Edit User') : t('Basic Details'))}
                     </h2>
                     {userOverride && <p className="text-xs text-slate-500 mt-1">Managing settings for {formData.firstName} {formData.lastName}</p>}
                  </div>
               </div>
               {!isEditing ? (
                  <button
                     onClick={() => setIsEditing(true)}
                     className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                     {t("Edit")}
                  </button>
               ) : (
                  <div className="flex items-center gap-3">
                     <button
                        onClick={() => {
                           setFormData(userOverride || userProfile); // Reset to original data
                           setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                     >
                        {t("Cancel")}
                     </button>
                     <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                     >
                        <Save size={18} /> {isCreating ? t('Create User') : t('Save Changes')}
                     </button>
                  </div>
               )}
            </div>

            {/* --- Render View Mode (Only if NOT in Admin Override Mode) --- */}
            {!isEditing ? (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Avatar Column - Find avatar field in schema */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                     <div
                        className={`w-48 h-48 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg mb-4 overflow-hidden border-4 border-white dark:border-slate-800 ${!formData.avatar ? selectedColorObj.class : 'bg-slate-100'}`}
                        style={formData.avatar ? {} : { color: 'white' }}
                     >
                        {formData.avatar ? (
                           <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                           getInitials(formData.firstName || '?', formData.lastName || '?')
                        )}
                     </div>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {PROFILE_SCHEMA.fields.find(f => f.key === 'avatar')?.label || 'Profile Photo'}
                     </p>
                  </div>

                  {/* Details Column - Map remaining fields */}
                  <div className="lg:col-span-8 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {PROFILE_SCHEMA.fields
                           .filter(f => f.key !== 'avatar' && f.key !== 'teams' && f.visible)
                           .map(field => {
                              // Handle complex value display
                              let displayValue = formData[field.key];

                              if (field.key === 'phone' && formData.phone) {
                                 displayValue = `${selectedCountry.dial} ${formData.phone}`;
                              } else if (!displayValue) {
                                 displayValue = 'NA';
                              }

                              // Icon mapping (optional, can be added to schema or mapped here)
                              const Icon = {
                                 firstName: User, lastName: User, phone: Phone, email: Mail,
                                 role: Briefcase, jobTitle: Briefcase, location: MapPin,
                                 activeClient: Building2, color: User
                              }[field.key] || User;

                              return (
                                 <div key={field.key} className="space-y-1">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                       <Icon size={12} /> {field.label}
                                    </label>

                                    {field.key === 'color' ? (
                                       <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-1">
                                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{formData.color || 'NA'}</span>
                                          {formData.color && (
                                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedColorObj.class}`}>
                                                {getInitials(formData.firstName || '?', formData.lastName || '?')}
                                             </div>
                                          )}
                                       </div>
                                    ) : (
                                       <p className={`text-sm font-medium text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1 ${field.key !== 'email' ? 'capitalize' : ''}`}>
                                          {displayValue}
                                       </p>
                                    )}
                                 </div>
                              );
                           })}
                     </div>

                     {/* Teams / MultiSelect Section */}
                     {PROFILE_SCHEMA.fields.find(f => f.key === 'teams' && f.visible) && (
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                              <Users size={12} /> {PROFILE_SCHEMA.fields.find(f => f.key === 'teams')?.label}
                           </label>
                           <div className="flex flex-wrap gap-2">
                              {(formData.teams || []).map((client: string, idx: number) => (
                                 <span key={idx} className={`px-2.5 py-1 text-xs font-medium rounded border ${client === formData.activeClient ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                                    {client}
                                 </span>
                              ))}
                              {(!formData.teams || formData.teams.length === 0) && <p className="text-xs text-slate-400">NA</p>}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            ) : (
               /* --- Render Edit Mode --- */
               <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                  <button
                     onClick={() => setIsEditing(false)}
                     className="absolute top-4 left-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors md:hidden"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                     {/* Avatar Edit Section */}
                     <div className="lg:col-span-4 flex flex-col items-center space-y-6">
                        <div className="relative group">
                           <div
                              className={`w-48 h-48 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg mb-4 overflow-hidden border-4 border-white dark:border-slate-800 ${!formData.avatar ? (COLORS.find(c => c.name === formData.color)?.class || "bg-emerald-500 text-white") : 'bg-slate-100'}`}
                           >
                              {formData.avatar ? (
                                 <div
                                    className="w-full h-full overflow-hidden flex items-center justify-center bg-black"
                                 >
                                    <img
                                       src={formData.avatar}
                                       alt="Preview"
                                       style={{ transform: `scale(${zoomLevel})` }}
                                       className="max-w-none transition-transform duration-75 cursor-move"
                                    />
                                 </div>
                              ) : (
                                 getInitials(formData.firstName, formData.lastName)
                              )}
                           </div>
                        </div>

                        <div
                           className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative"
                           onDragOver={(e) => e.preventDefault()}
                           onDrop={handleFileDrop}
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                           />
                           <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                           <p className="text-xs text-slate-500 dark:text-slate-400">
                              Click here or drag and drop the image to upload
                           </p>
                           <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, GIF</p>
                        </div>

                        {formData.avatar && (
                           <div className="w-full space-y-2">
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                                 <span>Zoom</span>
                                 <span>{(zoomLevel * 100).toFixed(0)}%</span>
                              </div>
                              <input
                                 type="range"
                                 min="1"
                                 max="3"
                                 step="0.1"
                                 value={zoomLevel}
                                 onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                 className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                              />
                           </div>
                        )}
                     </div>

                     {/* Form Fields */}
                     <div className="lg:col-span-8 space-y-6">

                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Name <span className="text-red-500">*</span></label>
                           <div className="flex gap-4">
                              <input
                                 type="text"
                                 placeholder="First Name"
                                 value={formData.firstName}
                                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                 className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                              />
                              <input
                                 type="text"
                                 placeholder="Last Name"
                                 value={formData.lastName}
                                 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                 className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Mobile</label>
                           <div className="flex gap-0">
                              <div className="relative">
                                 <select
                                    className="appearance-none pl-9 pr-8 py-2.5 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-lg bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-0 dark:text-slate-200 cursor-pointer min-w-[90px]"
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                 >
                                    {/* Filter here based on operating countries if needed, for now showing all but cleaned up */}
                                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                 </select>
                                 <span className="absolute left-3 top-[11px] text-lg leading-none pointer-events-none flex items-center gap-2">
                                    {selectedCountry.flag}
                                 </span>
                                 <ChevronDown size={14} className="absolute right-2 top-3.5 text-slate-400 pointer-events-none" />
                              </div>
                              <div className="flex items-center justify-center px-3 bg-slate-100 dark:bg-slate-600 border-y border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 text-sm min-w-[3.5rem]">
                                 {selectedCountry.dial}
                              </div>
                              <input
                                 type="text"
                                 value={formData.phone}
                                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                 className="flex-1 px-3 py-2.5 border border-l-0 border-slate-200 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email ID <span className="text-red-500">*</span></label>
                           <input
                              type="text"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={!userOverride} // Only editable if admin overriding
                              className={`w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm ${userOverride ? 'cursor-text bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'cursor-not-allowed'}`}
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Select Role <span className="text-red-500">*</span></label>
                              <div className="relative">
                                 <select
                                    className={`w-full appearance-none px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm ${userOverride ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}
                                    disabled={!userOverride}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                 >
                                    <option value="Product Admin">Product Admin</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Hiring Manager">Hiring Manager</option>
                                 </select>
                                 <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                              </div>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Select Colour</label>
                              <div className="flex gap-3">
                                 <div className="flex-1">
                                    <ColorDropdown
                                       selected={formData.color}
                                       onSelect={(c) => setFormData({ ...formData, color: c })}
                                    />
                                 </div>
                                 <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${selectedColorObj.class}`}>
                                    {getInitials(formData.firstName, formData.lastName)}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">User Job Title</label>
                              <input
                                 type="text"
                                 value={formData.jobTitle}
                                 onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                 className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                              />
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Location</label>
                              <input
                                 type="text"
                                 value={formData.location}
                                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                 className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Clients Access <span className="text-red-500">*</span></label>
                           <ClientMultiSelect
                              selected={formData.teams || []}
                              options={clients}
                              onSelect={(newSelected) => {
                                 setFormData(prev => {
                                    const updated = { ...prev, teams: newSelected };
                                    // If current active client is no longer in selected access, reset active client
                                    if (newSelected.length > 0 && !newSelected.includes(prev.activeClient)) {
                                       updated.activeClient = newSelected[0];
                                    } else if (newSelected.length === 0) {
                                       updated.activeClient = '';
                                    }
                                    return updated;
                                 });
                              }}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Active Client (First Login)</label>
                           <div className="relative">
                              <select
                                 className="w-full appearance-none px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500"
                                 value={formData.activeClient}
                                 onChange={(e) => setFormData({ ...formData, activeClient: e.target.value })}
                              >
                                 <option value="" disabled>Select active client</option>
                                 {(formData.teams || []).map(c => <option key={c} value={c}>{c}</option>)}
                                 {(formData.teams || []).length === 0 && <option disabled>Assign clients access first</option>}
                              </select>
                              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
