
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeywords: string;
  onSearch: (params: any) => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({ isOpen, onClose, initialKeywords, onSearch }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const [formData, setFormData] = useState<any>({
    keywords: initialKeywords || '',
    location: '', radius: '30', radiusUnit: 'Miles',
    excludeViewed: false, excludeSimilar: false, booleanSearch: false,
    candidateName: '', dateCreated: '', dateUpdated: '',
    candidateType: '', employmentStatus: '', availability: '',
    profileTags: '', folders: '', campaigns: '', source: '', lastActivity: '', excludeKeywords: '', excludeSource: '',
    jobTitle: '', excludeJobTitle: '', company: '', excludeCompany: '',
    includeSkills: '', excludeSkills: '',
    desiredPayFrom: '', desiredPayTo: '', desiredPayPeriod: 'Per Hour', desiredPayCurrency: 'USD',
    minPayFrom: '', minPayTo: '', minPayPeriod: 'Per Hour', minPayCurrency: 'USD',
    currPayFrom: '', currPayTo: '', currPayPeriod: 'Per Hour', currPayCurrency: 'USD',
    experienceFrom: '', experienceTo: '', experiencePeriod: 'Years',
    degree: '', specialization: '', school: ''
  });

  const [keywordChips, setKeywordChips] = useState<string[]>(initialKeywords ? initialKeywords.split(' ') : []);

  useEffect(() => {
    if (isOpen && initialKeywords) {
      setFormData((prev: any) => ({ ...prev, keywords: initialKeywords }));
      setKeywordChips(initialKeywords.split(' ').filter(k => k.trim() !== ''));
    }
  }, [isOpen, initialKeywords]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.keywords.trim()) {
      e.preventDefault();
      setKeywordChips([...keywordChips, formData.keywords.trim()]);
      setFormData((prev: any) => ({ ...prev, keywords: '' }));
    }
  };

  const removeChip = (chip: string) => {
    setKeywordChips(keywordChips.filter(c => c !== chip));
  };

  const handleApply = () => {
    onSearch({ ...formData, keywords: keywordChips.join(' ') });
    onClose();
  };

  const handleClear = () => {
    setFormData({
      keywords: '', location: '', radius: '30', radiusUnit: 'Miles', excludeViewed: false, excludeSimilar: false, booleanSearch: false,
      candidateName: '', dateCreated: '', dateUpdated: '', candidateType: '', employmentStatus: '', availability: '',
      profileTags: '', folders: '', campaigns: '', source: '', lastActivity: '', excludeKeywords: '', excludeSource: '',
      jobTitle: '', excludeJobTitle: '', company: '', excludeCompany: '', includeSkills: '', excludeSkills: '',
      desiredPayFrom: '', desiredPayTo: '', desiredPayPeriod: 'Per Hour', desiredPayCurrency: 'USD',
      minPayFrom: '', minPayTo: '', minPayPeriod: 'Per Hour', minPayCurrency: 'USD',
      currPayFrom: '', currPayTo: '', currPayPeriod: 'Per Hour', currPayCurrency: 'USD',
      experienceFrom: '', experienceTo: '', experiencePeriod: 'Years', degree: '', specialization: '', school: ''
    });
    setKeywordChips([]);
  };

  const renderInput = (label: string, name: string, placeholder = "") => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-slate-400">{label}</label>
      <input
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 outline-none transition-all bg-white dark:bg-slate-900 dark:text-slate-200"
      />
    </div>
  );

  const renderSelect = (label: string, name: string, options: string[] = []) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-slate-400">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:border-green-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="">Select</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const renderRangeGroup = (title: string, namePrefix: string, periods = ['Per Hour', 'Per Year']) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-slate-400 block">{title}</label>
      <div className="grid grid-cols-4 gap-2">
        <input name={`${namePrefix}From`} value={formData[`${namePrefix}From`]} onChange={handleChange} placeholder="From" className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-2.5 focus:border-green-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" />
        <input name={`${namePrefix}To`} value={formData[`${namePrefix}To`]} onChange={handleChange} placeholder="To" className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-2.5 focus:border-green-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" />
        <select name={`${namePrefix}Period`} value={formData[`${namePrefix}Period`]} onChange={handleChange} className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-1 py-2.5 focus:border-green-500 bg-white dark:bg-slate-900 dark:text-slate-200">
          {periods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {namePrefix.includes('Pay') && (
          <select name={`${namePrefix}Currency`} value={formData[`${namePrefix}Currency`]} onChange={handleChange} className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-1 py-2.5 focus:border-green-500 bg-white dark:bg-slate-900 dark:text-slate-200">
            <option>USD</option><option>EUR</option>
          </select>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/80 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Advanced Search</h2>
          <div className="flex gap-2">
            <button onClick={handleClear} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">Clear</button>
            <button onClick={handleApply} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm">Search</button>
            <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800 space-y-8 custom-scrollbar">
          <section>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg mb-4 inline-block">General</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Keywords</label>
                <input
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Type & Enter..."
                  className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:border-green-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-200"
                />
                <div className="flex flex-wrap gap-2 mt-1 min-h-[24px]">
                  {keywordChips.map(chip => (
                    <span key={chip} className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {chip} <button onClick={() => removeChip(chip)}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Location</label>
                <div className="flex gap-2">
                  <input name="location" value={formData.location} onChange={handleChange} placeholder="Enter Location" className="flex-1 text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:border-green-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" />
                  <div className="flex items-center gap-1 w-32">
                    <input type="number" name="radius" value={formData.radius} onChange={handleChange} className="w-12 text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-1 py-2.5 outline-none text-center bg-white dark:bg-slate-900 dark:text-slate-200" />
                    <select name="radiusUnit" value={formData.radiusUnit} onChange={handleChange} className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-1 py-2.5 bg-white dark:bg-slate-900 dark:text-slate-200"><option>Miles</option></select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-6">
                {["Exclude Viewed Profiles", "Exclude Similar Skills", "Boolean Search"].map(label => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-slate-400"><input type="checkbox" className="rounded border-gray-300 text-green-600 bg-white dark:bg-slate-700 dark:border-slate-600" />{label}</label>
                ))}
              </div>

              {renderInput("Candidate Name", "candidateName")}
              <div className="space-y-1.5"><label className="text-xs font-medium text-gray-500 dark:text-slate-400">Profile Created Date</label><input type="date" name="dateCreated" onChange={handleChange} className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-gray-500 dark:text-slate-400">Profile Updated Date</label><input type="date" name="dateUpdated" onChange={handleChange} className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" /></div>

              {renderSelect("Candidate Type", "candidateType", ["W2", "C2C", "Full Time"])}
              {renderSelect("Employment Status", "employmentStatus", ["Employed", "Unemployed"])}
              {renderSelect("Availability", "availability", ["Immediate", "2 Weeks", "1 Month"])}

              {renderSelect("Profile Tags", "profileTags", [])}
              {renderSelect("Folders", "folders", [])}
              {renderSelect("Campaigns", "campaigns", [])}

              {renderSelect("Exclude Profile Tags", "profileTags", [])}
              {renderSelect("Exclude Folders", "folders", [])}
              {renderSelect("Exclude Campaigns", "campaigns", [])}

              {renderInput("Source", "source")}
              <div className="space-y-1.5"><label className="text-xs font-medium text-gray-500 dark:text-slate-400">Last Activity</label><input type="date" name="lastActivity" onChange={handleChange} className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-slate-900 dark:text-slate-200" /></div>
              {renderInput("Exclude Keywords", "excludeKeywords")}
              {renderInput("Exclude Source", "excludeSource")}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg mb-4 inline-block">Professional Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {renderInput("Candidate Job Title", "jobTitle")}
              {renderInput("Exclude Job Title", "excludeJobTitle")}
              {renderInput("Company", "company")}
              {renderInput("Exclude Company", "excludeCompany")}
              {renderInput("Include Skills", "includeSkills")}
              {renderInput("Exclude Skills", "excludeSkills")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {renderRangeGroup("Desired Pay Rate", "desiredPay")}
              {renderRangeGroup("Minimum Pay Rate", "minPay")}
              {renderRangeGroup("Current Pay Rate", "currPay")}
              {renderRangeGroup("Experience", "experience", ['Years', 'Months'])}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg mb-4 inline-block">Qualifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {renderInput("Degree", "degree")}
              {renderInput("Specialization", "specialization")}
              {renderInput("School", "school")}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
