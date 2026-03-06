import re
import json
from datetime import datetime

file_path = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\.trash\Schema_Data\Clients.json'

def parse_mongo_shell_like(content):
    # This is a very rough parser for the mongo shell-like output
    # We'll try to find documents between /* num */ comments
    
    # Split by the comments /* \d+ */
    # This might match more than just the start of docs, but given the format...
    # Regex for /* 1 */, /* 2 */ etc.
    docs = re.split(r'/\* \d+ \*/', content)
    
    # Filter out empty or whitespace-only results
    docs = [d.strip() for d in docs if d.strip()]
    
    # Take first 100
    docs = docs[:100]
    
    parsed_docs = []
    
    for i, doc_str in enumerate(docs):
        # Rough conversion for standard JSON parsing
        # Replace ObjectId("...") with {"$oid": "..."}
        doc_str = re.sub(r'ObjectId\("([a-f0-9]{24})"\)', r'{"$oid": "\1"}', doc_str)
        # Replace ISODate("...") with {"$date": "..."}
        doc_str = re.sub(r'ISODate\("([^"]+)"\)', r'{"$date": "\1"}', doc_str)
        
        # Numbers like 100.0 or 0.0 might be fine, but let's see. 
        # Standard json.loads should handle them.
        
        try:
            # Note: doc_str might have trailing commas etc if this was an array which it's not.
            # But the re.split might have left some artifacts if the file structure is complex.
            # Let's clean up any trailing comma BEFORE the last closing brace
            doc_str = re.sub(r',\s*\}', '}', doc_str)
            
            # Use json.loads with simple replacement for MongoDB types
            # Actually, to make it work with insert_many, I might need to 
            # remove the $oid and $date wraps and just use the strings, 
            # because the MCP might not support EJSON if it's just raw JS objects.
            
            # Let's try and see. If I use a helper to clean it:
            doc_obj = json.loads(doc_str)
            parsed_docs.append(doc_obj)
        except Exception as e:
            # print(f"Failed to parse document {i+1}: {e}")
            pass
            
    return parsed_docs

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

clients = parse_mongo_shell_like(content)

print(f"Successfully parsed {len(clients)} documents.")

# Output the parsed documents to a file so the agent can read it
output_file = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\parsed_clients.json'
with open(output_file, 'w') as f:
    json.dump(clients, f, indent=2)
