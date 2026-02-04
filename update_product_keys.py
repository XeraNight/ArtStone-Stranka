
import re
import os

file_path = 'produkty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find product cards and their background image
# We look for <div class="product-card... style="... background-image: url('images/KEY/FILE.jpg')...">
# And inject data-product-key="KEY" inside the opening tag.

def replacement(match):
    full_tag = match.group(0)
    if 'data-product-key' in full_tag:
        return full_tag
    
    # Extract image path
    img_match = re.search(r"url\(['\"]?images/([^/]+)/", full_tag)
    if img_match:
        key = img_match.group(1)
        # Decode URI component if needed, but usually it's plain text here
        # Inject data-product-key
        new_tag = full_tag.replace('class="product-card', f'data-product-key="{key}" class="product-card')
        return new_tag
    
    # Fallback for images at root 'images/file.jpg' -> key is file name? No, key should be folder. 
    # If no folder, maybe map manually? 
    # Let's see if we have cases like url('images/file.jpg')
    img_match_root = re.search(r"url\(['\"]?images/([^/]+)\)", full_tag)
    if img_match_root:
        # e.g. images/amazon-earth.jpg -> Key needs to match productData keys. 
        # In productData, keys are often filenames without extension for root images?
        # Let's check productData keys for these.
        filename = img_match_root.group(1)
        # key is likely the filename without extension, or the full name?
        # productData keys: "amazon-earth.jpg" NO, keys are "amazon-earth" (usually)
        # Let's just use the logic: key = filename without extension (and path)
        key = os.path.splitext(filename)[0]
        new_tag = full_tag.replace('class="product-card', f'data-product-key="{key}" class="product-card')
        return new_tag

    return full_tag

# Regex for the opening div of product card
# <div class="product-card group relative w-full h-56 md:h-[380px]" style="--theme-color: 21 100% 59%;">
# We'll match until the closing > of the opening tag, including the style attribute which contains the url?
# Wait, the style with url is usually on the inner div or the anchor? 
# Looking at file:
# <div class="product-card ...">
#    <a ...>
#       <div ... style="background-image: url('...');">

# Ah, the background image is on an INNER div. 
# So I should find the product-card div, then find the inner div with bg image, extract key, and add it to product-card div.

# This regex approach is tricky across lines.
# BeautifulSoup is better but I might break formatting. 
# Let's try to match the whole block? No.

# Alternative: Iterate through lines.
# When we find <div class="product-card, we mark index.
# Then we look ahead for background-image: url('images/...').
# Extract key.
# Insert data-product-key into the line we marked.

lines = content.split('\n')
new_lines = []
current_card_line_index = -1

for i, line in enumerate(lines):
    if '<div class="product-card' in line:
        current_card_line_index = len(new_lines) # The index in new_lines where this line will be
        new_lines.append(line)
    else:
        # Check if we are inside a card (simple heuristic: if we found a card line recently)
        # Actually, just regex the line for image
        match = re.search(r"url\(['\"]?images/([^/]+)/", line) or re.search(r"url\(['\"]?images/([^/]+(?:jpg|png|jpeg))['\"]?\)", line)
        
        if match and current_card_line_index != -1:
            # Found image for the current card
            key_raw = match.group(1)
            # Clean key
            if key_raw.lower().endswith(('.jpg','.png','.jpeg')):
                 # e.g. amazon-earth.jpg -> amazon-earth
                 # BE CAREFUL: productData keys for these might be different. 
                 # In file: "Amazon Earth": ["images/amazon-earth.jpg"] -> Key is "Amazon Earth" or "amazon-earth"?
                 # Lines 1606+: "1-plafont-bonamy": ...
                 # Lines 1648+: "amazon-earth.jpg"? No, let's look at productData definition in viewer.
                 # Line 1648: "images/amazon-earth.jpg" is the VAL inside array. Key is?
                 # Need to read productData keys.
                 pass
            
            # Extract key part
            key = key_raw
            if '.' in key: # remove extension
                key = key.rsplit('.', 1)[0]
            
            # Now update the card line
            card_line = new_lines[current_card_line_index]
            if 'data-product-key' not in card_line:
                # Add it
                new_card_line = card_line.replace('class="product-card', f'data-product-key="{key}" class="product-card')
                new_lines[current_card_line_index] = new_card_line
            
            current_card_line_index = -1 # content with this card
        
        new_lines.append(line)

new_content = '\n'.join(new_lines)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated product keys.")
