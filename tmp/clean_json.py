
import json
import re
import os

filepath = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\.trash\Schema_Data\communicationsender.json'
outpath = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\tmp\clean_comm.json'

with open(filepath, 'r') as f:
    content = f.read()

# Replace ObjectId("...") with "..."
content = re.sub(r'ObjectId\("([a-f\d]{24})"\)', r'"\1"', content)
# Replace ISODate("...") with "..."
content = re.sub(r'ISODate\("([^"]+)"\)', r'"\1"', content)

# Try to parse it to ensure it's valid now
try:
    data = json.loads(content)
    with open(outpath, 'w') as f:
        json.dump(data, f)
    print(f"Successfully cleaned {len(data)} documents.")
except Exception as e:
    print(f"Error parsing cleaned JSON: {e}")
    # Sometimes there might be trailing commas in objects or arrays
    # Let's try to remove them if it small
    pass
