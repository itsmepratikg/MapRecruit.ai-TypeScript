const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '.trash', 'SchemaData', 'campaigns', 'campaigns.json');
let rawData = fs.readFileSync(filePath, 'utf-8');

// Strip out MongoDB export comments like /* 1 */
rawData = rawData.replace(/\/\*[\s\S]*?\*\//g, '');
rawData = rawData.replace(/\/\/.*$/gm, '');

// Convert MongoDB types
rawData = rawData.replace(/ObjectId\(([^)]*)\)/g, '$1');
rawData = rawData.replace(/ISODate\(([^)]*)\)/g, '$1');
rawData = rawData.replace(/NumberInt\(([^)]*)\)/g, '$1');
rawData = rawData.replace(/NumberLong\(([^)]*)\)/g, '$1');
rawData = rawData.replace(/Timestamp\(([^)]*)\)/g, '""');
rawData = rawData.replace(/NumberDecimal\(([^)]*)\)/g, '$1');

let jsCode = '[' + rawData.trim().replace(/}\s*\{/g, '},{') + ']';

let data;
try {
  data = JSON.parse(jsCode);
} catch (e) {
  try {
    // Fallback to eval if JSON.parse still fails due to unquoted keys etc.
    data = eval(jsCode);
  } catch (e2) {
    console.error("Parse and eval both failed:", e.message, e2.message);
    process.exit(1);
  }
}

const fields = new Map();

function extract(obj, prefix = '') {
  if (Array.isArray(obj)) {
    obj.forEach(item => extract(item, prefix));
  } else if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      
      if (Array.isArray(val)) {
        if (!fields.has(newPrefix)) {
          fields.set(newPrefix, { examples: [], types: new Set(['array']) });
        }
        
        if (val.length > 0) {
          if (typeof val[0] === 'object' && val[0] !== null) {
            extract(val, `${newPrefix}[]`);
          } else {
            const fieldData = fields.get(newPrefix);
            val.forEach(v => {
              if (fieldData.examples.length < 3) fieldData.examples.push(v);
              if (typeof v === 'string') fieldData.types.add('string');
              if (typeof v === 'number') fieldData.types.add('number');
            });
          }
        }
      } else if (val !== null && typeof val === 'object') {
        extract(val, newPrefix);
      } else {
        if (!fields.has(newPrefix)) {
          fields.set(newPrefix, { examples: [], types: new Set([typeof val]) });
        }
        const fieldData = fields.get(newPrefix);
        fieldData.types.add(typeof val);
        if (fieldData.examples.length < 3 && val !== null && val !== '') {
          fieldData.examples.push(val);
        }
      }
    }
  }
}

const campaigns = Array.isArray(data) ? data : (data.campaigns || Object.values(data));

campaigns.forEach(c => {
  if (c.screeningRounds) {
    extract(c.screeningRounds, 'screeningRounds');
  } else if (c.rounds) {
    extract(c.rounds, 'rounds');
  } else {
    if (c.campaign && c.campaign.screeningRounds) {
      extract(c.campaign.screeningRounds, 'screeningRounds');
    }
  }
});

const result = {};
for (const [key, val] of fields.entries()) {
  result[key] = {
    example: val.examples[0] !== undefined ? val.examples[0] : null,
    allExamples: val.examples,
    types: Array.from(val.types)
  };
}

fs.writeFileSync(path.join(__dirname, 'extracted_rounds.json'), JSON.stringify(result, null, 2));
console.log('Done extracting fields. Found ' + fields.size + ' unique nested fields.');
