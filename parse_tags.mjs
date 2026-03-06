import fs from 'fs';

let content = fs.readFileSync('.trash/Schema_Data/tagsCollection.json', 'utf8');

// Remove comments
content = content.replace(/\/\*[\s\S]*?\*\//g, '');

// Split on valid object boundaries and wrap in array
let docsStr = '[' + content.trim().replace(/}\s*\{/g, '},{') + ']';

// Replace BSON syntax with standard JSON syntax
docsStr = docsStr.replace(/ObjectId\("([^"]+)"\)/g, '{"$oid": "$1"}');
docsStr = docsStr.replace(/ISODate\("([^"]+)"\)/g, '{"$date": "$1"}');

fs.writeFileSync('tags_parsed.json', docsStr);
console.log('Saved tags_parsed.json');
