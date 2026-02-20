import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    initialValue?: string;
    value?: string;
    onChange?: (content: string) => void;
    disabled?: boolean;
    height?: number | string;
    label?: string; // Kept for compatibility if used elsewhere, though not strictly needed for TinyMCE wrapper itself
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    initialValue,
    value,
    onChange,
    disabled = false,
    height = 500,
    label
}) => {
    const editorRef = useRef<any>(null);

    const handleEditorChange = (content: string, editor: any) => {
        if (onChange) {
            onChange(content);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <Editor
                    // apiKey="your-api-key" // Relying on default/GPL for now
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={initialValue}
                    value={value}
                    disabled={disabled}
                    init={{
                        height: height,
                        menubar: true,
                        license_key: 'gpl',
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                        branding: false,
                        promotion: false,
                        skin: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "oxide-dark" : "oxide",
                        content_css: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "default",
                    }}
                    onEditorChange={handleEditorChange}
                />
            </div>
        </div>
    );
};
