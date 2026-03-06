import json
import os

batches_dir = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches"
all_docs = []
for i in range(1, 11):
    file_path = os.path.join(batches_dir, f"batch_{i}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            all_docs.extend(json.load(f))

db_ids = ["6112806bc9147f673d28c6ec", "693c61cf97a010153dc4d4b2", "697a4077891fda1733d14a31", "62d1026687ec2c2f0faa4949", "62d102b187ec2c2f0faa494a", "62d1049a074e604a7ab72180", "62d104c34a907656480d9f47"]
missing_docs = [doc for doc in all_docs if doc['_id']['$oid'] not in db_ids]
batch_ids_set = set(doc['_id']['$oid'] for doc in all_docs)

print(f"Total docs in batches: {len(all_docs)}")
print(f"Docs from DB in batches: {len(set(db_ids) & batch_ids_set)}")
print(f"Missing: {len(missing_docs)}")
