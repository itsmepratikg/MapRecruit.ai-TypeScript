import json
import os

input_file = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\parsed_clients.json'
output_dir = r'c:\Users\pratik\MRv5-TSX\MapRecruit.ai-TypeScript-\batches'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(input_file, 'r') as f:
    clients = json.load(f)

# Batch size
batch_size = 10
for i in range(0, len(clients), batch_size):
    batch = clients[i:i + batch_size]
    batch_num = i // batch_size + 1
    output_file = os.path.join(output_dir, f'batch_{batch_num}.json')
    with open(output_file, 'w') as f:
        json.dump(batch, f, indent=2)

print(f"Created {len(clients) // batch_size + (1 if len(clients) % batch_size > 0 else 0)} batches.")
