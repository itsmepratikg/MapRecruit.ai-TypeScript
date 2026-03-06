import json
import os

batches_dir = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches"
all_docs = []

# Collect all 100 documents from the batches
for i in range(1, 11):
    file_path = os.path.join(batches_dir, f"batch_{i}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            all_docs.extend(json.load(f))

# Ensure we have exactly 100
print(f"Total documents collected: {len(all_docs)}")

# Save to a single file formatted as an array for easy pasting into MongoDB Compass/Shell
output_file = r"c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\clients_seed_all.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_docs, f, indent=2)

print(f"Successfully generated {output_file}")
