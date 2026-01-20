

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  role: string;
  jobTitle: string;
  location: string;
  color: string;
  activeClient: string;
  clientID: string[]; // List of Client IDs user has access to
  avatar: string | null;
  teams: string[];
  lastActiveAt?: string;

  lastLoginAt?: string;
  loginCount?: number;
  timeZone?: string;
}

export const PROFILE_CLIENTS = [
  "TRC Talent Solutions",
  "Amazon Warehouse Operations",
  "Google Staffing Services",
  "Microsoft HR Tech"
];

export const COLORS = [
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500 text-white' },
  { name: 'Dark Orchid', hex: '#9932cc', class: 'bg-purple-600 text-white' },
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500 text-white' },
  { name: 'Pale Green', hex: '#98fb98', class: 'bg-green-300 text-green-900' },
  { name: 'Light Goldenrod', hex: '#fafad2', class: 'bg-yellow-100 text-yellow-800' },
  { name: 'Coral', hex: '#ff7f50', class: 'bg-orange-400 text-white' },
  { name: 'Light Dark', hex: '#64748b', class: 'bg-slate-500 text-white' },
];

export const INITIAL_PROFILE_DATA: UserProfileData = {
  firstName: "User",
  lastName: "Name",
  email: "user@example.com",
  phone: "7004029399",
  countryCode: "IN",
  role: "Product Admin",
  jobTitle: "User Job Title",
  location: "Hyderabad, Telangana, India",
  color: "Blue",
  activeClient: "TRC Talent Solutions",
  clientID: ["6112806bc9147f673d28c6ec", "69678733d29171da0766d0ae"], // Mock IDs
  avatar: null,
  teams: []
};
