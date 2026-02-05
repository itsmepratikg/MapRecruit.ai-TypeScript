export interface ActivityUpdatedField {
    fieldName: string;
    sectionName?: string;
    type?: string;
    oldValue?: any;
    newValue?: any;
}

export interface ActivityField {
    type: string;
    value: any;
}

export interface ActivityHtml {
    profileActivity?: string;
    requisitionActivity?: string;
    campaignActivity?: string;
    userActivities?: string;
    commonActivity?: string;
}

export interface Activity {
    _id: string;
    activityTypeID?: string;
    activityType: string;
    activityGroup: 'Standard' | 'Custom' | string;
    code?: string;
    companyID: string;
    clientID?: string;
    campaignID?: (string | any)[]; // IDs or populated objects
    resumeID?: (string | any)[];
    articleID?: string[];
    interviewID?: string[];
    roundNumber?: number;
    createdAt: string; // ISO Date string
    activityAt: string; // ISO Date string
    userName?: string;
    userID?: string;
    version?: string;
    userIcon?: string;
    activityIcon?: string;
    userType?: string;
    mergedResumeID?: string;
    updatedFields?: ActivityUpdatedField[];
    interviewResults?: string;
    page?: string;
    visible?: boolean;
    deleted?: boolean;
    manuallyAdded?: boolean;
    activityTrigger?: boolean;
    activityOf?: string[];
    activityFields?: ActivityField[];
    activity?: ActivityHtml;
    metaData?: Record<string, any>;
    updatedAt?: string;
}

export interface ActivityResponse {
    activities: Activity[];
    total: number;
    page: number;
    pages: number;
}
