/**
 * Service to handle Microsoft File Picker v8 integration for OneDrive and SharePoint.
 */

const MICROSOFT_CLIENT_ID = "e4338f76-0b52-49e1-893e-4652f1fd9d0e";

declare global {
    interface Window {
        OneDrive: any;
    }
}

export const microsoftPickerService = {
    /**
     * Loads the OneDrive JS SDK.
     */
    loadSdk(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.OneDrive) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.live.net/v7.2/OneDrive.js';
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    },

    /**
     * Opens the Microsoft File Picker.
     * @param onSelect Callback when files are selected.
     * @param multiSelect Whether to allow multiple file selection.
     */
    async openPicker(onSelect: (files: { id: string, name: string, size: number, siteId?: string }[]) => void, multiSelect = false): Promise<void> {
        await this.loadSdk();

        const odOptions = {
            clientId: MICROSOFT_CLIENT_ID,
            action: "download", // We want the @microsoft.graph.downloadUrl
            multiSelect: multiSelect,
            openInNewWindow: true,
            advanced: {
                redirectUri: window.location.origin + "/auth/microsoft/callback",
                queryParameters: "select=id,name,size,webUrl",
                filter: ".pdf,.docx,.txt"
            },
            success: (files: any) => {
                const selectedFiles = files.value.map((file: any) => ({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    siteId: file.parentReference?.siteId // Optional siteId for SharePoint
                }));
                onSelect(selectedFiles);
            },
            cancel: () => {
                console.log("Microsoft Picker canceled");
            },
            error: (err: any) => {
                console.error("Microsoft Picker error:", err);
            }
        };

        window.OneDrive.open(odOptions);
    }
};
