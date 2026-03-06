import json
import os

batches_dir = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches"
all_docs = []
for i in range(1, 11):
    file_path = os.path.join(batches_dir, f"batch_{i}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            all_docs.extend(json.load(f))

# Assuming we have 7 in DB, let's just find the next 5 missing ones
# and I'll manually insert them in smaller batches.
# Wait, let's automate the process of GETTING the next doc content.

def get_db_ids():
    # We can't actually call the tool from here.
    # We'll just hardcode the ones we know are there for now.
    return [
        "6112806bc9147f673d28c6ec",
        "693c61cf97a010153dc4d4b2",
        "697a4077891fda1733d14a31",
        "62d1026687ec2c2f0faa4949",
        "62d102b187ec2c2f0faa494a",
        "62d1049a074e604a7ab72180",
        "62d104c34a907656480d9f47"
    ]

db_ids = get_db_ids()
missing_docs = [doc for doc in all_docs if doc['_id']['$oid'] not in db_ids]

# To avoid token limits, I'll just output the first MISSING doc to a file.
if missing_docs:
    with open('next_missing_doc.json', 'w', encoding='utf-8') as f:
        json.dump(missing_docs[0], f)
    print(f"Next missing doc ID: {missing_docs[0]['_id']['$oid']}")
    print(f"Total missing: {len(missing_docs)}")
else:
    print("All 100 documents seeded!")
