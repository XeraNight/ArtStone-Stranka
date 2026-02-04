import glob
import re

html_files = glob.glob('*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remove Tailwind CDN scripts if present
    content = content.replace('<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>', '')
    content = re.sub(r'<script id="tailwind-config">.*?</script>', '', content, flags=re.DOTALL)
    
    # 2. Add <link rel="stylesheet" href="/src/index.css" /> if not present
    if '<link href="/src/index.css" rel="stylesheet"/>' not in content and '<link rel="stylesheet" href="/src/index.css" />' not in content:
        # Insert after meta viewport or charset
        if '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' in content:
             content = content.replace('<meta content="width=device-width, initial-scale=1.0" name="viewport"/>', '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>\n    <link rel="stylesheet" href="/src/index.css" />')
        elif '</head>' in content:
            content = content.replace('</head>', '    <link rel="stylesheet" href="/src/index.css" />\n</head>')
            
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes for {file_path}")
