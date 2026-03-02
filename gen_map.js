const fs = require('fs');
const path = require('path');

function parseMongoExport(filePath) {
    let data = fs.readFileSync(filePath, 'utf8');
    data = '[' + data.replace(/}[\s]*{/g, '},{') + ']';
    // Remove the extra brackets if it was already an array wrap.
    if (data.startsWith('[[')) data = data.substring(1, data.length - 1);
    
    // Replace ObjectId and ISODate
    data = data.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
    data = data.replace(/ISODate\("([^"]+)"\)/g, '"$1"');

    // Handle any trailing comma
    data = data.replace(/,\s*\]$/, ']');
    
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e.message);
        // Print context of error
        const match = /position (\d+)/.exec(e.message);
        if (match) {
            const pos = parseInt(match[1]);
            console.log(data.substring(Math.max(0, pos - 50), pos + 50));
        }
        process.exit(1);
    }
}

const customFieldsPath = path.join(__dirname, '.trash/Schema_Data/CustomFields.json');
const customSectionsPath = path.join(__dirname, '.trash/Schema_Data/customsection.json');

const fields = parseMongoExport(customFieldsPath);
const sections = parseMongoExport(customSectionsPath);

const sectionMap = {};
sections.forEach(s => {
    sectionMap[s._id] = s.name;
});

const grouped = {
    Candidate: [],
    Interview: [],
    Campaign: [],
    Other: []
};

fields.forEach(f => {
    let coll = f.collection ? f.collection.toLowerCase() : '';
    let category = 'Other';
    if (coll === 'profile' || coll === 'resumes') category = 'Candidate';
    else if (coll === 'interview') category = 'Interview';
    else if (coll === 'campaigns') category = 'Campaign';

    grouped[category].push({
        name: f.name,
        sectionName: sectionMap[f.sectionID] || 'Unknown Section',
        collection: f.collection,
        key: f.key,
        type: f.format,
        possibleValues: Array.isArray(f.possibleValues) ? f.possibleValues.join(', ') || 'N/A' : f.possibleValues || 'N/A',
        visible: f.profileView || f.jobView || f.tableColumnView ? 'Visible' : 'Hidden',
        exampleValue: f.defaultValue || (Array.isArray(f.possibleValues) && f.possibleValues.length > 0 ? f.possibleValues[0] : 'Any ' + f.format),
        originalItem: f
    });
});

let md = `# Custom Fields Mapping Document\n\n`;
md += `This document maps custom fields to their respective sections, based on the MongoDB data exports. It is categorized by core system entity.\n\n`;

['Candidate', 'Interview', 'Campaign', 'Other'].forEach(cat => {
    if (grouped[cat].length === 0) return;
    md += `## ${cat} (${grouped[cat].length} fields)\n\n`;
    
    // Group inside category by section
    const bySection = {};
    grouped[cat].forEach(f => {
        if (!bySection[f.sectionName]) bySection[f.sectionName] = [];
        bySection[f.sectionName].push(f);
    });

    for (const [sectionName, secFields] of Object.entries(bySection)) {
        md += `### Section: ${sectionName}\n\n`;
        md += `| Field Name | Key Path | Data Type | Visibility | Possible Values / Example |\n`;
        md += `|---|---|---|---|---|\n`;
        secFields.forEach(f => {
            md += `| ${f.name} | \`${f.key}\` | ${f.type} | ${f.visible} | ${f.possibleValues !== 'N/A' ? 'Enum: ' + f.possibleValues : 'Example: ' + f.exampleValue} |\n`;
        });
        md += `\n`;
    }
});

fs.writeFileSync(path.join(__dirname, 'CustomFieldsMapping.md'), md);
console.log('Successfully generated CustomFieldsMapping.md');
