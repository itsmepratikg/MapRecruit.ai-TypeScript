import React from 'react';

// Define the interface based on the 5 analyzed client examples
export interface ClientData {
    _id: string; // Primary ID
    companyID?: string;
    clientName: string;
    clientNameAlias?: string;
    clientCode?: string;
    clientType: string; // Client, Branch, Vendor
    clientURL?: string;
    clientLogo?: string;
    clientBanner?: string;
    description?: string;

    // Geographical
    country: string;
    countryCode?: string;
    language?: string; // Top-level language field (Inherited from Company)

    // Status (Inferred or Explicit)
    status?: string; // Active/Inactive placeholder if missing
    enable?: boolean;

    // Complex Objects (Stored for Detail View, Hidden in Table)
    settings?: {
        defaultTimeZoneName?: string;
        defaultDateFormat?: string;
        defaultLanguageCode?: string;
        jdCompletenessCriteria?: any; // Detailed object
        [key: string]: any; // Allow other settings
    };

    MRIPreferences?: any;
    locations?: any[];
    emails?: any[];
    phones?: any[];
    engageAI?: any;
    ClientUsersList?: any[];

    updatedAt?: string;
    createdAt?: string;
}

export interface SchemaTableColumn<T> {
    key: string;
    title: string;
    sortable?: boolean;
    searchable?: boolean;
    primary?: boolean;
    width?: string;
    render?: (value: any, row: T) => React.ReactNode;
}

export const CLIENT_SCHEMA: SchemaTableColumn<ClientData>[] = [
    {
        key: 'clientLogo',
        title: 'Logo',
        sortable: false,
        searchable: false,
        width: '80px',
        render: (value: string) => {
            if (!value) return <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg" />;
            return (
                <div className="flex items-center justify-center h-8 w-12 bg-white dark:bg-slate-800 rounded p-0.5 border border-slate-100 dark:border-slate-700">
                    <img
                        src={value}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            );
        }
    },
    {
        key: 'clientName',
        title: 'Client Name',
        sortable: true,
        searchable: true,
        primary: true,
        width: '250px',
        render: (value: string, row: ClientData) => (
            <div>
                <div className="font-semibold text-slate-700 dark:text-slate-200">{value}</div>
                {row.clientNameAlias && row.clientNameAlias !== value && (
                    <div className="text-xs text-slate-400">{row.clientNameAlias}</div>
                )}
            </div>
        )
    },
    {
        key: 'clientCode',
        title: 'Code',
        sortable: true,
        searchable: true,
        width: '100px',
        render: (value: string) => <span className="font-mono text-xs">{value || '-'}</span>
    },
    {
        key: 'clientType',
        title: 'Type',
        sortable: true,
        searchable: true,
        width: '100px',
        render: (value: string) => (
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${value === 'Client' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900' :
                    value === 'Vendor' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900' :
                        'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                {value}
            </span>
        )
    },
    {
        key: 'country',
        title: 'Country',
        sortable: true,
        width: '120px'
    },
    {
        key: 'language',
        title: 'Language',
        sortable: true,
        width: '100px',
        render: (value: string) => value || 'English'
    },
    {
        key: 'settings', // Accessing nested object
        title: 'Time Zone',
        sortable: false,
        width: '180px',
        render: (value: any, row: ClientData) => (
            <div className="text-xs text-slate-500 truncate max-w-[150px]" title={row.settings?.defaultTimeZoneName}>
                {row.settings?.defaultTimeZoneName || '-'}
            </div>
        )
    },
    {
        key: 'status',
        title: 'Status',
        sortable: true,
        width: '100px',
        render: (value: string) => (
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${value === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className={value === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                    {value || 'Active'}
                </span>
            </div>
        )
    }
];

export const CLIENT_FILTERS = [
    {
        key: 'clientType',
        label: 'Client Type',
        options: ['Client', 'Branch', 'Vendor']
    },
    {
        key: 'country',
        label: 'Country',
        options: ['United States', 'India', 'United Kingdom']
    }
];
