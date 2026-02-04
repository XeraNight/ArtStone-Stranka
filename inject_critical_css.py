import glob

html_files = glob.glob('*.html')

# We will inject a <style> block into the head that forces the dimensions.
# This ensures that even before the main CSS file loads, the browser knows the layout.

critical_css = """
    <style>
        /* CRITICAL CSS TO PREVENT FOUC/FLICKER */
        header .header-inner { height: 7rem; } /* h-28 = 7rem = 112px */
        header .logo-link { height: 6rem; display: flex; align-items: center; } /* h-24 = 6rem = 96px */
        header img { height: 100% !important; width: auto !important; max-width: none !important; }
    </style>
"""

# We also need to add these classes to the HTML elements if they don't have them, 
# OR just target them by existing classes if they are unique enough.
# The `div` inside header has `class="w-full px-6 h-28..."`.
# The `a` has `class="h-24..."`.
# It's cleaner to add the classes to the elements so the CSS selectors work reliably.

# Let's inspect index.html content pattern again to be sure how to replace.
# Container: <div class="w-full px-6 h-28 flex items-center justify-between relative border-none outline-none">
# Link: <a href="index.html" class="h-24 flex items-center gap-3 group border-none outline-none">

# I'll use a robust replacement strategy.

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Inject Critical CSS into HEAD
    if '/* CRITICAL CSS TO PREVENT FOUC/FLICKER */' not in content:
        # Insert before </head>
        content = content.replace('</head>', critical_css + '\n</head>')
    
    # 2. Add identifying classes to elements for the Critical CSS to target
    # Replace the container div string
    old_div = '<div class="w-full px-6 h-28 flex items-center justify-between relative border-none outline-none">'
    new_div = '<div class="header-inner w-full px-6 h-28 flex items-center justify-between relative border-none outline-none" style="height: 7rem;">'
    
    # Replace the link a string
    old_link = '<a href="index.html" class="h-24 flex items-center gap-3 group border-none outline-none">'
    new_link = '<a href="index.html" class="logo-link h-24 flex items-center gap-3 group border-none outline-none" style="height: 6rem;">'
    
    # Apply replacements
    content = content.replace(old_div, new_div)
    content = content.replace(old_link, new_link)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Injected critical CSS into {file_path}")
