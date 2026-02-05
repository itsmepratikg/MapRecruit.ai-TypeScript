import DOMPurify from 'dompurify';
import { Activity } from '../types/Activity';

/**
 * Sanitizes HTML content from activity logs.
 * Preserves hyperlinks and basic formatting while stripping scripts.
 */
export const sanitizeActivityHtml = (htmlContent: string | undefined): string => {
    if (!htmlContent) return '';

    return DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'span', 'div', 'p', 'br', 'ul', 'li'],
        ALLOWED_ATTR: ['href', 'target', 'class', 'className', 'style', 'title']
    });
};

/**
 * Determines if an activity should be visible based on context and flags.
 */
export const shouldShowActivity = (activity: Activity, context: {
    companyID: string,
    resumeID?: string,
    campaignID?: string,
    userID?: string
}): boolean => {
    // 1. Basic Flags
    if (activity.deleted) return false;
    if (activity.visible === false) return false; // Explicit false check

    // 2. Company Check (Strict Multi-tenancy)
    if (activity.companyID !== context.companyID) return false;

    // 3. User Filter (Remove Bot/Candidate actions if needed, or keep them)
    // User requested: "Every Activity has a userName key if it is Bot / Candidate then ignore it otherwise use UserID"
    // Interpretation: Ignore Bot/Candidate users?? Or just ignore looking up their ID?
    // "Every Activity has a userName key if it is Bot / Candidate then ignore it otherwise use UserID to find the name of the person"
    // This sounds like "If userName is Bot, don't try to look up userID". 
    // It doesn't inherently mean "Hide the activity". 
    // BUT, if the user implies these are "system" events not for display, we might filter.
    // For now, let's SHOW them but treat them as system events.

    // 4. Context Specific Checks
    if (context.resumeID && activity.resumeID) {
        // Must match ResumeID
        const hasMatch = activity.resumeID.some((id: any) => {
            const val = typeof id === 'object' && id?._id ? id._id : id;
            return val === context.resumeID;
        });
        if (!hasMatch) return false;
    }

    if (context.campaignID && activity.campaignID) {
        // Must match CampaignID
        const hasMatch = activity.campaignID.some((id: any) => {
            const val = typeof id === 'object' && id?._id ? id._id : id;
            return val === context.campaignID;
        });
        if (!hasMatch) return false;
    }

    return true;
};

/**
 * Resolves the display name for the activity actor.
 */
export const getActivityActorName = (activity: Activity): string => {
    const name = activity.userName || 'Unknown';
    if (name === 'Bot' || name === 'MapRecruit Bot' || name === 'Candidate') {
        return name;
    }
    // Ideally we use userID to fetch fresh name if needed, but activity.userName is usually snapshotted.
    return name;
};
