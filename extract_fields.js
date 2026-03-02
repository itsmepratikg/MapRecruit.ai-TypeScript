const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '.trash', 'SchemaData', 'campaigns', 'campaigns.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const fields = new Map(); // path -> { example, types: Set, enums: Set }

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
            extract(val, newPrefix); // Traverse array of objects
          } else {
            // Array of primitives
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

// Ensure the data has campaigns. The prompt says "contains approx. 14 examples of 14 different jobs". It might be an array.
const campaigns = Array.isArray(data) ? data : (data.campaigns || [data]);

campaigns.forEach(c => {
  if (c.screeningRounds) {
    extract(c.screeningRounds, 'screeningRounds');
  } else if (c.rounds) {
    extract(c.rounds, 'rounds');
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
