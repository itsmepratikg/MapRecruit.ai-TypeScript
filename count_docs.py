import json
import os

batches_dir = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches"
total_docs = 0
for f in os.listdir(batches_dir):
    if f.startswith('batch_'):
        with open(os.path.join(batches_dir, f), 'r') as file:
            total_docs += len(json.load(file))
print(f"Total docs in batches: {total_docs}")
