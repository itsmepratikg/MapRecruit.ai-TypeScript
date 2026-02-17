
/**
 * Service to handle Google Picker API initialization and display.
 */

const GOOGLE_API_KEY = "AIzaSyCo2m9kx96RU0SpxaMSVPXkAf651Pm8tZs";
const GOOGLE_CLIENT_ID = "1001864596436-5uldln2ve14spbphgo2rpjf02jrntm2d.apps.googleusercontent.com";

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

export const googlePickerService = {
    /**
     * Loads the Google API script.
     */
    loadGapi(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    },

    /**
     * Initializes the Picker API.
     */
    async initPicker(): Promise<void> {
        await this.loadGapi();
        return new Promise((resolve) => {
            window.gapi.load('picker', { callback: resolve });
        });
    },

    /**
     * Opens the Google Picker.
     * @param accessToken Required OAuth token from the user.
     * @param onSelect Callback when files are selected.
     * @param multiSelect Whether to allow multiple file selection.
     */
    async openPicker(accessToken: string, onSelect: (files: { id: string, name: string, sizeBytes: number }[]) => void, multiSelect = false): Promise<void> {
        await this.initPicker();

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
        view.setMimeTypes('application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain');

        const builder = new window.google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken)
            .setDeveloperKey(GOOGLE_API_KEY)
            .setCallback((data: any) => {
                if (data.action === window.google.picker.Action.PICKED) {
                    const selectedFiles = data.docs.map((doc: any) => ({
                        id: doc.id,
                        name: doc.name,
                        sizeBytes: doc.sizeBytes
                    }));
                    onSelect(selectedFiles);
                }
            });

        if (multiSelect) {
            builder.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
        }

        const picker = builder.build();
        picker.setVisible(true);
    }
};
