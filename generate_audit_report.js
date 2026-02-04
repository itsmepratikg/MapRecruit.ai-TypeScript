const fs = require('fs');
const path = require('path');

const rootDir = String.raw`c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-`;
const inputFile = path.join(rootDir, 'audit_files.txt');
const outputFile = String.raw`C:\Users\pratik\.gemini\antigravity\brain\3b8a2f93-570f-4e5f-8984-e3c3c78108b5\codebase_audit_report.md`;

try {
    const content = fs.readFileSync(inputFile, 'utf-8');
    // Handle potential BOM or encoding issues by basic trimming
    const files = content.split('\n').map(l => l.trim()).filter(line => line !== '');

    let markdown = `# Codebase Audit Report\n\n`;
    markdown += `**Strategy**: Move specific files to \`.trash\` folder. Do not delete logic.\n\n`;
    markdown += `**Total Candidate Files**: ${files.length}\n\n`;
    markdown += `> **Legend**\n`;
    markdown += `> Use the links below to inspect files before we move them.\n\n`;
    markdown += `| File Name (Clickable) | Relative Path | Category |\n`;
    markdown += `| :--- | :--- | :--- |\n`;

    for (const fullPath of files) {
        // Skip if line is empty or invalid
        if (fullPath.length < 5) continue;

        const basename = path.basename(fullPath);
        let category = 'Other';
        const lowerPath = fullPath.toLowerCase();

        if (lowerPath.includes('\\backend\\')) category = 'Backend';
        else if (lowerPath.includes('\\.agent\\') || lowerPath.includes('\\.claude\\')) category = 'Agent Config';
        else if (lowerPath.includes('\\docs\\') || lowerPath.endsWith('.md')) category = 'Documentation';
        else if (lowerPath.includes('\\schema\\') || lowerPath.includes('\\schemadata\\')) category = 'Data/Schema';
        else if (lowerPath.includes('\\test cases\\')) category = 'Testing';
        else if (lowerPath.includes('\\scripts\\') || lowerPath.endsWith('.js')) category = 'Script';
        else if (lowerPath.endsWith('.json')) category = 'Config/Data';

        // Filter out essential config files from "Other" or "Config" if we want to be safe, 
        // but for the report we list them all so the user sees them.
        // We will mark them as KEEP in the notes if needed, but for now just categorization.

        const fileUrl = `file:///${fullPath.replace(/\\/g, '/')}`;
        let relativePath = fullPath;
        if (fullPath.startsWith(rootDir)) {
            relativePath = fullPath.substring(rootDir.length);
            if (relativePath.startsWith('\\')) relativePath = relativePath.substring(1);
        }

        markdown += `| [${basename}](${fileUrl}) | \`${relativePath}\` | ${category} |\n`;
    }

    fs.writeFileSync(outputFile, markdown);
    console.log('Report generated successfully.');
} catch (err) {
    console.error('Error generating report:', err);
}
