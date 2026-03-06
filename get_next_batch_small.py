import json
import os

db_ids = ["6112806bc9147f673d28c6ec", "693c61cf97a010153dc4d4b2", "697a4077891fda1733d14a31", "62d1026687ec2c2f0faa4949", "62d102b187ec2c2f0faa494a"]
batches_dir = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches"
all_docs = []

for i in range(1, 11):
    file_path = os.path.join(batches_dir, f"batch_{i}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            all_docs.extend(json.load(f))

new_docs = [doc for doc in all_docs if doc['_id']['$oid'] not in db_ids]

# Take 2 docs this time
batch_to_insert = new_docs[:2]
with open('next_batch_small.json', 'w') as f:
    json.dump(batch_to_insert, f)

print(f"Prepared 2 docs. Total remaining: {len(new_docs)}")
