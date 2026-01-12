
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, Globe, Save, Upload, MapPin, Clock, 
  Settings, Image, AlertCircle, CheckCircle, Moon,
  Edit2, X, Plus, Search, ChevronDown, Check
} from '../../components/Icons';
import { useToast } from '../../components/Toast';

// --- DATA CONSTANTS ---

interface CountryData {
  code: string;
  phone: string;
  currency: string;
  lang: string;
  zones: string[];
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

// Helper to generate generic zones for bulk countries
const getGenericZones = (offset: string, name: string) => [`(GMT${offset}) ${name} Time`];

const GEO_DATA: Record<string, Record<string, CountryData>> = {
  'North America': {
    'United States': { code: 'US', phone: '+1', currency: 'USD', lang: 'English (US)', zones: ['(GMT-05:00) Eastern Time', '(GMT-06:00) Central Time', '(GMT-07:00) Mountain Time', '(GMT-08:00) Pacific Time', '(GMT-09:00) Alaska', '(GMT-10:00) Hawaii'], dateFormat: 'MM/DD/YYYY', timeFormat: '12h' },
    'Canada': { code: 'CA', phone: '+1', currency: 'CAD', lang: 'English (CA)', zones: ['(GMT-05:00) Eastern Time', '(GMT-08:00) Pacific Time'], dateFormat: 'YYYY-MM-DD', timeFormat: '12h' },
    'Mexico': { code: 'MX', phone: '+52', currency: 'MXN', lang: 'Spanish', zones: ['(GMT-06:00) Central Time'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Antigua and Barbuda': { code: 'AG', phone: '+1-268', currency: 'XCD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Bahamas': { code: 'BS', phone: '+1-242', currency: 'BSD', lang: 'English', zones: getGenericZones('-05:00', 'EST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Barbados': { code: 'BB', phone: '+1-246', currency: 'BBD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Belize': { code: 'BZ', phone: '+501', currency: 'BZD', lang: 'English', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Costa Rica': { code: 'CR', phone: '+506', currency: 'CRC', lang: 'Spanish', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Cuba': { code: 'CU', phone: '+53', currency: 'CUP', lang: 'Spanish', zones: getGenericZones('-05:00', 'CDT'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Dominica': { code: 'DM', phone: '+1-767', currency: 'XCD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Dominican Republic': { code: 'DO', phone: '+1-809', currency: 'DOP', lang: 'Spanish', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'El Salvador': { code: 'SV', phone: '+503', currency: 'USD', lang: 'Spanish', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Grenada': { code: 'GD', phone: '+1-473', currency: 'XCD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Guatemala': { code: 'GT', phone: '+502', currency: 'GTQ', lang: 'Spanish', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Haiti': { code: 'HT', phone: '+509', currency: 'HTG', lang: 'French', zones: getGenericZones('-05:00', 'EST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Honduras': { code: 'HN', phone: '+504', currency: 'HNL', lang: 'Spanish', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Jamaica': { code: 'JM', phone: '+1-876', currency: 'JMD', lang: 'English', zones: getGenericZones('-05:00', 'EST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Nicaragua': { code: 'NI', phone: '+505', currency: 'NIO', lang: 'Spanish', zones: getGenericZones('-06:00', 'CST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Panama': { code: 'PA', phone: '+507', currency: 'PAB', lang: 'Spanish', zones: getGenericZones('-05:00', 'EST'), dateFormat: 'MM/DD/YYYY', timeFormat: '12h' },
    'Saint Kitts and Nevis': { code: 'KN', phone: '+1-869', currency: 'XCD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Saint Lucia': { code: 'LC', phone: '+1-758', currency: 'XCD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Trinidad and Tobago': { code: 'TT', phone: '+1-868', currency: 'TTD', lang: 'English', zones: getGenericZones('-04:00', 'AST'), dateFormat: 'DD/MM/YYYY', timeFormat: '12h' }
  },
  'Europe': {
    'United Kingdom': { code: 'GB', phone: '+44', currency: 'GBP', lang: 'English (UK)', zones: ['(GMT+00:00) London'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Germany': { code: 'DE', phone: '+49', currency: 'EUR', lang: 'German', zones: ['(GMT+01:00) Berlin'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'France': { code: 'FR', phone: '+33', currency: 'EUR', lang: 'French', zones: ['(GMT+01:00) Paris'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Italy': { code: 'IT', phone: '+39', currency: 'EUR', lang: 'Italian', zones: ['(GMT+01:00) Rome'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Spain': { code: 'ES', phone: '+34', currency: 'EUR', lang: 'Spanish', zones: ['(GMT+01:00) Madrid'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Netherlands': { code: 'NL', phone: '+31', currency: 'EUR', lang: 'Dutch', zones: ['(GMT+01:00) Amsterdam'], dateFormat: 'DD-MM-YYYY', timeFormat: '24h' },
    'Switzerland': { code: 'CH', phone: '+41', currency: 'CHF', lang: 'German', zones: ['(GMT+01:00) Zurich'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Sweden': { code: 'SE', phone: '+46', currency: 'SEK', lang: 'Swedish', zones: ['(GMT+01:00) Stockholm'], dateFormat: 'YYYY-MM-DD', timeFormat: '24h' },
    'Norway': { code: 'NO', phone: '+47', currency: 'NOK', lang: 'Norwegian', zones: ['(GMT+01:00) Oslo'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Denmark': { code: 'DK', phone: '+45', currency: 'DKK', lang: 'Danish', zones: ['(GMT+01:00) Copenhagen'], dateFormat: 'DD-MM-YYYY', timeFormat: '24h' },
    'Finland': { code: 'FI', phone: '+358', currency: 'EUR', lang: 'Finnish', zones: ['(GMT+02:00) Helsinki'], dateFormat: 'D.M.YYYY', timeFormat: '24h' },
    'Ireland': { code: 'IE', phone: '+353', currency: 'EUR', lang: 'English', zones: ['(GMT+00:00) Dublin'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Austria': { code: 'AT', phone: '+43', currency: 'EUR', lang: 'German', zones: ['(GMT+01:00) Vienna'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Belgium': { code: 'BE', phone: '+32', currency: 'EUR', lang: 'Dutch', zones: ['(GMT+01:00) Brussels'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Portugal': { code: 'PT', phone: '+351', currency: 'EUR', lang: 'Portuguese', zones: ['(GMT+00:00) Lisbon'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Poland': { code: 'PL', phone: '+48', currency: 'PLN', lang: 'Polish', zones: ['(GMT+01:00) Warsaw'], dateFormat: 'YYYY-MM-DD', timeFormat: '24h' },
    'Czech Republic': { code: 'CZ', phone: '+420', currency: 'CZK', lang: 'Czech', zones: ['(GMT+01:00) Prague'], dateFormat: 'D.M.YYYY', timeFormat: '24h' },
    'Hungary': { code: 'HU', phone: '+36', currency: 'HUF', lang: 'Hungarian', zones: ['(GMT+01:00) Budapest'], dateFormat: 'YYYY. MM. DD.', timeFormat: '24h' },
    'Greece': { code: 'GR', phone: '+30', currency: 'EUR', lang: 'Greek', zones: ['(GMT+02:00) Athens'], dateFormat: 'D/M/YYYY', timeFormat: '24h' },
    'Romania': { code: 'RO', phone: '+40', currency: 'RON', lang: 'Romanian', zones: ['(GMT+02:00) Bucharest'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Russia': { code: 'RU', phone: '+7', currency: 'RUB', lang: 'Russian', zones: ['(GMT+03:00) Moscow'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Ukraine': { code: 'UA', phone: '+380', currency: 'UAH', lang: 'Ukrainian', zones: ['(GMT+02:00) Kyiv'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' },
    'Turkey': { code: 'TR', phone: '+90', currency: 'TRY', lang: 'Turkish', zones: ['(GMT+03:00) Istanbul'], dateFormat: 'DD.MM.YYYY', timeFormat: '24h' }
  },
  'Asia': {
    'India': { code: 'IN', phone: '+91', currency: 'INR', lang: 'English (IN)', zones: ['(GMT+05:30) New Delhi'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'China': { code: 'CN', phone: '+86', currency: 'CNY', lang: 'Chinese', zones: ['(GMT+08:00) Beijing'], dateFormat: 'YYYY-MM-DD', timeFormat: '24h' },
    'Japan': { code: 'JP', phone: '+81', currency: 'JPY', lang: 'Japanese', zones: ['(GMT+09:00) Tokyo'], dateFormat: 'YYYY/MM/DD', timeFormat: '24h' },
    'South Korea': { code: 'KR', phone: '+82', currency: 'KRW', lang: 'Korean', zones: ['(GMT+09:00) Seoul'], dateFormat: 'YYYY. MM. DD.', timeFormat: '12h' },
    'Singapore': { code: 'SG', phone: '+65', currency: 'SGD', lang: 'English', zones: ['(GMT+08:00) Singapore'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Indonesia': { code: 'ID', phone: '+62', currency: 'IDR', lang: 'Indonesian', zones: ['(GMT+07:00) Jakarta'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Malaysia': { code: 'MY', phone: '+60', currency: 'MYR', lang: 'Malay', zones: ['(GMT+08:00) Kuala Lumpur'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Philippines': { code: 'PH', phone: '+63', currency: 'PHP', lang: 'Filipino', zones: ['(GMT+08:00) Manila'], dateFormat: 'MM/DD/YYYY', timeFormat: '12h' },
    'Thailand': { code: 'TH', phone: '+66', currency: 'THB', lang: 'Thai', zones: ['(GMT+07:00) Bangkok'], dateFormat: 'D/M/YYYY', timeFormat: '24h' },
    'Vietnam': { code: 'VN', phone: '+84', currency: 'VND', lang: 'Vietnamese', zones: ['(GMT+07:00) Ho Chi Minh'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Saudi Arabia': { code: 'SA', phone: '+966', currency: 'SAR', lang: 'Arabic', zones: ['(GMT+03:00) Riyadh'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'UAE': { code: 'AE', phone: '+971', currency: 'AED', lang: 'Arabic', zones: ['(GMT+04:00) Dubai'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Israel': { code: 'IL', phone: '+972', currency: 'ILS', lang: 'Hebrew', zones: ['(GMT+02:00) Jerusalem'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Pakistan': { code: 'PK', phone: '+92', currency: 'PKR', lang: 'Urdu', zones: ['(GMT+05:00) Islamabad'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Bangladesh': { code: 'BD', phone: '+880', currency: 'BDT', lang: 'Bengali', zones: ['(GMT+06:00) Dhaka'], dateFormat: 'DD-MM-YYYY', timeFormat: '12h' }
  },
  'South America': {
    'Brazil': { code: 'BR', phone: '+55', currency: 'BRL', lang: 'Portuguese', zones: ['(GMT-03:00) Sao Paulo'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Argentina': { code: 'AR', phone: '+54', currency: 'ARS', lang: 'Spanish', zones: ['(GMT-03:00) Buenos Aires'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Colombia': { code: 'CO', phone: '+57', currency: 'COP', lang: 'Spanish', zones: ['(GMT-05:00) Bogota'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Chile': { code: 'CL', phone: '+56', currency: 'CLP', lang: 'Spanish', zones: ['(GMT-04:00) Santiago'], dateFormat: 'DD-MM-YYYY', timeFormat: '24h' },
    'Peru': { code: 'PE', phone: '+51', currency: 'PEN', lang: 'Spanish', zones: ['(GMT-05:00) Lima'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Venezuela': { code: 'VE', phone: '+58', currency: 'VES', lang: 'Spanish', zones: ['(GMT-04:00) Caracas'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Ecuador': { code: 'EC', phone: '+593', currency: 'USD', lang: 'Spanish', zones: ['(GMT-05:00) Quito'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' }
  },
  'Africa': {
    'South Africa': { code: 'ZA', phone: '+27', currency: 'ZAR', lang: 'English', zones: ['(GMT+02:00) Johannesburg'], dateFormat: 'YYYY/MM/DD', timeFormat: '24h' },
    'Nigeria': { code: 'NG', phone: '+234', currency: 'NGN', lang: 'English', zones: ['(GMT+01:00) Lagos'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Egypt': { code: 'EG', phone: '+20', currency: 'EGP', lang: 'Arabic', zones: ['(GMT+02:00) Cairo'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Kenya': { code: 'KE', phone: '+254', currency: 'KES', lang: 'English', zones: ['(GMT+03:00) Nairobi'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Morocco': { code: 'MA', phone: '+212', currency: 'MAD', lang: 'Arabic', zones: ['(GMT+01:00) Casablanca'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    'Ghana': { code: 'GH', phone: '+233', currency: 'GHS', lang: 'English', zones: ['(GMT+00:00) Accra'], dateFormat: 'DD/MM/YYYY', timeFormat: '24h' }
  },
  'Oceania': {
    'Australia': { code: 'AU', phone: '+61', currency: 'AUD', lang: 'English', zones: ['(GMT+10:00) Sydney', '(GMT+08:00) Perth'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'New Zealand': { code: 'NZ', phone: '+64', currency: 'NZD', lang: 'English', zones: ['(GMT+12:00) Auckland'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' },
    'Fiji': { code: 'FJ', phone: '+679', currency: 'FJD', lang: 'English', zones: ['(GMT+12:00) Suva'], dateFormat: 'DD/MM/YYYY', timeFormat: '12h' }
  }
};

const ALL_COUNTRIES = Object.values(GEO_DATA).flatMap(continent => Object.keys(continent));

export const CompanyInfo = () => {
  const { addToast, addPromise } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [shortLogoPreview, setShortLogoPreview] = useState<string | null>(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);

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
    operatingLocations: ['United States', 'India', 'United Kingdom'], // Changed from string to array
    intlPhoneCode: '+1',
    currency: 'USD',
    language: 'English (US)',
    
    // Time & Date
    timeZone: '(GMT-08:00) Pacific Time',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Configurations
    excludeAllDay: true,
    doNotDisturb: false,
    profileActivityDuration: 90,
    jobRecAccessLevel: 'Company'
  });

  // Location Search State
  const [locSearch, setLocSearch] = useState('');
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const locDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
      if (!locSearch) return ALL_COUNTRIES;
      return ALL_COUNTRIES.filter(c => c.toLowerCase().includes(locSearch.toLowerCase()));
  }, [locSearch]);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (locDropdownRef.current && !locDropdownRef.current.contains(event.target as Node)) {
              setIsLocDropdownOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cascading Logic for Continent
  const handleContinentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newContinent = e.target.value;
    const firstCountry = Object.keys(GEO_DATA[newContinent])[0];
    const details = GEO_DATA[newContinent][firstCountry];

    setFormData(prev => ({
        ...prev,
        continent: newContinent,
        country: firstCountry,
        countryCode: details.code,
        intlPhoneCode: details.phone,
        currency: details.currency,
        language: details.lang,
        timeZone: details.zones[0],
        dateFormat: details.dateFormat,
        timeFormat: details.timeFormat as '12h' | '24h'
    }));
  };

  // Cascading Logic for Country
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    const details = GEO_DATA[formData.continent][newCountry];

    setFormData(prev => ({
        ...prev,
        country: newCountry,
        countryCode: details.code,
        intlPhoneCode: details.phone,
        currency: details.currency,
        language: details.lang,
        timeZone: details.zones[0],
        dateFormat: details.dateFormat,
        timeFormat: details.timeFormat as '12h' | '24h'
    }));
  };

  const addLocation = (country: string) => {
      if (!formData.operatingLocations.includes(country)) {
          setFormData(prev => ({ ...prev, operatingLocations: [...prev.operatingLocations, country] }));
      }
      setLocSearch('');
      setIsLocDropdownOpen(false);
  };

  const removeLocation = (country: string) => {
      setFormData(prev => ({ ...prev, operatingLocations: prev.operatingLocations.filter(c => c !== country) }));
  };

  const handleStartEdit = () => {
    setBackupData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (backupData) {
        setFormData(backupData);
    }
    setIsEditing(false);
    addToast("Changes discarded", "info");
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
    
    setIsEditing(false);
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
            
            <div className="flex gap-3">
                {isEditing ? (
                    <>
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleStartEdit}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Edit2 size={16} /> Edit Settings
                    </button>
                )}
            </div>
        </div>

        {/* IMPORTANT INFO BANNER */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex gap-3">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-bold mb-1">Company-Wide Settings</p>
                <p className="text-xs opacity-90">Changes made here will affect all users within this organization tenant. Ensure accuracy before saving.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Branding & Basic Info */}
            <div className="xl:col-span-2 space-y-8">
                
                {/* Branding Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-opacity duration-300">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Image size={16} className="text-slate-400" /> Branding & Logos
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        {/* Main Logo */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Logo</label>
                            <div className="flex items-start gap-4">
                                <div className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative group transition-colors ${isEditing ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 cursor-pointer' : 'border-transparent bg-slate-50 dark:bg-slate-900'}`}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Building2 size={32} className="text-slate-300 dark:text-slate-600" />
                                    )}
                                    
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer p-2 text-white">
                                                <Upload size={20} />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'main')} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-xs text-slate-500 dark:text-slate-400">
                                    <p>Recommended size: 400x400px.</p>
                                    <p className="mt-1">JPG, PNG, or SVG allowed.</p>
                                    {isEditing && (
                                        <label className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer mt-2 block">
                                            Upload New
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'main')} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Short Logo */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Short Logo</label>
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative group transition-colors ${isEditing ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 cursor-pointer' : 'border-transparent bg-slate-50 dark:bg-slate-900'}`}>
                                    {shortLogoPreview ? (
                                        <img src={shortLogoPreview} alt="Icon" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-300 dark:text-slate-600">M</span>
                                    )}
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer p-2 text-white">
                                                <Upload size={16} />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'short')} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-xs text-slate-500 dark:text-slate-400">
                                    <p>Used for favicon and collapsed sidebar.</p>
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
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Name Alias</label>
                            <input 
                                type="text" 
                                name="companyAlias"
                                value={formData.companyAlias}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company URL</label>
                            <div className={`flex ${!isEditing ? 'opacity-70' : ''}`}>
                                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-600 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-lg text-slate-500 dark:text-slate-300 text-sm">https://</span>
                                <input 
                                    type="text" 
                                    name="url"
                                    value={formData.url.replace('https://', '')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-r-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 resize-none custom-scrollbar disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Primary Continent</label>
                            <select 
                                name="continent"
                                value={formData.continent}
                                onChange={handleContinentChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            >
                                {Object.keys(GEO_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Primary Country</label>
                            <select 
                                name="country"
                                value={formData.country}
                                onChange={handleCountryChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            >
                                {Object.keys(GEO_DATA[formData.continent]).map(c => <option key={c} value={c}>{c}</option>)}
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
                                readOnly
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Operating Locations Multi-Select */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Operating Countries</label>
                        <div className={`border border-slate-200 dark:border-slate-600 rounded-lg p-3 ${!isEditing ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-700'}`}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.operatingLocations.map(loc => (
                                    <span key={loc} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                                        {loc}
                                        {isEditing && (
                                            <button 
                                                onClick={() => removeLocation(loc)}
                                                className="hover:text-emerald-900 dark:hover:text-emerald-100 p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                                {formData.operatingLocations.length === 0 && <span className="text-sm text-slate-400 italic">No locations selected</span>}
                            </div>
                            
                            {isEditing && (
                                <div className="relative" ref={locDropdownRef}>
                                    <div 
                                        className="flex items-center gap-2 cursor-text border-t border-slate-100 dark:border-slate-600 pt-2"
                                        onClick={() => setIsLocDropdownOpen(true)}
                                    >
                                        <Plus size={14} className="text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Add country..." 
                                            className="flex-1 bg-transparent text-sm outline-none dark:text-slate-200 placeholder-slate-400"
                                            value={locSearch}
                                            onChange={(e) => { setLocSearch(e.target.value); setIsLocDropdownOpen(true); }}
                                            onFocus={() => setIsLocDropdownOpen(true)}
                                        />
                                    </div>
                                    
                                    {isLocDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                                            {filteredCountries.length > 0 ? filteredCountries.map(country => (
                                                <button 
                                                    key={country}
                                                    onClick={() => addLocation(country)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center"
                                                >
                                                    {country}
                                                    {formData.operatingLocations.includes(country) && <Check size={14} className="text-emerald-500" />}
                                                </button>
                                            )) : (
                                                <div className="px-4 py-2 text-sm text-slate-400 italic">No matches found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Define all countries where your company operates for multi-locale features.</p>
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
                            <input 
                                type="text"
                                name="language"
                                value={formData.language}
                                readOnly
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Currency</label>
                            <input 
                                type="text"
                                name="currency"
                                value={formData.currency}
                                readOnly
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Time Zone</label>
                            <select 
                                name="timeZone"
                                value={formData.timeZone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            >
                                {(GEO_DATA[formData.continent]?.[formData.country]?.zones || []).map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date Format</label>
                                <select 
                                    name="dateFormat"
                                    value={formData.dateFormat}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 12/31/2024)</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 31/12/2024)</option>
                                    <option value="DD.MM.YYYY">DD.MM.YYYY (e.g. 31.12.2024)</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2024-12-31)</option>
                                    <option value="YYYY/MM/DD">YYYY/MM/DD (e.g. 2024/12/31)</option>
                                    <option value="D MMMM YYYY">D MMMM YYYY (e.g. 31 December 2024)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Time Format</label>
                                <select 
                                    name="timeFormat"
                                    value={formData.timeFormat}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                                >
                                    <option value="12h">12h (AM/PM)</option>
                                    <option value="24h">24h</option>
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
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                        </div>

                        <div className={`flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors ${isEditing ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50' : 'opacity-70 bg-slate-50 dark:bg-slate-900/50'}`}>
                            <div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <Moon size={16} className="text-indigo-500" /> Do Not Disturb
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Organization Default</span>
                            </div>
                            <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                <input 
                                    type="checkbox" 
                                    name="doNotDisturb"
                                    checked={formData.doNotDisturb}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Profile Activity Duration</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="profileActivityDuration"
                                    value={formData.profileActivityDuration}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full pl-3 pr-16 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                                disabled={!isEditing}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            >
                                <option>Private (Owner Only)</option>
                                <option>Team Level</option>
                                <option>Company Level</option>
                            </select>
                        </div>

                        <label className={`flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors ${isEditing ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : 'opacity-70 bg-slate-50 dark:bg-slate-900/50'}`}>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Exclude All Day Events</span>
                            <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.excludeAllDay ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.excludeAllDay ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <input 
                                type="checkbox" 
                                name="excludeAllDay"
                                checked={formData.excludeAllDay}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
