import glob

html_files = glob.glob('*.html')

# We want to replace the image tag with one that has explicit height/width constraints AND inline styles for immediate application
# Current: <img src="logo-white.png?v=3" alt="Artstone Logo" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="clip-path: inset(0 0 0 2px);">
# New:     <img src="logo-white.png?v=3" alt="Artstone Logo" width="300" height="96" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="height: 6rem; width: auto; clip-path: inset(0 0 0 2px);">
# Note: I'm adding `width="300"` as an estimate to preserve aspect ratio space, but `height="96"` (6rem) is the critical constraint matching h-24.

# Regex might be safer, but string replacement is robust if the string is exact. 
# Based on previous view, the line is consistent.

target_string = '<img src="logo-white.png?v=3" alt="Artstone Logo" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="clip-path: inset(0 0 0 2px);">'
replacement_string = '<img src="logo-white.png?v=3" alt="Artstone Logo" width="auto" height="96" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="height: 6rem; width: auto; clip-path: inset(0 0 0 2px);">'

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if target_string in content:
        new_content = content.replace(target_string, replacement_string)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated logo in {file_path}")
    else:
        print(f"Logo string not found in {file_path}")
