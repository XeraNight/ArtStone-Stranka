import glob
import re

html_files = ['produkty.html'] # Only target this file

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Update Grid Layout (3 cols -> 4 cols)
    # Search for: class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    # Replace with: class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    content = content.replace('class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"', 'class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"')
    
    # 2. Update Card Height (500px -> 380px)
    # Search for: h-[500px]
    # Replace with: h-[380px]
    content = content.replace('h-[500px]', 'h-[380px]')
    
    # 3. Update Title Size (text-3xl -> text-xl)
    # Search for: <h3 class="text-3xl font-bold tracking-tight">
    # Replace with: <h3 class="text-xl font-bold tracking-tight">
    content = content.replace('<h3 class="text-3xl font-bold tracking-tight">', '<h3 class="text-xl font-bold tracking-tight">')
    
    # 4. Update Pagination Limit (6 -> 12)
    # Search for: let visibleLimit = 6;
    # Replace with: let visibleLimit = 12;
    content = content.replace('let visibleLimit = 6;', 'let visibleLimit = 12;')
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes for {file_path}")
